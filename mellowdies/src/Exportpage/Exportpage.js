import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import WaveSurfer from 'wavesurfer.js';
import PlayButton from '../Landingpage/PlayButton.js'; 
import './Exportpage.css';

const formatTime = (timeInSeconds) => { // ***
    if (typeof timeInSeconds !== 'number' || timeInSeconds < 0) {
        console.warn('Invalid input: timeInSeconds must be a non-negative number.');
        return '0:00';
    }

    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const hours = Math.floor(minutes / 60);

    const formattedMinutes = hours > 0 ? minutes % 60 : minutes;
    const formattedTime = `${hours > 0 ? hours + ':' : ''}${formattedMinutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    
    return formattedTime;
};


function Exportpage() {
    const location = useLocation();
    const [mergedAudio, setMergedAudio] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isReady, setIsReady] = useState(false);
    const [speed, setSpeed] = useState(1); 
    const navigate = useNavigate();
    const waveformRef = useRef(null);
    const wavesurfer = useRef(null);
    const wavesurferRefs = useRef([]);
    const progressBarRef = useRef(null);
     const audioContext = useRef(new (window.AudioContext || window.webkitAudioContext)());
     const analyser = useRef(audioContext.current.createAnalyser());

    
    useEffect(() => {
        if (mergedAudio && waveformRef.current) {
            wavesurfer.current = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: 'linear-gradient(90deg, rgba(255, 0, 150, 1), rgba(0, 204, 255, 1))', 
                progressColor: 'rgba(0, 204, 255, 0.5)', 
                height: 50,
                barWidth: 4,
                barHeight: 1, 
                barGap: 3,
                barRadius: 100,
                cursorColor: 'transparent',
                responsive: true,
                normalize: true,
            
            });
            

            wavesurfer.current.on('audioprocess', () => {
                setCurrentTime(wavesurfer.current.getCurrentTime());
            });

            wavesurfer.current.on('ready', () => {
                setDuration(wavesurfer.current.getDuration());
                setIsReady(true);
                wavesurferRefs.current.push(wavesurfer.current); 
            });

            wavesurfer.current.load(mergedAudio); 
        }
    }, [mergedAudio]);

    
    useEffect(() => { //*** 
        if (location.state?.mergedAudio) {
            console.log('Merged audio found in location state:', location.state.mergedAudio);
    
            setMergedAudio(location.state.mergedAudio);
    
            const audioPreload = new Audio(location.state.mergedAudio);
            audioPreload.load();
            console.log('Audio has been preloaded for playback.');
        } else {
            console.warn('No merged audio found in location state.');
        }
    }, [location.state]);
    

    
    const handleTimelineChange = (event) => { //***
        const newTime = parseFloat(event.target.value);
    
        if (isNaN(newTime) || newTime < 0) {
            console.warn('Invalid time input. Please provide a valid number.');
            return;
        }
    
        setCurrentTime(newTime);
    
        if (wavesurfer.current) {
            try {
                wavesurfer.current.setCurrentTime(newTime);
                console.log(`Timeline updated to: ${newTime} seconds.`);
            } catch (error) {
                console.error('Failed to set the current time on WaveSurfer:', error);
            }
        } else {
            console.warn('WaveSurfer instance is not available.');
        }
    };
    

    return (
        <div className="pagebackground">
            <div className="circle-shape"></div>
            <div style={{ marginBottom: '20px' }}> </div>
            <div id="waveform" ref={waveformRef} className="waveform"></div>
            <div className="timeline-container">
                <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    step="0.01"
                    onChange={handleTimelineChange}
                    className="timeline-slider"
                    ref={progressBarRef}
                />
                 <div className="time-display">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            <div className="play-button-container">
                <PlayButton
                    wavesurferRefs={wavesurferRefs}
                    setSpeed={setSpeed}
                    isReady={isReady}
                    speed={speed}
                />
            </div>
           <button
    className="buttons"
    style={{ marginBottom: '-23%'}}
    onClick={async () => {
        if (mergedAudio) {
            try {
                const response = await fetch(mergedAudio);
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch audio. Status: ${response.status}`);
                }
        
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
        
                const downloadLink = document.createElement('a');
                downloadLink.href = url;
                downloadLink.download = `Downloaded_Audio_${Date.now()}.mp3`; 
                downloadLink.style.display = 'none';
                document.body.appendChild(downloadLink);
        
                downloadLink.click();
                console.log('Download initiated successfully.');
        
                document.body.removeChild(downloadLink);
                URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Error occurred during audio download:', error);
                alert('An error occurred while trying to download the audio file. Please try again.');
            }
        } else {
            alert("Audio file is not available for download.");
        }
        
    }}
>
    Download
    </button>

    <button
      className="buttons"
      style={{ marginBottom: '-29%' }}
      onClick={() => {
        navigate(-1);
      }}
    >
      Go Back
    </button>


    <button
      className="buttons"
      style={{ marginBottom: '-35%' }}
      onClick={() => {
        navigate('/Homepage');
      }}
    >
      Homepage
    </button>
        </div>
    );
}

export default Exportpage;
