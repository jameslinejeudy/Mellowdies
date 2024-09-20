import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useLocation } from 'react-router-dom';
import Menu from './Menu.js';
import cloud from '../images/cloud.png';  // Adjust the path if needed
import PlayButton from './PlayButton';

const pagebackground = {
    backgroundSize: 'cover',
    backgroundImage: `url(${cloud})`,  // Set the image as the background
    backgroundPosition: 'center',  // Centers the background
    padding: '10px',  // Adjust the padding
    height: '100vh',  // Full viewport height
    margin: 0,
    display: 'flex',
    flexDirection: 'column',  // Arrange children in a column
    fontFamily: 'Concert One',  // Use Concert One font
};

const trackbackground = {
    width: '75%',
    height: '80%',
    radius: '30px',
    position: 'fixed',
    top: '50%',
    right: '0',
    transform: 'translateY(-50%)',
    display: 'flex',
    flexDirection: 'column',  // Column layout for timestamp and waveform
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
    overflow: 'hidden',  // Hide the scrollbar
    cursor: 'grab',  // Change cursor to indicate draggable area
};

const waveformContainerStyle = {
    width: '100%',
    height: '75px',
    cursor: 'grab',
};

const timestampStyle = {
    textAlign: 'left',
    padding: '10px',
    fontSize: '1.5rem',
    color: '#000000',  // Black text color
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
    const [currentTime, setCurrentTime] = useState('00:00');  // State to track the current timestamp
    const [isDragging, setIsDragging] = useState(false);  // State to track dragging
    const [dragStartX, setDragStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

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
                    wavesurferRef.current.zoom(200);  // Zoom in on the waveform
                });

                // Update the progress state
                wavesurferRef.current.on('audioprocess', () => {
                    const currentTime = wavesurferRef.current.getCurrentTime();
                    setCurrentTime(formatTime(currentTime));
                    setProgress(currentTime / wavesurferRef.current.getDuration() * 100);
                });

                wavesurferRef.current.on('seek', (progress) => {
                    const newTime = wavesurferRef.current.getDuration() * progress;
                    setCurrentTime(formatTime(newTime));
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

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStartX(e.pageX - waveformRef.current.offsetLeft);
        setScrollLeft(waveformRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const x = e.pageX - waveformRef.current.offsetLeft;
        const walk = (x - dragStartX) * 2; // Scroll speed
        waveformRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <div style={pagebackground}>
            <div style={trackbackground}>
                <div style={timestampStyle}>{currentTime}</div>
                <div
                    ref={waveformRef}
                    style={waveformContainerStyle}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                ></div> {/* Waveform will be displayed here */}
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
