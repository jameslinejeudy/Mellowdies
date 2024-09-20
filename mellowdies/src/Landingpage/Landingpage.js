import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useLocation } from 'react-router-dom';
import Menu from './Menu.js';
import cloud from '../images/cloud.png';  // Adjust the path if needed
import PlayButton from './PlayButton.js';

const pagebackground= {
    backgroundSize: 'cover',
    backgroundImage: `url(${cloud})`,  // Set the image as the background
    backgroundPosition: 'center',  // Centers the background
    padding: '10px',  // Adjust the padding
    height: '100vh',  // Full viewport height
    margin: 0,
    display: 'flex',
    flexDirection: 'column',  // Arrange children in a column
    fontFamily: 'Concert One',  // Use Concert One font
}

const trackbackground = {
    width: '75%',
    height: '80%',
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
    marginTop: '10px', 
    marginRight: '2%', // Space between the buttons
    textAlign: 'center',
    fontSize: '1.2rem',
    boxShadow: '0px 0px 15px 5px rgba(255, 255, 255, 0.6)',  // Soft, glowy white shadow
    border: 'none',
};

const headingStyle = {
    color: '#000000',  // Black text color
    fontSize: '2rem',
    marginBottom: '10px',  // Space below the heading
    marginTop: '0',  // Space above the heading
    textAlign: 'left',
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
                height: 75,
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

    return (
        <div style= {pagebackground}>
            <h1 style={headingStyle}>Mellowdies</h1>
            <div style={trackbackground}>
                <div ref={waveformRef} style={{ width: '100%' }}></div> {/* Waveform will be displayed here */}
            </div>

            <Menu/>

            {audioFiles && audioFiles.length > 0 ? (
                <PlayButton
                    wavesurferRef={wavesurferRef}
                    isReady={isReady}
                    speed={speed}
                    setSpeed={setSpeed}
                />
            ) : (
                <p>No audio tracks available.</p>
            )}
        </div>
    );
}

export default Landingpage;
