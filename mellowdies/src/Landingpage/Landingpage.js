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
                    minPxPerSec: 100,  // Adjust this for width control
                });

                waveSurfer.load(file.url);

                waveSurfer.on('ready', () => {
                    setIsReady(true);

                    const duration = waveSurfer.getDuration();
                    if (duration > longestDuration) {
                        longestDuration = duration;  // Track the longest duration
                    }

                    // Add the timeline plugin only for the first track
                    if (index === 0) {
                        const timeline = TimelinePlugin.create({
                            container: '#timeline',  // Use the single timeline container at the top
                            height: 30,
                            primaryColor: '#000',
                            secondaryColor: '#c0c0c0',
                            primaryFontColor: '#000',
                            secondaryFontColor: '#000',
                            duration: longestDuration,
                            timeInterval: Math.ceil(longestDuration / 10),  // Interval between markers
                            primaryLabelInterval: Math.ceil(longestDuration / 5),
                            secondaryLabelInterval: Math.ceil(longestDuration / 10),
                            fontSize: 12,  // Ensure the font size is big enough to be visible
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

    // Synchronize scroll behavior for the music background
    const handleScroll = () => {
        const scrollLeft = musicbackgroundRef.current.scrollLeft;
        wavesurferRefs.current.forEach((waveSurfer) => {
            waveSurfer.drawer.wrapper.scrollLeft = scrollLeft;  // Sync WaveSurfer scroll
        });
    };

    return (
        <div className="pagebackground">
            <div id="timeline" className="timelineStyle"></div>  {/* Single timeline container */}

            <div
                className="musicbackground"
                ref={musicbackgroundRef}
                onScroll={handleScroll}  // Listen to the scroll event
            >
                {audioFiles.map((file, index) => (
                    <div key={index} className="waveformStyle">
                        <div id={`waveform-${index}`} style={{ height: '100%' }}></div>
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
