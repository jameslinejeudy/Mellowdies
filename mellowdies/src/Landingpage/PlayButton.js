import React, { useState } from 'react';
import fastforward from '../images/icons/fast-forward.png';  // Forward
import pause from '../images/icons/pause.png';  // Pause
import play from '../images/icons/play.png';  // Play
import rewindstart from '../images/icons/startofmusic.png';  // Rewind from the start
import backwards from '../images/icons/backwards.png';  // Backwards
import endofmusic from '../images/icons/endofmusic.png';  // End of music

const buttonContainerStyle = {
    height: '20%',
    width: '75%',
    display: 'flex',
    flexDirection: 'row',  // Arrange buttons horizontally
    position: 'fixed',
    right: '0px',
    bottom: '0px',  // Distance from the bottom of the screen
    alignItems: 'center',  // Align buttons to the center within the container
    boxShadow: '0px 0px 15px 5px rgba(255, 255, 255, 0.6)',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center', 
};

const buttonStyle = {
    background: 'none',  // Remove default button background
    border: 'none',  // Remove default button border
    padding: '10px',  // Add padding for clickable area
    cursor: 'pointer',  // Change cursor to pointer on hover
};

const iconStyle = {
    width: '30px',  // Adjust width of the icons
    height: '30px',  // Adjust height of the icons
};

function PlayButton({ wavesurferRefs, isReady}) {
    const [isPlaying, setIsPlaying] = useState(false);

    const playAllTracks = () => {
        wavesurferRefs.current.forEach(waveSurfer => {
            waveSurfer.playPause();
        });
        setIsPlaying(!isPlaying);
    };

    const seekAllTracks = (seekTo) => {
        wavesurferRefs.current.forEach(waveSurfer => {
            waveSurfer.seekTo(seekTo);
        });
    };

    const forwardAllTracks = () => {
        wavesurferRefs.current.forEach(waveSurfer => {
            const currentTime = waveSurfer.getCurrentTime();
            const duration = waveSurfer.getDuration();
            const newTime = Math.min(currentTime + 5, duration);  // Skip forward 5 seconds, but not beyond the duration
            waveSurfer.seekTo(newTime / duration);  // `seekTo` expects a value between 0 and 1
        });
    };

    const backwardAllTracks = () => {
        wavesurferRefs.current.forEach(waveSurfer => {
            const currentTime = waveSurfer.getCurrentTime();
            const newTime = Math.max(currentTime - 5, 0);  // Skip back 5 seconds, but not before the start
            const duration = waveSurfer.getDuration();
            waveSurfer.seekTo(newTime / duration);  // `seekTo` expects a value between 0 and 1
        });
    };

    return (
        <div style={buttonContainerStyle}>
            <button onClick={() => seekAllTracks(0)} style={buttonStyle} disabled={!isReady}>
                <img src={rewindstart} alt="Go to Start" style={iconStyle} />
            </button>
            <button onClick={backwardAllTracks} style={buttonStyle} disabled={!isReady}>
                <img src={backwards} alt="Backward 5s" style={iconStyle} />
            </button>
            <button id="playbutton" onClick={playAllTracks} style={buttonStyle} disabled={!isReady}>
                <img src={isPlaying ? pause : play} alt="Play/Pause" style={iconStyle} />
            </button>
            <button onClick={forwardAllTracks} style={buttonStyle} disabled={!isReady}>
                <img src={fastforward} alt="Forward 5s" style={iconStyle} />
            </button>
            <button onClick={() => seekAllTracks(1)} style={buttonStyle} disabled={!isReady}>
                <img src={endofmusic} alt="Go to End" style={iconStyle} />
            </button>
        </div>
    );
}

export default PlayButton;
