import React, { useState, useEffect, useRef } from 'react';
import InputForm from './components/InputForm';
import FormatSelector from './components/FormatSelector';
import ProgressBar from './components/ProgressBar';
import { getVideoInfo, downloadVideo } from './api';
import './App.css';

function App() {
  const [videoInfo, setVideoInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(null);
  const ws = useRef(null);

  useEffect(() => {
    // Connect to WebSocket for progress updates
    ws.current = new WebSocket('ws://localhost:8000/api/ws/progress');

    ws.current.onopen = () => {
      console.log('Connected to progress WebSocket');
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setDownloadProgress(data);
    };

    ws.current.onclose = () => {
      console.log('Disconnected from progress WebSocket');
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  const handleUrlSubmit = async (url) => {
    setIsLoading(true);
    setError(null);
    setVideoInfo(null);
    setDownloadProgress(null);
    try {
      const info = await getVideoInfo(url);
      setVideoInfo({ ...info, url }); // Keep URL for download
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (formatId, isAudio) => {
    setError(null);
    try {
      await downloadVideo(videoInfo.url, formatId, isAudio);
      // Progress will be handled by WebSocket
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Multi-Downloader</h1>
        <p>Download videos from YouTube, TikTok, Instagram & more</p>
      </header>

      <main>
        <InputForm onSubmit={handleUrlSubmit} isLoading={isLoading} />

        {error && <div className="error-msg">{error}</div>}

        {videoInfo && (
          <div className="video-info">
            <img src={videoInfo.thumbnail} alt={videoInfo.title} className="thumbnail" />
            <div className="details">
              <h2>{videoInfo.title}</h2>
              <p>Duration: {videoInfo.duration}s</p>
              <FormatSelector formats={videoInfo.formats} onDownload={handleDownload} />
            </div>
          </div>
        )}

        <ProgressBar progress={downloadProgress} />
      </main>
    </div>
  );
}

export default App;
