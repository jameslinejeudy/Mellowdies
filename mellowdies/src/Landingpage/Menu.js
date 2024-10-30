import React, {useState}  from 'react';

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

const reverseButtonStyle = {
  ...backButtonStyle,
  background: '#ff5722', // Different color for reverse button
};

const sliderStyle = {
  width: '80%',
  margin: '10px auto',
};

const adjustGainButtonStyle = {
  ...backButtonStyle,
  background: '#4caf50', // Different color for adjust gain button
};


const modalStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '300px',
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',
  zIndex: '1001',
};

const overlayStyle = {
  position: 'fixed',
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: '1000',
};

const contentStyle = {
  flexGrow: 1,
  paddingTop: '20px',
};

var utils = require("audio-buffer-utils");
var blobber = require('audiobuffer-to-blob');


function Menu({ handleBack, waveData }) {
  const [isGainModalOpen, setGainModalOpen] = useState(false);
  const [gainValue, setGainValue] = useState(100);
  
  const reverse = () => {
    let buffer = waveData[0].waveSurfer.getDecodedData();
    let region = (waveData[0].regions.getRegions())[0];
    let sampleRate = buffer.sampleRate;
    if (buffer) {
      utils.reverse(buffer, buffer, region.start * sampleRate, region.end * sampleRate);
      console.log("Reversed region.");
      let blob = blobber(buffer);
      waveData[0].waveSurfer.empty();
      waveData[0].waveSurfer.loadBlob(blob).catch(error => console.log(error));
    } else {
      console.error('No audio buffer loaded');
    }
  };

  const invert = () => {
    let buffer = waveData[0].waveSurfer.getDecodedData();
    let region = (waveData[0].regions.getRegions())[0];
    let sampleRate = buffer.sampleRate;
    if (buffer) {
      utils.invert(buffer, buffer, region.start * sampleRate, region.end * sampleRate);
      console.log("Inverted region.");
      let blob = blobber(buffer);
      waveData[0].waveSurfer.empty();
      waveData[0].waveSurfer.loadBlob(blob).catch(error => console.log(error));
    } else {
      console.error('No audio buffer loaded');
    }
  };

  const normalize = () => {
    let buffer = waveData[0].waveSurfer.getDecodedData();
    let region = (waveData[0].regions.getRegions())[0];
    let sampleRate = buffer.sampleRate;
    if (buffer) {
      utils.normalize(buffer, buffer, region.start * sampleRate, region.end * sampleRate);
      console.log("Normalized region.");
      let blob = blobber(buffer);
      waveData[0].waveSurfer.empty();
      waveData[0].waveSurfer.loadBlob(blob).catch(error => console.log(error));
    } else {
      console.error('No audio buffer loaded');
    }
  };

  const openGainModal = () => setGainModalOpen(true);
  const closeGainModal = () => setGainModalOpen(false);

  const adjustGain = () => {
    let buffer = waveData[0].waveSurfer.getDecodedData();
    let region = (waveData[0].regions.getRegions())[0];
    let sampleRate = buffer.sampleRate;
    let gain = gainValue / 100;
    let start = Math.floor(region.start * sampleRate);
    let end = Math.ceil(region.end * sampleRate);

    if (buffer) {
      for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
        let channelData = buffer.getChannelData(channel);
    
        for (let sample = start; sample < end; sample += 1) {
            channelData[sample] *= gain;
        }
      }
      console.log('Gain adjusted:', gain);
      let blob = blobber(buffer);
      waveData[0].waveSurfer.empty();
      waveData[0].waveSurfer.loadBlob(blob).catch(error => console.log(error));
    }
  };

  const fadeIn = () => {
    let buffer = waveData[0].waveSurfer.getDecodedData();
    let region = (waveData[0].regions.getRegions())[0];
    let sampleRate = buffer.sampleRate;
    let start = Math.floor(region.start * sampleRate);
    let end = Math.ceil(region.end * sampleRate);
    let stepInc = 1 / (end-start);
    let currGain = 0;
    let steps = 0;

    if (buffer) {
      for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
        let channelData = buffer.getChannelData(channel);
    
        for (let sample = start; sample < end; sample += 1) {
            channelData[sample] *= (currGain + (steps * stepInc));
            steps += 1;
        }
        steps = 0;
      }
      console.log('Region Faded In');
      let blob = blobber(buffer);
      waveData[0].waveSurfer.empty();
      waveData[0].waveSurfer.loadBlob(blob).catch(error => console.log(error));
    }
  };

  const fadeOut = () => {
    let buffer = waveData[0].waveSurfer.getDecodedData();
    let region = (waveData[0].regions.getRegions())[0];
    let sampleRate = buffer.sampleRate;
    let start = Math.floor(region.start * sampleRate);
    let end = Math.ceil(region.end * sampleRate);
    let stepInc = 1 / (end-start);
    let currGain = 1;
    let steps = 0;

    if (buffer) {
      for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
        let channelData = buffer.getChannelData(channel);
    
        for (let sample = start; sample < end; sample += 1) {
            channelData[sample] *= (currGain - (steps * stepInc));
            steps += 1;
        }
        steps = 0;
      }
      console.log('Region Faded In');
      let blob = blobber(buffer);
      waveData[0].waveSurfer.empty();
      waveData[0].waveSurfer.loadBlob(blob).catch(error => console.log(error));
    }
  };

  const distort = () => {
    const deg = Math.PI / 180;
    let buffer = waveData[0].waveSurfer.getDecodedData();
    let region = (waveData[0].regions.getRegions())[0];
    let sampleRate = buffer.sampleRate;
    let start = Math.floor(region.start * sampleRate);
    let end = Math.ceil(region.end * sampleRate);
    let steps = 0;

    if (buffer) {
      for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
        let channelData = buffer.getChannelData(channel);
    
        for (let sample = start; sample < end; sample += 1) {
            const x = (steps * 2) / (end - start) - 1;
            channelData[sample] = channelData[sample] * (((3 + (end - start)) * x * 20 * deg) / (Math.PI + (end - start) * Math.abs(x))) ;
            steps += 1;
        }
        steps = 0;
      }
      console.log('Region Distorted');
      let blob = blobber(buffer);
      waveData[0].waveSurfer.empty();
      waveData[0].waveSurfer.loadBlob(blob).catch(error => console.log(error));
    }
  };

  return (
    <div style={menubackground}>
      <div style={contentStyle}>
        <button style={backButtonStyle} onClick={handleBack}>Back</button>

        <button style={reverseButtonStyle} onClick={reverse}>
          Reverse Selected Region
        </button>

        <button style={reverseButtonStyle} onClick={invert}>
          Invert Selected Region
        </button>

        <button style={reverseButtonStyle} onClick={normalize}>
          Normalize Selected Region
        </button>

        <button style={reverseButtonStyle} onClick={fadeIn}>
          Fade In Region
        </button>

        <button style={reverseButtonStyle} onClick={fadeOut}>
          Fade Out Region
        </button>

        <button style={reverseButtonStyle} onClick={distort}>
          Distort Region
        </button>
        
        <button style={adjustGainButtonStyle} onClick={openGainModal}>
          Adjust Gain
        </button>

        {isGainModalOpen && (
          <>
             <div style={overlayStyle} onClick={closeGainModal} />
              <div style={modalStyle}>
                <h2>Gain Percentage</h2>
                <input
                  id="gains"
                  type="range"
                  min="0"
                  max="200"
                  step="0.01"
                  value={gainValue}
                  onInput={(e) => setGainValue(e.target.value)}
                  style={sliderStyle}
                />
                <output id="gainVal">{gainValue}%</output>
              <button onClick={closeGainModal} style={backButtonStyle}>Close</button>
              <button onClick={adjustGain} style={backButtonStyle}>Apply Gain</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Menu;
