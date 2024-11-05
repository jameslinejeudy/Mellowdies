import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import WaveSurfer from 'wavesurfer.js';
import PlayButton from '../Landingpage/PlayButton.js'; // Import the PlayButton component
import './Exportpage.css';

const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; // Add leading zero for seconds
};


function Exportpage() {
    const location = useLocation();
    const [mergedAudio, setMergedAudio] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isReady, setIsReady] = useState(false);
    const [speed, setSpeed] = useState(1); // Default speed
    const waveformRef = useRef(null);
    const wavesurfer = useRef(null);
    const wavesurferRefs = useRef([]);
    const progressBarRef = useRef(null);

     // Web Audio API setup for beat detection
     const audioContext = useRef(new (window.AudioContext || window.webkitAudioContext)());
     const analyser = useRef(audioContext.current.createAnalyser());

    // Initialize WaveSurfer when the audio is ready
    useEffect(() => {
        if (mergedAudio && waveformRef.current) {
            wavesurfer.current = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: 'linear-gradient(90deg, rgba(255, 0, 150, 1), rgba(0, 204, 255, 1))', // Gradient color
                progressColor: 'rgba(0, 204, 255, 0.5)', // Lighter progress color for contrast
                height: 50,
                barWidth: 4,
                barHeight: 1, // This can be adjusted dynamically if needed
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
                wavesurferRefs.current.push(wavesurfer.current); // Add to reference array
            });

            wavesurfer.current.load(mergedAudio); // Load the merged audio
        }
    }, [mergedAudio]);

    // Ensure mergedAudio is set when location.state changes
    useEffect(() => {
        if (location.state && location.state.mergedAudio) {
            setMergedAudio(location.state.mergedAudio);
        }
    }, [location.state]);

    // Handle the timeline slider
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
            <div style={{ marginBottom: '10px' }}> </div>
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
            <div style={{ marginBottom: '10px' }}> </div>

            {/* Play buttons from PlayButton.js */}
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
    onClick={async () => {
        if (mergedAudio) {
            const response = await fetch(mergedAudio); // Fetch the audio file
            const blob = await response.blob(); // Convert the response to a blob
            const url = URL.createObjectURL(blob); // Create a temporary URL for download

            // Create a hidden anchor element and trigger download
            const a = document.createElement('a');
            a.href = url;
            a.download = 'downloaded_audio.mp3'; // Set the file name and extension
            a.click();

            // Clean up the URL object after download
            URL.revokeObjectURL(url);
        } else {
            alert("Audio file is not available for download.");
        }
    }}
>
    Download
</button>

        </div>
    );
}

export default Exportpage;
