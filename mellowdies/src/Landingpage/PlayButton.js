import React, { useState } from 'react';
import fastforward from '../images/icons/fast-forward.png';  // Forward
import pause from '../images/icons/pause.png';  // Pause
import play from '../images/icons/play.png';  // Play
import rewindstart from '../images/icons/startofmusic.png';  // Rewind from the start
import backwards from '../images/icons/backwards.png';  // Backwards
import endofmusic from '../images/icons/endofmusic.png';  // End of music

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

function PlayButton({ playAllTracks, forwardAllTracks, backwardAllTracks, seekAllTracks, changeSpeedAllTracks, isReady, speed }) {
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayPause = () => {
        if (isReady) {
            playAllTracks();
            setIsPlaying(!isPlaying);  // Toggle the playing state
        }
    };

    const handleSpeedChange = (newSpeed) => {
        if (isReady) {
            changeSpeedAllTracks(newSpeed);
        }
    };

    return (
        <div style={buttonContainerStyle}>
            <button onClick={() => seekAllTracks(0)} style={buttonStyle} disabled={!isReady}>
                <img src={rewindstart} alt="Go to Start" style={iconStyle} />
            </button>
            <button onClick={backwardAllTracks} style={buttonStyle} disabled={!isReady}>
                <img src={backwards} alt="Backward 5s" style={iconStyle} />
            </button>
            <button onClick={handlePlayPause} style={buttonStyle} disabled={!isReady}>
                <img src={isPlaying ? pause : play} alt="Play/Pause" style={iconStyle} />
            </button>
            <button onClick={forwardAllTracks} style={buttonStyle} disabled={!isReady}>
                <img src={fastforward} alt="Forward 5s" style={iconStyle} />
            </button>
            <button onClick={() => seekAllTracks(1)} style={buttonStyle} disabled={!isReady}>
                <img src={endofmusic} alt="Go to End" style={iconStyle} />
            </button>
            <div style={{ marginBottom: '13px' }}>
                <label htmlFor="speed">SPEED: </label>
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
