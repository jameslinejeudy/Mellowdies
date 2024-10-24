import React from 'react';
import menubutton from '../images/icons/menubutton.png';

const menubackground = {
  width: '25%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'left',
  border: '2px solid #ffffff',
  backgroundColor: '#ffffff',
  fontFamily: "'Concert One', cursive",
  fontSize: '1.2rem',
  boxShadow: '0px 0px 15px 5px rgba(255, 255, 255, 0.6)',
  border: 'none',
  position: 'fixed',
  top: '0',
  left: '0',
  zIndex: '1000',
  paddingTop: '20px',
  overflowY: 'auto', // Enable vertical scrolling
  maxHeight: '100%', // Set a maximum height for the menu
};

const backButtonStyle = {
  marginTop: '10px',
  background: '#007bff',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
  textAlign: 'center',
  width: 'auto',
  display: 'inline-block',
  transition: 'background 0.3s ease',
};

const sliderStyle = {
  width: '80%',
  margin: '10px auto',
};

const contentStyle = {
  flexGrow: 1,
  paddingTop: '20px',
};

function Menu({ handleBack, handleEqualizerChange, handleReverbChange, handleEchoChange, handlePitchChange, handleCompressionChange, handlePanningChange, handleNoiseReductionChange }) {
  const [equalizer, setEqualizer] = useState({ bass: 0, mid: 0, treble: 0 });
  const [reverb, setReverb] = useState(0);
  const [echo, setEcho] = useState(0);
  const [pitch, setPitch] = useState(1);
  const [compression, setCompression] = useState(0);
  const [panning, setPanning] = useState(0);
  const [noiseReduction, setNoiseReduction] = useState(0);

  return (
    <div style={menubackground}>
      <div style={contentStyle}>
        <h1>Audio Editing Menu</h1>
        {/* Equalizer Controls */}
        <h3>Equalizer</h3>
        <div style={sliderStyle}>
          <label>Bass: {equalizer.bass}</label>
          <input
            type="range"
            min="-10"
            max="10"
            value={equalizer.bass}
            onChange={(e) => {
              const newBass = e.target.value;
              setEqualizer((prev) => ({ ...prev, bass: newBass }));
              handleEqualizerChange('bass', newBass);
            }}
          />
        </div>
        <div style={sliderStyle}>
          <label>Mid: {equalizer.mid}</label>
          <input
            type="range"
            min="-10"
            max="10"
            value={equalizer.mid}
            onChange={(e) => {
              const newMid = e.target.value;
              setEqualizer((prev) => ({ ...prev, mid: newMid }));
              handleEqualizerChange('mid', newMid);
            }}
          />
        </div>
        <div style={sliderStyle}>
          <label>Treble: {equalizer.treble}</label>
          <input
            type="range"
            min="-10"
            max="10"
            value={equalizer.treble}
            onChange={(e) => {
              const newTreble = e.target.value;
              setEqualizer((prev) => ({ ...prev, treble: newTreble }));
              handleEqualizerChange('treble', newTreble);
            }}
          />
        </div>

        {/* Reverb Control */}
        <h3>Reverb</h3>
        <div style={sliderStyle}>
          <label>Reverb: {reverb}</label>
          <input
            type="range"
            min="0"
            max="100"
            value={reverb}
            onChange={(e) => {
              const newReverb = e.target.value;
              setReverb(newReverb);
              handleReverbChange(newReverb);
            }}
          />
        </div>

        {/* Echo Control */}
        <h3>Echo</h3>
        <div style={sliderStyle}>
          <label>Echo: {echo}</label>
          <input
            type="range"
            min="0"
            max="100"
            value={echo}
            onChange={(e) => {
              const newEcho = e.target.value;
              setEcho(newEcho);
              handleEchoChange(newEcho);
            }}
          />
        </div>

        {/* Pitch Shifting Control */}
        <h3>Pitch</h3>
        <div style={sliderStyle}>
          <label>Pitch: {pitch}</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={pitch}
            onChange={(e) => {
              const newPitch = e.target.value;
              setPitch(newPitch);
              handlePitchChange(newPitch);
            }}
          />
        </div>

        {/* Compression Control */}
        <h3>Compression</h3>
        <div style={sliderStyle}>
          <label>Compression: {compression}</label>
          <input
            type="range"
            min="0"
            max="100"
            value={compression}
            onChange={(e) => {
              const newCompression = e.target.value;
              setCompression(newCompression);
              handleCompressionChange(newCompression);
            }}
          />
        </div>

        {/* Panning Control */}
        <h3>Panning</h3>
        <div style={sliderStyle}>
          <label>Panning: {panning}</label>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.1"
            value={panning}
            onChange={(e) => {
              const newPanning = e.target.value;
              setPanning(newPanning);
              handlePanningChange(newPanning);
            }}
          />
        </div>

        {/* Noise Reduction Control */}
        <h3>Noise Reduction</h3>
        <div style={sliderStyle}>
          <label>Noise Reduction: {noiseReduction}</label>
          <input
            type="range"
            min="0"
            max="100"
            value={noiseReduction}
            onChange={(e) => {
              const newNoiseReduction = e.target.value;
              setNoiseReduction(newNoiseReduction);
              handleNoiseReductionChange(newNoiseReduction);
            }}
          />
        </div>

        {/* Back Button */}
        <button style={backButtonStyle} onClick={handleBack}>Back</button>
      </div>
    </div>
  );
}

export default Menu;
