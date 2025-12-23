import os
import asyncio
import json
from typing import Optional
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import yt_dlp

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active websocket connections
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                pass

manager = ConnectionManager()

class VideoURL(BaseModel):
    url: str

class DownloadRequest(BaseModel):
    url: str
    format_id: str
    is_audio: bool = False

@app.post("/api/info")
async def get_video_info(video: VideoURL):
    try:
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video.url, download=False)
            
            formats = []
            if 'formats' in info:
                for f in info['formats']:
                    # Filter for useful formats (mp4, webm, m4a)
                    if f.get('ext') in ['mp4', 'webm', 'm4a']:
                        formats.append({
                            'format_id': f.get('format_id'),
                            'ext': f.get('ext'),
                            'resolution': f.get('resolution'),
                            'filesize': f.get('filesize'),
                            'note': f.get('format_note'),
                            'vcodec': f.get('vcodec'),
                            'acodec': f.get('acodec'),
                        })
            
            return {
                "title": info.get('title'),
                "thumbnail": info.get('thumbnail'),
                "duration": info.get('duration'),
                "formats": formats
            }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

def progress_hook(d):
    if d['status'] == 'downloading':
        try:
            p = d.get('_percent_str', '0%').replace('%', '')
            progress = {
                'status': 'downloading',
                'filename': d.get('filename'),
                'percent': float(p) if p != 'N/A' else 0,
                'eta': d.get('eta'),
                'speed': d.get('speed')
            }
            # We can't await here easily as this is a sync callback
            # Ideally we'd push this to a queue or use a sync-to-async bridge
            # For simplicity, we might just print or use a global variable to poll
            # But with websockets, we need an async way.
            # A common trick is to use asyncio.run_coroutine_threadsafe if we have the loop
            pass
        except Exception as e:
            print(f"Error in hook: {e}")

@app.post("/api/download")
async def download_video(request: DownloadRequest):
    # This should be a background task or handle async properly
    # For now, we'll run it directly but it might block
    
    # Create downloads directory
    download_path = os.path.join(os.getcwd(), "downloads")
    os.makedirs(download_path, exist_ok=True)
    
    ydl_opts = {
        'format': request.format_id if not request.is_audio else 'bestaudio/best',
        'outtmpl': os.path.join(download_path, '%(title)s.%(ext)s'),
        'progress_hooks': [progress_hook], # This hook needs to be smarter
    }
    
    if request.is_audio:
        ydl_opts['postprocessors'] = [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }]

    try:
        # Running in a thread to avoid blocking the event loop
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, lambda: _download(ydl_opts, request.url))
        return {"status": "completed", "message": "Download started/completed"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def _download(opts, url):
    with yt_dlp.YoutubeDL(opts) as ydl:
        ydl.download([url])

@app.websocket("/api/ws/progress")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# We need a way to send progress from the hook to the websocket
# We can use a global queue or similar mechanism
progress_queue = asyncio.Queue()

async def progress_sender():
    while True:
        data = await progress_queue.get()
        await manager.broadcast(json.dumps(data))
        progress_queue.task_done()

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(progress_sender())

def async_progress_hook(d):
    if d['status'] == 'downloading':
        try:
            p = d.get('_percent_str', '0%').replace('%', '')
            data = {
                'status': 'downloading',
                'filename': os.path.basename(d.get('filename', '')),
                'percent': p,
                'eta': d.get('eta'),
                'speed': d.get('_speed_str'),
                'total_bytes': d.get('total_bytes'),
            }
            # Put in queue safely
            try:
                loop = asyncio.get_event_loop()
                if loop.is_running():
                     asyncio.run_coroutine_threadsafe(progress_queue.put(data), loop)
            except:
                pass # Loop might not be accessible
        except Exception as e:
            print(f"Error in hook: {e}")
    elif d['status'] == 'finished':
         data = {
            'status': 'finished',
            'filename': os.path.basename(d.get('filename', '')),
        }
         try:
            loop = asyncio.get_event_loop()
            if loop.is_running():
                    asyncio.run_coroutine_threadsafe(progress_queue.put(data), loop)
         except:
            pass

# Update the download function to use the new hook
def _download_with_hook(opts, url):
    opts['progress_hooks'] = [async_progress_hook]
    with yt_dlp.YoutubeDL(opts) as ydl:
        ydl.download([url])

@app.post("/api/download_v2")
async def download_video_v2(request: DownloadRequest):
    download_path = os.path.join(os.getcwd(), "downloads")
    os.makedirs(download_path, exist_ok=True)
    
    ydl_opts = {
        'format': request.format_id if not request.is_audio else 'bestaudio/best',
        'outtmpl': os.path.join(download_path, '%(title)s.%(ext)s'),
    }
    
    if request.is_audio:
        ydl_opts['postprocessors'] = [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }]

    try:
        loop = asyncio.get_event_loop()
        # Use the hook wrapper
        await loop.run_in_executor(None, lambda: _download_with_hook(ydl_opts, request.url))
        return {"status": "completed"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
