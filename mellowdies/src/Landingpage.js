import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useLocation } from 'react-router-dom';

const pagebackground= {
    backgroundSize: 'cover',
    backgroundColor: 'pink',  // Ensures the image covers the entire page
    backgroundPosition: 'center',  // Centers the background
    textAlign: 'center',
    padding: '10px',  // Adjust the padding
    height: '100vh',  // Full viewport height
    margin: 0,
    display: 'flex',
    flexDirection: 'column',  // Arrange children in a column
    alignItems: 'center',
    fontFamily: 'Concert One',  // Use Concert One font
}

const trackbackground = {
    width: '75%',
    height: '75%',
    radius: '30px',
    position: 'fixed',
    top: '50%',
    right: '0',
    transform: 'translateY(-50%)',
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'left',
    border: '2px solid #ffffff',  // Sharp white border
    backgroundColor: 'rgba(255, 255, 255, 0.3)',  // Slightly transparent white background
    fontFamily: "'Concert One', cursive",  // Apply Concert One font
    cursor: 'pointer',
    marginTop: '15px', 
    marginRight: '2%', // Space between the buttons
    textAlign: 'center',
    fontSize: '1.2rem',
    boxShadow: '3px 3px 5px white, -3px -3px 5px white, 3px -3px 5px white, -3px 3px 5px white'
};

const headingStyle = {
    color: '#000000',  // Black text color
    fontSize: '3.5rem',
    marginBottom: '10px',  // Space below the heading
    marginTop: '0',  // Space above the heading
    textAlign: 'center',

};

const buttonContainerStyle = {
    display: 'flex',
    flexDirection: 'column',  // Stack buttons vertically
    position: 'fixed',
    right: '20px',  // Distance from the right edge of the screen
    top: '50%',
    transform: 'translateY(-50%)',  // Center the container vertically
    alignItems: 'flex-end',  // Align buttons to the right within the container
};

function Landingpage() {
    const waveformRef = useRef(null);
    const wavesurferRef = useRef(null);
    const location = useLocation();
    const { audioFiles } = location.state || { audioFiles: [] };
    const [isReady, setIsReady] = useState(false);  // State to track if WaveSurfer is ready
    const [speed, setSpeed] = useState(1); // State for playback speed
    const [progress, setProgress] = useState(0); // State for progress bar

    useEffect(() => {
        if (audioFiles && audioFiles.length > 0 && waveformRef.current) {
            console.log('Creating WaveSurfer instance...');
            wavesurferRef.current = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: 'blue',
                progressColor: '#00FFFF',  // The color of the progress bar
                height: 100,
                autoCenter: true,  // Ensures the progress bar stays centered
                 interact: true,  // Enable user interaction (clicking, dragging)
                backend: 'MediaElement',  // Use the MediaElement backend to support interaction
                cursorWidth: 2,  // Visual indication of the cursor
                cursorColor: '#FF0000',
                backgroundColor: 'rgba(255, 255, 255, 255)',  // Slightly transparent white background
            });

            if (wavesurferRef.current) {
                console.log('Loading audio file:', audioFiles[0].url);
                wavesurferRef.current.load(audioFiles[0].url);

                // Listen for the ready event to ensure the WaveSurfer instance is fully loaded
                wavesurferRef.current.on('ready', () => {
                    setIsReady(true);  // Set the state to true when ready
                });
                // Update the progress state
                wavesurferRef.current.on('audioprocess', () => {
                    setProgress(wavesurferRef.current.getCurrentTime() / wavesurferRef.current.getDuration() * 100);
                });

                wavesurferRef.current.on('seek', (progress) => {
                    setProgress(progress * 100);
                });
            }

            // Cleanup function to properly handle the destruction of WaveSurfer
            return () => {
                if (wavesurferRef.current) {
                    // Ensure that no operations are in progress before destroying
                    wavesurferRef.current.destroy();
                    wavesurferRef.current = null;  // Reset the ref to prevent future access
                }
            };
        } else {
            console.log('No audio files available to display or waveformRef is not ready.');
        }
    }, [audioFiles]);

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
            wavesurferRef.current.setCurrentTime(currentTime + 5); // Skip forward 5 seconds
        }
    };

    const handleBackward = () => {
        if (wavesurferRef.current && isReady) {
            const currentTime = wavesurferRef.current.getCurrentTime();
            wavesurferRef.current.setCurrentTime(currentTime - 5); // Skip back 5 seconds
        }
    };

    return (
        <div style= {pagebackground}>
            <h1 style={headingStyle}>Mellowdies</h1>
            <div style={trackbackground}>
                <div ref={waveformRef} style={{ width: '100%' }}></div> {/* Waveform will be displayed here */}
            </div>

            {audioFiles && audioFiles.length > 0 ? (
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
            ) : (
                <p>No audio tracks available.</p>
            )}
        </div>
    );
}

export default Landingpage;
