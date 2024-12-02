import React, { useState } from 'react';
import fastforward from '../images/icons/fast-forward.png';  
import pause from '../images/icons/pause.png';  
import play from '../images/icons/play.png';  
import rewindstart from '../images/icons/startofmusic.png';  
import backwards from '../images/icons/backwards.png';  
import endofmusic from '../images/icons/endofmusic.png';  

const buttonContainerStyle = {
    height: '20%',
    width: '75%',
    display: 'flex',
    flexDirection: 'row',  
    position: 'fixed',
    right: '0px',
    bottom: '0px',  
    alignItems: 'center',  
    boxShadow: '0px 0px 15px 5px rgba(255, 255, 255, 0.6)',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center', 
};

const buttonStyle = {
    background: 'none',  
    border: 'none',  
    padding: '10px',  
    cursor: 'pointer',  
};

const iconStyle = {
    width: '30px',  
    height: '30px',  
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
            const newTime = Math.min(currentTime + 5, duration);  
            waveSurfer.seekTo(newTime / duration);  
        });
    };

    const backwardAllTracks = () => {
        wavesurferRefs.current.forEach(waveSurfer => {
            const currentTime = waveSurfer.getCurrentTime();
            const newTime = Math.max(currentTime - 5, 0);  
            const duration = waveSurfer.getDuration();
            waveSurfer.seekTo(newTime / duration);  
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
