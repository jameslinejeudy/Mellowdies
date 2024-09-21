import React, { useState } from 'react';
import fastforward from '../images/fast-forward.png';  // Forward
import pause from '../images/pause.png';  // Pause
import play from '../images/play.png';  // Play
import rewindstart from '../images/startofmusic.png';  // Rewind from the start
import backwards from '../images/backwards.png';  // Backwards
import endofmusic from '../images/endofmusic.png';  // End of music

const buttonContainerStyle = {
    display: 'flex',
    flexDirection: 'row',  // Arrange buttons horizontally
    position: 'fixed',
    bottom: '20px',  // Distance from the bottom of the screen
    left: '65%',
    transform: 'translateX(-50%)',  // Center the container horizontally
    alignItems: 'center',  // Align buttons to the center within the container
};

const buttonStyle = {
    background: 'none',  // Remove default button background
    border: 'none',  // Remove default button border
    padding: '10px',  // Add padding for clickable area
    cursor: 'pointer',  // Change cursor to pointer on hover
    marginBottom: '10px',  // Space between buttons
};

const iconStyle = {
    width: '30px',  // Adjust width of the icons
    height: '30px',  // Adjust height of the icons
};

function PlayButton({ wavesurferRefs, isReady, speed, setSpeed }) {
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayPause = () => {
        if (wavesurferRefs.current.length && isReady) {
            wavesurferRefs.current.forEach(waveSurfer => {
                waveSurfer.playPause();  // Toggle play/pause
            });
            setIsPlaying(!isPlaying);  // Toggle the playing state
        } else {
            console.log('WaveSurfer is not ready yet.');
        }
    };

    const handleSpeedChange = (speed) => {
        if (wavesurferRefs.current.length && isReady) {
            wavesurferRefs.current.forEach(waveSurfer => {
                waveSurfer.setPlaybackRate(speed);
            });
            setSpeed(speed);
        }
    };

    const handleForward = () => {
        if (wavesurferRefs.current.length && isReady) {
            wavesurferRefs.current.forEach(waveSurfer => {
                const currentTime = waveSurfer.getCurrentTime();
                const duration = waveSurfer.getDuration();
                const newTime = Math.min(currentTime + 5, duration);  // Skip forward 5 seconds, but not beyond the duration
                waveSurfer.seekTo(newTime / duration);  // `seekTo` expects a value between 0 and 1
            });
        }
    };
    
    const handleBackward = () => {
        if (wavesurferRefs.current.length && isReady) {
            wavesurferRefs.current.forEach(waveSurfer => {
                const currentTime = waveSurfer.getCurrentTime();
                const newTime = Math.max(currentTime - 5, 0);  // Skip back 5 seconds, but not before the start
                const duration = waveSurfer.getDuration();
                waveSurfer.seekTo(newTime / duration);  // `seekTo` expects a value between 0 and 1
            });
        }
    };

    const handleGoToStart = () => {
        if (wavesurferRefs.current.length && isReady) {
            wavesurferRefs.current.forEach(waveSurfer => {
                waveSurfer.seekTo(0);  // Go to the start of the track
            });
            setIsPlaying(false);  // Reset play/pause state
        }
    };

    const handleGoToEnd = () => {
        if (wavesurferRefs.current.length && isReady) {
            wavesurferRefs.current.forEach(waveSurfer => {
                waveSurfer.seekTo(1);  // Go to the end of the track
            });
            setIsPlaying(false);  // Reset play/pause state
        }
    };

    return (
        <div style={buttonContainerStyle}>
            <button onClick={handleGoToStart} style={buttonStyle} disabled={!isReady}>
                <img src={rewindstart} alt="Go to Start" style={iconStyle} />
            </button>
            <button onClick={handleBackward} style={buttonStyle} disabled={!isReady}>
                <img src={backwards} alt="Backward 5s" style={iconStyle} />
            </button>
            <button onClick={handlePlayPause} style={buttonStyle} disabled={!isReady}>
                <img src={isPlaying ? pause : play} alt="Play/Pause" style={iconStyle} />
            </button>
            <button onClick={handleForward} style={buttonStyle} disabled={!isReady}>
                <img src={fastforward} alt="Forward 5s" style={iconStyle} />
            </button>
            <button onClick={handleGoToEnd} style={buttonStyle} disabled={!isReady}>
                <img src={endofmusic} alt="Go to End" style={iconStyle} />
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
