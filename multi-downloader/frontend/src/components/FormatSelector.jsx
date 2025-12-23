import React from 'react';

const FormatSelector = ({ formats, onDownload }) => {
    const [selectedFormat, setSelectedFormat] = React.useState('');
    const [isAudio, setIsAudio] = React.useState(false);

    // Filter formats to show unique resolutions or meaningful options
    // This is a simple filter, can be improved
    const videoFormats = formats.filter(f => f.vcodec !== 'none');

    const handleDownload = () => {
        if (isAudio) {
            onDownload(null, true);
        } else {
            onDownload(selectedFormat, false);
        }
    };

    return (
        <div className="format-selector">
            <div className="options">
                <label>
                    <input
                        type="radio"
                        name="type"
                        checked={!isAudio}
                        onChange={() => setIsAudio(false)}
                    />
                    Video
                </label>
                <label>
                    <input
                        type="radio"
                        name="type"
                        checked={isAudio}
                        onChange={() => setIsAudio(true)}
                    />
                    Audio Only (MP3)
                </label>
            </div>

            {!isAudio && (
                <select
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className="format-select"
                >
                    <option value="">Select Resolution</option>
                    {videoFormats.map((f) => (
                        <option key={f.format_id} value={f.format_id}>
                            {f.resolution} ({f.ext}) - {f.note}
                        </option>
                    ))}
                </select>
            )}

            <button
                onClick={handleDownload}
                disabled={!isAudio && !selectedFormat}
                className="download-btn"
            >
                Download
            </button>
        </div>
    );
};

export default FormatSelector;
