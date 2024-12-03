import React, { useState } from 'react';
import fastforward from '../images/icons/fast-forward.png';  
import pause from '../images/icons/pause.png';  
import play from '../images/icons/play.png';  
import rewindstart from '../images/icons/startofmusic.png';  
import backwards from '../images/icons/backwards.png';  
import endofmusic from '../images/icons/endofmusic.png';  

const styles = {
    container: {
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
    },
    button: {
        background: 'none',
        border: 'none',
        padding: '10px',
        cursor: 'pointer',
    },
    icon: {
        width: '30px',
        height: '30px',
    },
};

function PlayButton({ wavesurferRefs, isReady }) {
    const [isPlaying, setIsPlaying] = useState(false);

    const applyToAllTracks = (callback) => {
        wavesurferRefs.current.forEach((waveSurfer) => callback(waveSurfer));
    };

    const togglePlayPause = () => {
        applyToAllTracks((waveSurfer) => waveSurfer.playPause());
        setIsPlaying((prev) => !prev);
    };

    const seekToPosition = (position) => {
        applyToAllTracks((waveSurfer) => waveSurfer.seekTo(position));
    };

    const skipTime = (seconds) => {
        applyToAllTracks((waveSurfer) => {
            const currentTime = waveSurfer.getCurrentTime();
            const duration = waveSurfer.getDuration();
            const targetTime = Math.min(Math.max(currentTime + seconds, 0), duration);
            waveSurfer.seekTo(targetTime / duration);
        });
    };

    const buttonConfig = [
        { action: () => seekToPosition(0), icon: rewindstart, alt: 'Rewind to Start' },
        { action: () => skipTime(-5), icon: backwards, alt: 'Skip Backward 5 Seconds' },
        { action: togglePlayPause, icon: isPlaying ? pause : play, alt: 'Play/Pause' },
        { action: () => skipTime(5), icon: fastforward, alt: 'Skip Forward 5 Seconds' },
        { action: () => seekToPosition(1), icon: endofmusic, alt: 'Fast Forward to End' },
    ];

    return (
        <div style={styles.container}>
            {buttonConfig.map(({ action, icon, alt }, index) => (
                <button
                    key={index}
                    onClick={action}
                    style={styles.button}
                    disabled={!isReady}
                    aria-label={alt}
                >
                    <img src={icon} alt={alt} style={styles.icon} />
                </button>
            ))}
        </div>
    );
}

export default PlayButton;
