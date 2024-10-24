import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate at the top
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline';  // Import the timeline plugin
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.js';
import './Landingpage.css';  
import PlayButton from './PlayButton.js';



const waveSurferData = [];
const regions = RegionsPlugin.create();

function Landingpage() {
    const navigate = useNavigate();  // Define navigate using the useNavigate hook
    const wavesurferRefs = useRef([]);
    const containerRefs = useRef([]);
    const musicbackgroundRef = useRef(null);  // Ref for the music background container
    const location = useLocation();
    const { audioFiles } = location.state || { audioFiles: [] };
    const [isReady, setIsReady] = useState(false);
    const [speed, setSpeed] = useState(1);
    let longestDuration = 0;  // Variable to track the longest track duration

    const initializeWaveSurfer = () => {
        wavesurferRefs.current = [];
    
        if (audioFiles && audioFiles.length > 0) {
            audioFiles.forEach((file, index) => {
                const container = containerRefs.current[index];
                if (!container) {
                    console.error(`Container for index ${index} not found`);
                    return;
                }
    
                const waveSurfer = WaveSurfer.create({
                    container: container, // Safely use the container
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
                    plugins: [regions],
                });
    
                waveSurfer.on('ready', () => {setIsReady(true);
                    const buffer = waveSurfer.getDecodedData();
        
                    console.log('buffer length : ', buffer.length);
                    console.log('buffer duration : ', buffer.duration);
                    console.log('buffer sampleRate : ', buffer.sampleRate);
                    console.log('buffer numberOfChannels : ', buffer.numberOfChannels);

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
    
                regions.on('region-created', (region) => {
                    regions.getRegions().forEach((r) => {
                        if (r.id !== region.id) {
                            r.remove();
                        }
                    });
                });

                regions.on('region-clicked', (region, e) => {
                    e.stopPropagation();
                    region.remove();
                });
    
                regions.enableDragSelection({
                    color: 'rgba(245, 137, 5, 0.4)',
                });
    
                wavesurferRefs.current[index] = waveSurfer;
                waveSurferData.push({ waveSurfer, regions });
                
            });
        }
    };

    const scheduleWaveSurferInitialization = () => {
        setTimeout(() => initializeWaveSurfer(), 100); // Small delay
    };

    if (audioFiles && audioFiles.length > 0 && wavesurferRefs.current.length === 0) {
        scheduleWaveSurferInitialization();
    }

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
                            <div ref={el => containerRefs.current[index] = el} style={{ width: '100%' }}></div>
                        </div>
                    </div>
                ))}
            </div>

            <Sidebar waveData={waveSurferData}/>

            {audioFiles && audioFiles.length > 0 ? (
                <PlayButton
                    wavesurferRefs={wavesurferRefs}
                    setSpeed={setSpeed}  // Pass the setSpeed function
                    isReady={isReady}
                    speed={speed}
                />
            ) : (
                <p>No audio tracks available.</p>
            )}

            <button className="exportButton" onClick={() => navigate('/Exportpage')}>
                Export
            </button> 

        </div>
    );
}


export default Landingpage;