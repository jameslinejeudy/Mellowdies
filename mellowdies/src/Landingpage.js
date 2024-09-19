import React, { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useLocation } from 'react-router-dom';

const trackbackground = {
    width: '75%',
    height: '75%',
    backgroundColor: 'pink',
    position: 'fixed',
    top: '50%',
    right: '0',
    transform: 'translateY(-50%)',
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'left',
};

const headingStyle = {
    color: '#000000',  // Black text color
    fontSize: '3.5rem',
    marginBottom: '10px',  // Space below the heading
    marginTop: '0',  // Space above the heading
  };

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
                progressColor: '#00FFFF',
                height: 100, 
                autoCenter: true,  // Ensures the progress bar stays centered
           
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
            <h1>Mellowdies</h1>
            <div style={trackbackground}>
                <div ref={waveformRef} style={{ width: '100%'}}></div> {/* Waveform will be displayed here */}
            </div>

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
