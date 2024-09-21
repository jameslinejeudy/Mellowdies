import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.js';
import cloud from '../images/cloud.png';
import PlayButton from './PlayButton.js';

const pagebackground = {
    backgroundSize: 'cover',
    backgroundImage: `url(${cloud})`,
    backgroundPosition: 'center',
    padding: '10px',
    height: '100vh',
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Concert One',
};

const musicbackground = {
    width: '75%',
    height: '80%',
    position: 'fixed',
    top: '0',
    right: '0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'left',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginTop: '5px',
    boxShadow: '0px 0px 15px 5px rgba(255, 255, 255, 0.6)',
    overflowY: 'auto',
    padding: '10px',
};

const trackNameStyle = {
    position: 'relative',
    color: '#000000',
    fontSize: '0.8rem',
    zIndex: '1002',
    padding: '5px',
    borderRadius: '5px',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
};

const waveformStyle = {
    width: '100%',
    height: '75px',
    position: 'relative',
    marginBottom: '20px',
};

function Landingpage() {
    const wavesurferRefs = useRef([]);  // Array to hold refs for each WaveSurfer instance
    const location = useLocation();
    const { audioFiles } = location.state || { audioFiles: [] };
    const [isReady, setIsReady] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Initialize the wavesurferRefs array
        wavesurferRefs.current = [];

        if (audioFiles && audioFiles.length > 0) {
            audioFiles.forEach((file, index) => {
                const containerId = `waveform-${index}`;

                const waveSurfer = WaveSurfer.create({
                    container: `#${containerId}`,
                    waveColor: 'blue',
                    progressColor: '#00FFFF',
                    height: 75,
                    autoCenter: true,
                    interact: true,
                    backend: 'MediaElement',
                    cursorWidth: 2,
                    cursorColor: '#FF0000',
                    backgroundColor: 'rgba(255, 255, 255, 0)',
                    minPxPerSec: 100,
                });

                waveSurfer.load(file.url);

                waveSurfer.on('ready', () => {
                    setIsReady(true);
                });

                waveSurfer.on('audioprocess', () => {
                    setProgress(waveSurfer.getCurrentTime() / waveSurfer.getDuration() * 100);
                });

                waveSurfer.on('seek', (progress) => {
                    setProgress(progress * 100);
                });

                // Store the waveSurfer instance in the refs array
                wavesurferRefs.current[index] = waveSurfer;
            });

            // Cleanup function to properly handle the destruction of WaveSurfer instances
            return () => {
                wavesurferRefs.current.forEach(waveSurfer => {
                    if (waveSurfer) {
                        waveSurfer.destroy();
                    }
                });
            };
        } else {
            console.log('No audio files available to display.');
        }
    }, [audioFiles]);

    const playAllTracks = () => {
        wavesurferRefs.current.forEach(waveSurfer => {
            waveSurfer.playPause();
        });
    };

    const seekAllTracks = (seekTo) => {
        wavesurferRefs.current.forEach(waveSurfer => {
            waveSurfer.seekTo(seekTo);
        });
    };

    const changeSpeedAllTracks = (newSpeed) => {
        setSpeed(newSpeed);
        wavesurferRefs.current.forEach(waveSurfer => {
            waveSurfer.setPlaybackRate(newSpeed);
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
        <div style={pagebackground}>
            <div style={musicbackground}>
                {audioFiles.map((file, index) => (
                    <div key={index} style={waveformStyle}>
                        <div style={trackNameStyle}>{file.name}</div>
                        <div id={`waveform-${index}`} style={{ width: '100%', height: '100%' }}></div>
                    </div>
                ))}
            </div>

            <Sidebar/>

            {audioFiles && audioFiles.length > 0 ? (
                <PlayButton
                    playAllTracks={playAllTracks}
                    forwardAllTracks={forwardAllTracks}
                    backwardAllTracks={backwardAllTracks}
                    seekAllTracks={seekAllTracks}
                    changeSpeedAllTracks={changeSpeedAllTracks}
                    isReady={isReady}
                    speed={speed}
                />
            ) : (
                <p>No audio tracks available.</p>
            )}
        </div>
    );
}

export default Landingpage;
