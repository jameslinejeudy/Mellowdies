import React, { useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.js';
import cloud from '../images/cloud.png';
import PlayButton from './PlayButton.js';

const controller = new AbortController();
const signal = controller.signal;
const audioConx = new AudioContext();
var toWav = require('audiobuffer-to-wav');
var slicer = require('audiobuffer-slice');

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

function bufferToWave(abuffer, offset, len) {

    var numOfChan = abuffer.numberOfChannels,
        length = len * numOfChan * 2 + 44,
        buffer = new ArrayBuffer(length),
        view = new DataView(buffer),
        channels = [], i, sample,
        pos = 0;
        
    // write WAVE header
    setUint32(0x46464952);                         // "RIFF"
    setUint32(length - 8);                         // file length - 8
    setUint32(0x45564157);                         // "WAVE"
    
    setUint32(0x20746d66);                         // "fmt " chunk
    setUint32(16);                                 // length = 16
    setUint16(1);                                  // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2);                      // block-align
    setUint16(16);                                 // 16-bit (hardcoded in this demo)
    
    setUint32(0x61746164);                         // "data" - chunk
    setUint32(length - pos - 4);                   // chunk length
    
    // write interleaved data
    for(i = 0; i < abuffer.numberOfChannels; i++)
      channels.push(abuffer.getChannelData(i));
    
    while(pos < length) {
      for(i = 0; i < numOfChan; i++) {             // interleave channels
        sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767)|0; // scale to 16-bit signed int
        view.setInt16(pos, sample, true);          // update data chunk
        pos += 2;
      }
      offset++                                     // next source sample
    }
  
    // create Blob
    return (URL || webkitURL).createObjectURL(new Blob([buffer], {type: "audio/wav"}));
    
    function setUint16(data) {
      view.setUint16(pos, data, true);
      pos += 2;
    }
    
    function setUint32(data) {
      view.setUint32(pos, data, true);
      pos += 4;
    }
  }
  
function regionToSend(buffer, regions) {
    if (regions.getRegions().length === 0) {
        alert("Please create a section first.");
        return;
    }

    const currRegion = regions.getRegions().at(0); // Assuming one region at a time
    const length = currRegion.end - currRegion.start;
    console.log(currRegion.end);
    console.log(currRegion.start);
    if (length > 15) {
        alert("Section is too long, please limit to 15 seconds or less.");
        return;
    }

    const wavFileURL = bufferToWave(buffer, currRegion.start, length);
    console.log(wavFileURL);
    return wavFileURL;
};
  

function Landingpage() {
    const wavesurferRefs = useRef([]);
    const location = useLocation();
    const { audioFiles } = location.state || { audioFiles: [] };
    const [isReady, setIsReady] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [progress, setProgress] = useState(0);
    const containerRefs = useRef([]);
    const regions = RegionsPlugin.create();
    var regionURL = "";

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
                    // console.log(buffer);
        
                    let channel0Peaks = buffer.getChannelData(0);
                    console.log('channel0Peaks : ', channel0Peaks);
        
                    let channel1Peaks = buffer.getChannelData(1);
                    console.log('channel1Peaks : ', channel1Peaks);
        
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
                    slicer(waveSurfer.getDecodedData(),region.start * 1000,region.end * 1000, function(error, slicedBuffer) {
                        if (error) {
                            console.error(error);
                        } else {
                            var blob = new window.Blob([new DataView(toWav(slicedBuffer))], {type: "audio/wav"})
                            regionURL = window.URL.createObjectURL(blob);
                            var anchor = document.createElement('a')
                            document.body.appendChild(anchor)
                            anchor.style = 'display: none'
                            var url = window.URL.createObjectURL(blob)
                            anchor.href = url
                            anchor.download = 'audio.wav'
                            anchor.click()
                            window.URL.revokeObjectURL(url)
                            console.log(regionURL);
                        }
                    })
                });
    
                regions.enableDragSelection({
                    color: 'rgba(245, 137, 5, 0.4)',
                });
    
                wavesurferRefs.current[index] = waveSurfer;
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

            <Sidebar regionURL = {regionURL}/>

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
