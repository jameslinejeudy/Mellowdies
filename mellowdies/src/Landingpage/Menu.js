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
  const [isDelayModalOpen, setDelayModalOpen] = useState(false);
  const [isDistortionModalOpen, setDistortionModalOpen] = useState(false);
  const [gainValue, setGainValue] = useState(100);
  const [delayTime, setDelayTime] = useState(0.00);
  const [feedback, setFeedback] = useState(0.00);
  const [wetness, setWetness] = useState(0.00);
  const [dryness, setDryness] = useState(0.00);
  const [gainDistortValue, setGainDistortValue] = useState(100);
  
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

  const openDistortionModal = () => setDistortionModalOpen(true);
  const closeDistortionModal = () => setDistortionModalOpen(false);

  const distort = () => {
    let buffer = waveData[0].waveSurfer.getDecodedData();
    let region = (waveData[0].regions.getRegions())[0];
    let sampleRate = buffer.sampleRate;
    let gain = gainDistortValue / 100;
    let start = Math.floor(region.start * sampleRate);
    let end = Math.ceil(region.end * sampleRate);

    if (buffer) {
      for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
        let channelData = buffer.getChannelData(channel);
    
        for (let sample = start; sample < end; sample += 1) {
            channelData[sample] = Math.atan(gain*channelData[sample]);
        }
      }
      console.log('Distorted Region', gain);
      let blob = blobber(buffer);
      waveData[0].waveSurfer.empty();
      waveData[0].waveSurfer.loadBlob(blob).catch(error => console.log(error));
    }
  };

  const openDelayModal = () => setDelayModalOpen(true);
  const closeDelayModal = () => setDelayModalOpen(false);

  const delay = () => {
    let buffer = waveData[0].waveSurfer.getDecodedData();
    let region = (waveData[0].regions.getRegions())[0];
    let sampleRate = buffer.sampleRate;
    let start = Math.floor(region.start * sampleRate);
    let end = Math.ceil(region.end * sampleRate);
    let delayLen = delayTime;
    let delaySamples = Math.ceil(delayLen * sampleRate);
    let wet = wetness;
    let dry = dryness;
    let feeder = feedback;
    let index = 0;

    if (buffer) {
      let numChannels = buffer.numberOfChannels;
      if (numChannels === 1) {
        let channelData = buffer.getChannelData(0);
        let delayBuffer = new Float32Array(channelData.subarray(start, end + 1));
        for (let sample = start; sample < end; sample += 1) {
          let delayed = delayBuffer[index];
          channelData[sample] = (channelData[sample] * dry) + (delayed * wet) ;
          delayBuffer[index] = feeder * (delayed + channelData[sample]);
          index += 1;
        }
      } else if (numChannels === 2) {
        let channelLeft = buffer.getChannelData(0);
        let channelRight = buffer.getChannelData(1);
        let delayLeft = new Float32Array(channelLeft.subarray(start, end + 1));
        let delayRight = new Float32Array(channelRight.subarray(start, end + 1));
        delayLeft = channelLeft;
        delayRight = channelRight;
        for (let sample = start; sample < end; sample += 1) {
          let delayed_left = delayLeft[index];
          let delayed_right = delayRight[index];
          channelLeft[sample] = (channelLeft[sample] * dry) + (delayed_left * wet) ;
          channelRight[sample] = (channelRight[sample] * dry) + (delayed_right * wet) ;
          delayLeft[index] = feeder * (delayed_left + channelLeft[sample]);
          delayRight[index] = feeder * (delayed_right + channelRight[sample]);
          index += 1;
        }
      }
      console.log('Region Delayed');
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

        <button style={adjustGainButtonStyle} onClick={openDelayModal}>
          Adjust Delay
        </button>

        {isDelayModalOpen && (
          <>
             <div style={overlayStyle} onClick={closeDelayModal} />
              <div style={modalStyle}>
                <h2>Delay Time</h2>
                <input
                  id="delayT"
                  type="range"
                  min="0"
                  max="6"
                  step="0.01"
                  value={delayTime}
                  onInput={(e) => setDelayTime(e.target.value)}
                  style={sliderStyle}
                />
                <output id="delayVal">{delayTime}</output>

                <h2>Feedback</h2>
                <input
                  id="feedback"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={feedback}
                  onInput={(e) => setFeedback(e.target.value)}
                  style={sliderStyle}
                />
                <output id="feedVal">{feedback}</output>

                <h2>Wet</h2>
                <input
                  id="wets"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={wetness}
                  onInput={(e) => setWetness(e.target.value)}
                  style={sliderStyle}
                />
                <output id="wetVal">{wetness}</output>

                <h2>Dry</h2>
                <input
                  id="dryer"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={dryness}
                  onInput={(e) => setDryness(e.target.value)}
                  style={sliderStyle}
                />
                <output id="dryVal">{dryness}</output>
              <button onClick={closeDelayModal} style={backButtonStyle}>Close</button>
              <button onClick={delay} style={backButtonStyle}>Apply Delay</button>
            </div>
          </>
        )}

        <button style={adjustGainButtonStyle} onClick={openDistortionModal}>
          Apply Distortion
        </button>

        {isDistortionModalOpen && (
          <>
             <div style={overlayStyle} onClick={closeDistortionModal} />
              <div style={modalStyle}>
                <h2>Gain Percentage</h2>
                <input
                  id="gains"
                  type="range"
                  min="0"
                  max="200"
                  step="0.01"
                  value={gainDistortValue}
                  onInput={(e) => setGainDistortValue(e.target.value)}
                  style={sliderStyle}
                />
                <output id="gainDistortVal">{gainDistortValue}%</output>
              <button onClick={closeDistortionModal} style={backButtonStyle}>Close</button>
              <button onClick={distort} style={backButtonStyle}>Apply Distortion</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Menu;
