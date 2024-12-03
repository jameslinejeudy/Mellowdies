import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  
import WaveSurfer from 'wavesurfer.js';
import WebAudioPlayer from 'wavesurfer.js/dist/webaudio.js';
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline';  
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.js';
import PlayButton from './PlayButton.js';
//import PlusIcon from '../images/icons/plus.png';
import './Landingpage.css';  

var blobber = require('audiobuffer-to-blob');
const waveSurferData = [];
const regions = RegionsPlugin.create();
const audioContext = new AudioContext();
const webAudioPlayer = new WebAudioPlayer(audioContext);
let fileLoaded = false;
const eqBands = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
let filters = [];

function createFilters (audioCtx, band) {
    const filter = audioCtx.createBiquadFilter()
    filter.type = band <= 32 ? 'lowshelf' : band >= 16000 ? 'highshelf' : 'peaking'
    filter.gain.value = 0
    filter.Q.value = 1 
    filter.frequency.value = band 
    return filter
  }

for (let i = 0; i < 10; i++) {
    let filter = createFilters(webAudioPlayer.audioContext, eqBands[i])
    filters.push(filter);
}

function Landingpage() {
    const navigate = useNavigate(); 
    const wavesurferRefs = useRef([]);
    const containerRefs = useRef([]);
    const musicbackgroundRef = useRef(null);  
    const location = useLocation();

    const [audioFiles, setAudioFiles] = useState(location.state?.audioFiles || []);
    const [isReady, setIsReady] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const fileInputRef = useRef(null); 
    let longestDuration = 0;  

    useEffect(() => {
        if (location.state?.audioFiles) {
            setAudioFiles(location.state.audioFiles);
        }
    }, [location.state]);

    const initializeWaveSurfer = () => {
        wavesurferRefs.current = [];
    
        if (audioFiles && audioFiles.length > 0) {
            audioFiles.forEach((file, index) => {
                const container = containerRefs.current[index];
                if (!container) {
                    console.error(`Container for index ${index} not found`);
                    return;
                }
                
                if (file.url) {  
                    webAudioPlayer.src = file.url;
                } else {
                    let buffer = waveData[0].waveSurfer.getDecodedData();
                    let blob = blobber(buffer);
                    waveData[0].waveSurfer.loadBlob(blob).catch(error => console.log(error));
                }

                fileLoaded = true;
                
                const waveSurfer = WaveSurfer.create({
                    container: container, 
                    waveColor: 'blue',
                    progressColor: '#00FFFF',
                    height: 75,
                    autoCenter: true,
                    interact: true,
                    cursorWidth: 2,
                    cursorColor: '#FF0000',
                    backgroundColor: 'rgba(255, 255, 255, 0)',
                    minPxPerSec: 50,
                    media: webAudioPlayer,
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
                        longestDuration = duration;  
                    }

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
                waveSurferData.push({ waveSurfer, regions, filters, webAudioPlayer});
            });
        }
    };

    const scheduleWaveSurferInitialization = () => {
        setTimeout(() => initializeWaveSurfer(), 100); 
    };

    if (audioFiles && audioFiles.length > 0 && wavesurferRefs.current.length === 0) {
        scheduleWaveSurferInitialization();
    }

    const mergeAudioFiles = async () => {
        const buffer = waveSurferData[0].waveSurfer.getDecodedData();
    
        const finalBlob = bufferToWaveBlob(buffer, buffer.sampleRate);
    
        navigate('/Exportpage', { state: { mergedAudio: URL.createObjectURL(finalBlob) } });
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
    
        writeString(result, offset, 'RIFF'); offset += 4;
        result.setUint32(offset, 36 + buffer.length * numOfChannels * 2, true); offset += 4;
        writeString(result, offset, 'WAVE'); offset += 4;
        writeString(result, offset, 'fmt '); offset += 4;
        result.setUint32(offset, 16, true); offset += 4;  
        result.setUint16(offset, 1, true); offset += 2;   
        result.setUint16(offset, numOfChannels, true); offset += 2; 
        result.setUint32(offset, sampleRate, true); offset += 4;    
        result.setUint32(offset, sampleRate * 2 * numOfChannels, true); offset += 4; 
        result.setUint16(offset, numOfChannels * 2, true); offset += 2; 
        result.setUint16(offset, 16, true); offset += 2; 
    
        
        writeString(result, offset, 'data'); offset += 4;
        result.setUint32(offset, buffer.length * numOfChannels * 2, true); offset += 4;
    
        for (let i = 0; i < buffer.length; i++) {
            for (let channel = 0; channel < numOfChannels; channel++) {
                const sample = buffer.getChannelData(channel)[i];
                const clampedSample = Math.max(-1, Math.min(1, sample));
                result.setInt16(offset, clampedSample < 0 ? clampedSample * 0x8000 : clampedSample * 0x7FFF, true);
                offset += 2;
            }
        }
    
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

            <Sidebar waveData={waveSurferData} fileLoaded={fileLoaded}/>

            {audioFiles && audioFiles.length > 0 ? (
                <PlayButton 
                    wavesurferRefs={wavesurferRefs}
                    setSpeed={setSpeed}  
                    isReady={isReady}
                    speed={speed}
                    aContext={audioContext}
                />
            ) : (
                <p>No audio tracks available.</p>
            )}

            <button className="exportButton" onClick={async () => {
            await mergeAudioFiles();  
            }}>
            Export
            </button>
            
            {/*
            <button className="dropdownButton" onClick={toggleDropdown}>
                <img src={PlusIcon} alt="Add Tracks" style={{ width: '22px', height: '22px' }} />
            </button>

            {isDropdownOpen && (
                 <div className="dropdownMenu">
                    <button onClick={handleFilesButtonClick}>FILES</button>
                    <button onClick={() => alert('Google Drive Selected')}>GOOGLE DRIVE</button>
                </div>
            )}

            <input
                type="file"
                multiple
                ref={fileInputRef}
                accept='audio/*'
                style={{ display: 'none' }}
                onChange={handleAddFiles} 
            />
            */}

        </div>
    );
}


export default Landingpage;