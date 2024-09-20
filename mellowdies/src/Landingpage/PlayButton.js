import React from 'react';

const buttonContainerStyle = {
    display: 'flex',
    flexDirection: 'column',  // Stack buttons vertically
    position: 'fixed',
    right: '20px',  // Distance from the right edge of the screen
    top: '50%',
    transform: 'translateY(-50%)',  // Center the container vertically
    alignItems: 'flex-end',  // Align buttons to the right within the container
};

function PlayButton({ wavesurferRef, isReady, speed, setSpeed }) {
    const handlePlayPause = () => {
        if (wavesurferRef.current && isReady) {
            wavesurferRef.current.playPause();  // Toggle play/pause
        } else {
            console.log('WaveSurfer is not ready yet.');
        }
    };

    const handleSpeedChange = (speed) => {
        if (wavesurferRef.current && isReady) {
            wavesurferRef.current.setPlaybackRate(speed);
            setSpeed(speed);
        }
    };

    const handleForward = () => {
        if (wavesurferRef.current && isReady) {
            const currentTime = wavesurferRef.current.getCurrentTime();
            const duration = wavesurferRef.current.getDuration();
            const newTime = Math.min(currentTime + 5, duration);  // Skip forward 5 seconds, but not beyond the duration
            wavesurferRef.current.seekTo(newTime / duration);  // `seekTo` expects a value between 0 and 1
        }
    };
    
    const handleBackward = () => {
        if (wavesurferRef.current && isReady) {
            const currentTime = wavesurferRef.current.getCurrentTime();
            const newTime = Math.max(currentTime - 5, 0);  // Skip back 5 seconds, but not before the start
            const duration = wavesurferRef.current.getDuration();
            wavesurferRef.current.seekTo(newTime / duration);  // `seekTo` expects a value between 0 and 1
        }
    };

    return (
        <div style={buttonContainerStyle}>
            <button onClick={handlePlayPause} style={{ padding: '10px 20px', fontSize: '16px', marginBottom: '10px' }} disabled={!isReady}>
                Play/Pause
            </button>
            <button onClick={handleBackward} style={{ padding: '10px 20px', fontSize: '16px', marginBottom: '10px' }} disabled={!isReady}>
                Backward 5s
            </button>
            <button onClick={handleForward} style={{ padding: '10px 20px', fontSize: '16px', marginBottom: '10px' }} disabled={!isReady}>
                Forward 5s
            </button>
            <div style={{ marginBottom: '10px' }}>
                <label htmlFor="speed">Speed: </label>
                <select
                    id="speed"
                    value={speed}
                    onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                    disabled={!isReady}
                    style={{ padding: '5px', fontSize: '16px' }}
                >
                    <option value="0.5">0.5x</option>
                    <option value="1">1x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2x</option>
                </select>
            </div>
        </div>
    );
}

export default PlayButton;
