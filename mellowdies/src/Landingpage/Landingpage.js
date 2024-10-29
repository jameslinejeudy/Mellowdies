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
                    minPxPerSec: 100,
                    url:file.url,
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

    const mergeAudioFiles = async () => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const buffers = await Promise.all(audioFiles.map(async (file) => {
            const response = await fetch(file.url);
            const arrayBuffer = await response.arrayBuffer();
            return await audioContext.decodeAudioData(arrayBuffer);
        }));
    
        // Find the longest buffer to create an output buffer with enough space for mixing
        const maxLength = Math.max(...buffers.map(buffer => buffer.length));
    
        // Create an output buffer with the longest length
        const outputBuffer = audioContext.createBuffer(
            buffers[0].numberOfChannels,
            maxLength,
            audioContext.sampleRate
        );
    
        // Mix the buffers together
        buffers.forEach((buffer) => {
            for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
                const outputData = outputBuffer.getChannelData(channel);
                const inputData = buffer.getChannelData(channel);
                for (let i = 0; i < inputData.length; i++) {
                    outputData[i] += inputData[i];  // Add the audio data to mix
                }
            }
        });
    
        // Convert the mixed output buffer to a WAV file blob
        const mergedBlob = await bufferToWaveBlob(outputBuffer, audioContext.sampleRate);
    
        // Navigate to the export page with the merged audio
        navigate('/Exportpage', { state: { mergedAudio: URL.createObjectURL(mergedBlob) } });
    };
    

    const bufferToWaveBlob = (buffer, sampleRate) => {
        const numOfChannels = buffer.numberOfChannels;
        const length = buffer.length * numOfChannels * 2 + 44;
        const result = new DataView(new ArrayBuffer(length));
    
        const writeString = (view, offset, string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };
    
        let offset = 0;
    
        // RIFF chunk descriptor
        writeString(result, offset, 'RIFF'); offset += 4;
        result.setUint32(offset, 36 + buffer.length * numOfChannels * 2, true); offset += 4;
        writeString(result, offset, 'WAVE'); offset += 4;
    
        // FMT sub-chunk
        writeString(result, offset, 'fmt '); offset += 4;
        result.setUint32(offset, 16, true); offset += 4;  // Subchunk1Size (16 for PCM)
        result.setUint16(offset, 1, true); offset += 2;   // AudioFormat (1 for PCM)
        result.setUint16(offset, numOfChannels, true); offset += 2; // NumChannels
        result.setUint32(offset, sampleRate, true); offset += 4;    // SampleRate
        result.setUint32(offset, sampleRate * 2 * numOfChannels, true); offset += 4; // ByteRate
        result.setUint16(offset, numOfChannels * 2, true); offset += 2; // BlockAlign
        result.setUint16(offset, 16, true); offset += 2; // BitsPerSample
    
        // data sub-chunk
        writeString(result, offset, 'data'); offset += 4;
        result.setUint32(offset, buffer.length * numOfChannels * 2, true); offset += 4;
    
        // Write interleaved PCM samples
        for (let i = 0; i < buffer.length; i++) {
            for (let channel = 0; channel < numOfChannels; channel++) {
                const sample = buffer.getChannelData(channel)[i];
                const clampedSample = Math.max(-1, Math.min(1, sample));
                result.setInt16(offset, clampedSample < 0 ? clampedSample * 0x8000 : clampedSample * 0x7FFF, true);
                offset += 2;
            }
        }
    
        // Return the blob
        return new Blob([result], { type: 'audio/wav' });
    };
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

            <button className="exportButton" onClick={async () => {
            await mergeAudioFiles();  // Wait for the audio merging to complete
            navigate('/Exportpage');  // Navigate to the export page after merging
            }}>
            Export
            </button>

        </div>
    );
}


export default Landingpage;