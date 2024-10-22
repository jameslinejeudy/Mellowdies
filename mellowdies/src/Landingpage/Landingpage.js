import React, { useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.js';
import cloud from '../images/cloud.png';
import PlayButton from './PlayButton.js';

const waveSurferData = [];
const regions = RegionsPlugin.create();

const pagebackground = {
    backgroundSize: 'cover',
    backgroundImage: `url(${cloud})`,
    backgroundPosition: 'center',
    padding: '10px',
    height: '100vh',
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Concert One',
};

const musicbackground = {
    width: '75%',
    height: '80%',
    position: 'fixed',
    top: '0',
    right: '0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'left',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginTop: '5px',
    boxShadow: '0px 0px 15px 5px rgba(255, 255, 255, 0.6)',
    overflowY: 'auto',
    padding: '10px',
};

const trackNameStyle = {
    position: 'relative',
    color: '#000000',
    fontSize: '0.8rem',
    zIndex: '1002',
    padding: '5px',
    borderRadius: '5px',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
};

const waveformStyle = {
    width: '100%',
    height: '75px',
    position: 'relative',
    marginBottom: '20px',
};

function Landingpage() {
    const wavesurferRefs = useRef([]);
    const containerRefs = useRef([]);
    const location = useLocation();
    const { audioFiles } = location.state || { audioFiles: [] };
    const [isReady, setIsReady] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [progress, setProgress] = useState(0);

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
                    backend: 'MediaElement',
                    plugins: [regions],
                });

                waveSurfer.load(file.url).catch(error => console.log(error));
    
                waveSurfer.on('ready', () => {setIsReady(true);
                    const buffer = waveSurfer.getDecodedData();
        
                    console.log('buffer length : ', buffer.length);
                    console.log('buffer duration : ', buffer.duration);
                    console.log('buffer sampleRate : ', buffer.sampleRate);
                    console.log('buffer numberOfChannels : ', buffer.numberOfChannels);});
    
                waveSurfer.on('audioprocess', () => {
                    setProgress(waveSurfer.getCurrentTime() / waveSurfer.getDuration() * 100);
                });
    
                waveSurfer.on('seek', (progress) => {
                    setProgress(progress * 100);
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

    const handlePlaybackRateChange = (rate) => {
        setSpeed(rate);
        wavesurferRefs.current.forEach(waveSurfer => waveSurfer.setPlaybackRate(rate));
    };

    return (
        <div style={pagebackground}>
            <div style={musicbackground}>
                {audioFiles.map((file, index) => (
                    <div key={index} style={waveformStyle}>
                        <div style={trackNameStyle}>{file.name}</div>
                        <div ref={el => containerRefs.current[index] = el} style={{ width: '100%', height: '100%' }}></div>
                    </div>
                ))}
            </div>

            <Sidebar waveData={waveSurferData}/>

            {audioFiles && audioFiles.length > 0 ? (
                <PlayButton
                    playAllTracks={() => wavesurferRefs.current.forEach(waveSurfer => waveSurfer.playPause())}
                    forwardAllTracks={() => {
                        wavesurferRefs.current.forEach(waveSurfer => {
                            const currentTime = waveSurfer.getCurrentTime();
                            const duration = waveSurfer.getDuration();
                            waveSurfer.seekTo((currentTime + 5) / duration);
                        });
                    }}
                    backwardAllTracks={() => {
                        wavesurferRefs.current.forEach(waveSurfer => {
                            const currentTime = waveSurfer.getCurrentTime();
                            waveSurfer.seekTo(Math.max((currentTime - 5) / waveSurfer.getDuration(), 0));
                        });
                    }}
                    seekAllTracks={(seekTo) => wavesurferRefs.current.forEach(waveSurfer => waveSurfer.seekTo(seekTo))}
                    changeSpeedAllTracks={handlePlaybackRateChange}
                    isReady={isReady}
                    speed={speed}
                />
            ) : (
                <p>No audio tracks available.</p>
            )}
        </div>
    );
}


export default Landingpage;
