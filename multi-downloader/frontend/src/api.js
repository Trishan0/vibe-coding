const API_URL = 'http://localhost:8000/api';

export const getVideoInfo = async (url) => {
    const response = await fetch(`${API_URL}/info`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to fetch video info');
    }
    return response.json();
};

export const downloadVideo = async (url, formatId, isAudio) => {
    const response = await fetch(`${API_URL}/download`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, format_id: formatId, is_audio: isAudio }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to start download');
    }
    return response.json();
};
