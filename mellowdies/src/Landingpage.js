import React, { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useLocation } from 'react-router-dom';

function Landingpage() {
    const waveformRef = useRef(null);
    const location = useLocation();
    const { audioFiles } = location.state || { audioFiles: [] };

    useEffect(() => {
        if (audioFiles && audioFiles.length > 0) {
            console.log('Creating WaveSurfer instance...');
            const wavesurfer = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: 'blue',
                progressColor: 'purple',
                height: 100,
            });

            console.log('Loading audio file:', audioFiles[0].url);
            wavesurfer.load(audioFiles[0].url);

            // Optional: Clean up the WaveSurfer instance on component unmount
            return () => {
                if (wavesurfer) wavesurfer.destroy();
            };
        } else {
            console.log('No audio files available to display.');
        }
    }, [audioFiles]);

    return (
        <div>
            <h1>Your Selected Audio Tracks</h1>
            <div ref={waveformRef}></div> {/* Waveform will be displayed here */}
            {audioFiles && audioFiles.length > 0 ? (
                <audio controls>
                    <source src={audioFiles[0].url} type={audioFiles[0].mimeType} />
                    Your browser does not support the audio element.
                </audio>
            ) : (
                <p>No audio tracks available.</p>
            )}
        </div>
    );
}

export default Landingpage;
