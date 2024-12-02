import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import WaveSurfer from 'wavesurfer.js';
import PlayButton from '../Landingpage/PlayButton.js'; 
import './Exportpage.css';

const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; 
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

    
    useEffect(() => {
        if (location.state && location.state.mergedAudio) {
            setMergedAudio(location.state.mergedAudio);
        }
    }, [location.state]);

    
    const handleTimelineChange = (e) => {
        const newTime = e.target.value;
        setCurrentTime(newTime);
        if (wavesurfer.current) {
            wavesurfer.current.setCurrentTime(newTime);
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
            const response = await fetch(mergedAudio); 
            const blob = await response.blob(); 
            const url = URL.createObjectURL(blob); 

            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Audio.mp3'; 
            a.click();

            
            URL.revokeObjectURL(url);
        } else {
            alert("Audio file is not available for download.");
        }
    }}
>
    Download
    </button>

    {/*
    <button
      className="buttons"
      style={{ marginBottom: '-29%' }}
      onClick={async () => {
        const response = await fetch(mergedAudio); 
        const blob = await response.blob(); 
        const url = URL.createObjectURL(blob); 
        navigate(-1,{newFile:url});
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
    */}
        </div>
    );
}

export default Exportpage;
