import React from 'react';

const ProgressBar = ({ progress }) => {
    if (!progress) return null;

    return (
        <div className="progress-container">
            <div className="progress-info">
                <span>{progress.status === 'downloading' ? 'Downloading...' : 'Finished'}</span>
                <span>{progress.percent}%</span>
            </div>
            <div className="progress-bar-bg">
                <div
                    className="progress-bar-fill"
                    style={{ width: `${progress.percent}%` }}
                ></div>
            </div>
            {progress.status === 'downloading' && (
                <div className="progress-details">
                    <span>Speed: {progress.speed}</span>
                    <span>ETA: {progress.eta}s</span>
                </div>
            )}
            {progress.status === 'finished' && (
                <div className="success-msg">Download Complete! Saved to downloads folder.</div>
            )}
        </div>
    );
};

export default ProgressBar;
