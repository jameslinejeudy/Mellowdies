import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useLocation } from 'react-router-dom';

const trackbackground = {
    width: '75%',
    height: '75%',
    backgroundColor: 'pink',
    position: 'fixed',
    top: '50%',
    right: '0',
    transform: 'translateY(-50%)',
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'left',
};

const headingStyle = {
    color: '#000000',  // Black text color
    fontSize: '3.5rem',
    marginBottom: '10px',  // Space below the heading
    marginTop: '0',  // Space above the heading
    textAlign: 'center',

};

function Landingpage() {
    const waveformRef = useRef(null);
    const wavesurferRef = useRef(null);
    const location = useLocation();
    const { audioFiles } = location.state || { audioFiles: [] };
    const [isReady, setIsReady] = useState(false);  // State to track if WaveSurfer is ready

    useEffect(() => {
        if (audioFiles && audioFiles.length > 0 && waveformRef.current) {
            console.log('Creating WaveSurfer instance...');
            wavesurferRef.current = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: 'blue',
                progressColor: '#00FFFF',  // The color of the progress bar
                height: 100,
                autoCenter: true,  // Ensures the progress bar stays centered
            });

            if (wavesurferRef.current) {
                console.log('Loading audio file:', audioFiles[0].url);
                wavesurferRef.current.load(audioFiles[0].url);

                // Listen for the ready event to ensure the WaveSurfer instance is fully loaded
                wavesurferRef.current.on('ready', () => {
                    setIsReady(true);  // Set the state to true when ready
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

    return (
        <div>
            <h1 style={headingStyle}>Mellowdies</h1>
            <div style={trackbackground}>
                <div ref={waveformRef} style={{ width: '100%' }}></div> {/* Waveform will be displayed here */}
            </div>

            {audioFiles && audioFiles.length > 0 ? (
                <div style={{ marginTop: '20px', textAlign: 'left' }}>
                    <button
                        onClick={handlePlayPause}
                        style={{ padding: '10px 20px', fontSize: '16px' }}
                        disabled={!isReady}  // Disable button until WaveSurfer is ready
                    >
                        Play/Pause
                    </button>
                </div>
            ) : (
                <p>No audio tracks available.</p>
            )}
        </div>
    );
}

export default Landingpage;
