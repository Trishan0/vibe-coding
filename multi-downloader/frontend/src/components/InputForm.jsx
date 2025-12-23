import React, { useState } from 'react';

const InputForm = ({ onSubmit, isLoading }) => {
    const [url, setUrl] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (url.trim()) {
            onSubmit(url);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="input-form">
            <input
                type="text"
                placeholder="Paste video URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
                className="url-input"
            />
            <button type="submit" disabled={isLoading || !url.trim()} className="fetch-btn">
                {isLoading ? 'Fetching...' : 'Get Info'}
            </button>
        </form>
    );
};

export default InputForm;
