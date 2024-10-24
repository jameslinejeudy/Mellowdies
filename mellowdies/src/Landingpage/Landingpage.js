import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline';  // Import the timeline plugin
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.js';
import './Landingpage.css';  
import PlayButton from './PlayButton.js';

function Landingpage() {
    const wavesurferRefs = useRef([]);  // Array to hold refs for each WaveSurfer instance
    const musicbackgroundRef = useRef(null);  // Ref for the music background container
    const location = useLocation();
    const { audioFiles } = location.state || { audioFiles: [] };
    const [isReady, setIsReady] = useState(false);
    const [speed, setSpeed] = useState(1);  // Define speed and setSpeed state
    let longestDuration = 0;  // Variable to track the longest track duration

    useEffect(() => {
        // Initialize the wavesurferRefs array
        wavesurferRefs.current = [];

        if (audioFiles && audioFiles.length > 0) {
            audioFiles.forEach((file, index) => {
                const containerId = `waveform-${index}`;

                // Create the WaveSurfer instance
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
                    url:file.url,
                    minPxPerSec: 100,  // Adjust this for width control
                });

                waveSurfer.on('ready', () => {
                    setIsReady(true);

                    const duration = waveSurfer.getDuration();
                    if (duration > longestDuration) {
                        longestDuration = duration;  // Track the longest duration
                    }

                    // Add the timeline plugin only for the first track
                    if (index === 0) {
                        const timeline = TimelinePlugin.create({
                            insertPosition: 'beforebegin',
                            primaryColor: '#000',
                            secondaryColor: '#c0c0c0',
                            primaryFontColor: '#000',
                            secondaryFontColor: '#000',
                            secondaryLabelOpacity: 0.9,
                            timeInterval: 0.2,
                            primaryLabelInterval: 5,
                            secondaryLabelInterval: 1,
                        });

                        waveSurfer.registerPlugin(timeline);
                    }
                });

                wavesurferRefs.current[index] = waveSurfer;
                
            });

            // Cleanup function to properly handle the destruction of WaveSurfer instances
            return () => {
                wavesurferRefs.current.forEach((waveSurfer) => {
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

            <div
                className="musicbackground"
                ref={musicbackgroundRef}
            >
                {audioFiles.map((file, index) => (
                    <div>
                        <div id="trackName" className="trackNameStyle">{file.name}</div>
                        <div id="timeline" className="timelineStyle"></div>
                        <div key={index} className="waveformStyle">
                            <div id={`waveform-${index}`} style={{  width: '100%',height: '100%' }}></div>
                        </div>
                    </div>
                ))}
            </div>

            <Sidebar />

            {audioFiles && audioFiles.length > 0 ? (
                <PlayButton
                    wavesurferRefs={wavesurferRefs}
                    setSpeed={setSpeed}  // Pass the setSpeed function
                    isReady={isReady}
                    speed={speed}  // Pass the speed value
                />
            ) : (
                <p>No audio tracks available.</p>
            )}
        </div>
    );
}

export default Landingpage;
