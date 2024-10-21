import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline";
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.js';
import './Landingpage.css';  
import PlayButton from './PlayButton.js';
import { sliceAudio, deleteAudioSection, handleTrackClick } from './Audiotrack.js'; // Import the new functions

function Landingpage() {
    const wavesurferRefs = useRef([]);  // Array to hold refs for each WaveSurfer instance
    const location = useLocation();
    const { audioFiles } = location.state || { audioFiles: [] };
    const [isReady, setIsReady] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [progress, setProgress] = useState(0);
    let longestDuration = 0;  // Variable to keep track of the longest track duration

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
                    const duration = waveSurfer.getDuration();
                    if (duration > longestDuration) {
                        longestDuration = duration;  // Update longest track duration
                    }

                    // After loading all the tracks, configure the timeline based on the longest track
                    if (index === 0) {  // Initialize timeline for the first track
                        waveSurfer.addPlugin(TimelinePlugin.create({
                            container: `#timeline`,  // Single timeline container at the top
                            duration: longestDuration,  // Set timeline to the longest track's duration
                            timeInterval: Math.ceil(longestDuration / 10),  // Interval between time markers
                            primaryLabelInterval: Math.ceil(longestDuration / 5),  // Primary label interval
                            secondaryLabelInterval: Math.ceil(longestDuration / 10),  // Secondary label interval
                            formatTimeCallback: (seconds) => {
                                const minutes = Math.floor(seconds / 60);
                                const remainingSeconds = Math.floor(seconds % 60);
                                return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
                            },
                            style: {
                                color: '#000',
                                fontSize: '12px',
                                fontFamily: 'Arial',
                            },
                            height: 30,  // Timeline height
                            insertPosition: 'beforeend',  // Timeline insert position
                        })).initPlugin('timeline');
                    }
                });

                waveSurfer.on('audioprocess', () => {
                    setProgress(waveSurfer.getCurrentTime() / waveSurfer.getDuration() * 100);
                });

                waveSurfer.on('seek', (progress) => {
                    const duration = waveSurfer.getDuration();
                    const clickedTime = progress * duration;  // Get the time in seconds where the user clicked

                    const startTime = clickedTime;  // Set slice start point at the clicked position
                    const endTime = startTime + 5;  // Example: slice 5 seconds after the clicked position (adjust as needed)

                    sliceAudio(waveSurfer, startTime, endTime);
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

    return (
        <div className="pagebackground">
            {/* Add a single timeline container at the top */}
            <div id="timeline" className="timelineStyle"></div>

            <div className="musicbackground">
                {audioFiles.map((file, index) => (
                    <div key={index} className="waveformStyle">
                        <div id={`waveform-${index}`} style={{ width: '100%', height: '100%' }}></div>
                    </div>
                ))}
            </div>

            <Sidebar/>

            {audioFiles && audioFiles.length > 0 ? (
                <PlayButton
                    wavesurferRefs={wavesurferRefs}  // Pass the refs to control the tracks
                    setSpeed={setSpeed}               // Pass the setSpeed function for speed control
                    isReady={isReady}                 // Pass the readiness state
                    speed={speed}                     // Pass the current speed value
                />
            ) : (
                <p>No audio tracks available.</p>
            )}
        </div>
    );
}

export default Landingpage;
