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
  width: 'auto',
  height: 'auto',
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',
  zIndex: '1001',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
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

const verticalSliderStyle = {
  orient: 'vertical', // Ensures the slider is vertical
  appearance : 'slider-vertical',
}

const sliderContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

var utils = require("audio-buffer-utils");
var blobber = require('audiobuffer-to-blob');

const buffers = [];

function storeBuffer (buffer) {
  buffers.push(buffer);
}

function combFilter (samples, sampleLength, delay, decay, sampleRate) {
  let delaySamples = Math.ceil(delay * (sampleRate / 1000));
  let combFilterSamples = samples;
  for (let i = 0; i < sampleLength - delaySamples; i++) {
    combFilterSamples[i+delaySamples] += combFilterSamples[i] * decay;
  }
  return combFilterSamples;
}

function allPassFilter (samples, sampleLength, sampleRate) {
  let delaySamples = Math.ceil(88.69 * (sampleRate/1000));
  let allPassFilterSamples = new Float32Array(sampleLength);
  let decayFactor = 0.131;
  for (let i = 0; i < sampleLength; i++) {
    allPassFilterSamples[i] = samples[i];
    if (i - delaySamples >= 0) {
      allPassFilterSamples[i] += allPassFilterSamples[i-delaySamples] * (-decayFactor);
    }
    if (i - delaySamples >= 1) {
      allPassFilterSamples[i] += allPassFilterSamples[i+20-delaySamples] * decayFactor;
    }
  }
  let val = allPassFilterSamples[0];
  let max = 0.0;
  for (let i = 0; i < sampleLength; i++) {
    if(Math.abs(allPassFilterSamples[i]) > max) {
      max = Math.abs(allPassFilterSamples[i]);
    }
  }
  for (let i = 0; i < allPassFilterSamples.length; i++) {
    let currVal = allPassFilterSamples[i];
    val = (val + (currVal - val)) / max;
    allPassFilterSamples[i] = val;
  }
  return allPassFilterSamples;
}

function Menu({ handleBack, waveData}) {
  const filters = waveData[0].filters;
  const [isGainModalOpen, setGainModalOpen] = useState(false);
  const [isDelayModalOpen, setDelayModalOpen] = useState(false);
  const [isDistortionModalOpen, setDistortionModalOpen] = useState(false);
  const [isReverbModalOpen, setReverbModalOpen] = useState(false);
  const [isEquaModalOpen, setEquaModalOpen] = useState(false);
  const [isEquaInit, setEquaInit] = useState(false);
  const [gainValue, setGainValue] = useState(100);
  const [delayTime, setDelayTime] = useState(0.00);
  const [feedback, setFeedback] = useState(0.00);
  const [wetness, setWetness] = useState(0.00);
  const [dryness, setDryness] = useState(0.00);
  const [gainDistortValue, setGainDistortValue] = useState(100);
  const [reverbTime, setReverbTime] = useState(0.00);
  const [decay, setDecay] = useState(0.00);
  const [reverbWet, setReverbWet] = useState(0.00);
  const [filter0Val, setFilter0] = useState(filters[0].gain.value);
  const [filter1Val, setFilter1] = useState(filters[1].gain.value);
  const [filter2Val, setFilter2] = useState(filters[2].gain.value);
  const [filter3Val, setFilter3] = useState(filters[3].gain.value);
  const [filter4Val, setFilter4] = useState(filters[4].gain.value);
  const [filter5Val, setFilter5] = useState(filters[5].gain.value);
  const [filter6Val, setFilter6] = useState(filters[6].gain.value);
  const [filter7Val, setFilter7] = useState(filters[7].gain.value);
  const [filter8Val, setFilter8] = useState(filters[8].gain.value);
  const [filter9Val, setFilter9] = useState(filters[9].gain.value);

  if (isEquaInit === false) {
    waveData[0].webAudioPlayer.gainNode.connect(filters[0])
    filters[0].connect(filters[1]);
    filters[1].connect(filters[2]);
    filters[2].connect(filters[3]);
    filters[3].connect(filters[4]);
    filters[4].connect(filters[5]);
    filters[5].connect(filters[6]);
    filters[6].connect(filters[7]);
    filters[7].connect(filters[8]);
    filters[8].connect(filters[9]);
    filters[9].connect(waveData[0].webAudioPlayer.audioContext.destination);
  }
  
  const setFilter = () => {
      filters[0].gain.value = filter0Val;
      filters[1].gain.value = filter1Val;
      filters[2].gain.value = filter2Val;
      filters[3].gain.value = filter3Val;
      filters[4].gain.value = filter4Val;
      filters[5].gain.value = filter5Val;
      filters[6].gain.value = filter6Val;
      filters[7].gain.value = filter7Val;
      filters[8].gain.value = filter8Val;
      filters[9].gain.value = filter9Val;
      console.log("EQ applied")
  }
  
  const undo = () => {
    if (buffers.length >= 1) {
      let blob = blobber(buffers.pop());
      waveData[0].waveSurfer.empty();
      waveData[0].waveSurfer.loadBlob(blob).catch(error => console.log(error));
    }
  }

  const reverse = () => {
    let buffer = waveData[0].waveSurfer.getDecodedData();
    let clone = utils.clone(buffer)
    storeBuffer(clone);
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
    let clone = utils.clone(buffer)
    storeBuffer(clone);
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
    let clone = utils.clone(buffer)
    storeBuffer(clone);
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
    let clone = utils.clone(buffer)
    storeBuffer(clone);
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
    let clone = utils.clone(buffer)
    storeBuffer(clone);
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
    let clone = utils.clone(buffer)
    storeBuffer(clone);
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
    let clone = utils.clone(buffer)
    storeBuffer(clone);
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
    let clone = utils.clone(buffer)
    storeBuffer(clone);
    let region = (waveData[0].regions.getRegions())[0];
    let sampleRate = buffer.sampleRate;
    let start = Math.floor(region.start * sampleRate);
    let end = Math.ceil(region.end * sampleRate);
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

  const openReverbModal = () => setReverbModalOpen(true);
  const closeReverbModal = () => setReverbModalOpen(false);

  const reverb = () => {
    let buffer = waveData[0].waveSurfer.getDecodedData();
    let clone = utils.clone(buffer)
    storeBuffer(clone);
    let region = (waveData[0].regions.getRegions())[0];
    let sampleRate = buffer.sampleRate;
    let start = Math.floor(region.start * sampleRate);
    let end = Math.ceil(region.end * sampleRate);
    let bufferSize = end - start;
    let channelLeft = buffer.getChannelData(0);
    let channelRight = buffer.getChannelData(1);
    let samplesLeft = new Float32Array(channelLeft.subarray(start, end + 1));
    let samplesRight = new Float32Array(channelRight.subarray(start, end + 1));
    let delayinMilliSeconds = reverbTime * 1000;
    let decayFactor = decay;
    let combFilterSamplesLeft1 = combFilter(samplesLeft, bufferSize, delayinMilliSeconds, decayFactor, sampleRate);
    let combFilterSamplesLeft2 = combFilter(samplesLeft, bufferSize, (delayinMilliSeconds - 11.73), (decayFactor - 0.1313), sampleRate);
    let combFilterSamplesRight1 = combFilter(samplesRight, bufferSize, delayinMilliSeconds, decayFactor, sampleRate);
    let combFilterSamplesRight2 = combFilter(samplesRight, bufferSize, (delayinMilliSeconds - 11.73), (decayFactor - 0.1313), sampleRate);
    let outputCombLeft = new Float32Array(bufferSize);
    let outputCombRight = new Float32Array(bufferSize);
    for (let i = 0; i < bufferSize; i++) {
      outputCombLeft[i] = ((combFilterSamplesLeft1[i] + combFilterSamplesLeft2[i])) ;
    }
    for (let i = 0; i < bufferSize; i++) {
      outputCombRight[i] = ((combFilterSamplesRight1[i] + combFilterSamplesRight2[i])) ;
    }
    let audioMixLeft = new Float32Array(bufferSize);
    let audioMixRight = new Float32Array(bufferSize);
    for (let i = 0; i < bufferSize; i++) {
      audioMixLeft[i] = ((1 - reverbWet) * samplesLeft[i]) + (reverbWet * outputCombLeft[i]);
    }
    for (let i = 0; i < bufferSize; i++) {
      audioMixRight[i] = ((1 - reverbWet) * samplesRight[i]) + (reverbWet * outputCombRight[i]);
    }
    let allPassFilterSamplesLeft1 = allPassFilter(audioMixLeft, bufferSize, sampleRate);
    let allPassFilterSamplesLeft2 = allPassFilter(allPassFilterSamplesLeft1, bufferSize, sampleRate);
    let allPassFilterSamplesRight1 = allPassFilter(audioMixRight, bufferSize, sampleRate);
    let allPassFilterSamplesRight2 = allPassFilter(allPassFilterSamplesRight1, bufferSize, sampleRate);
    for (let i = 0; i < bufferSize; i++) {
      channelLeft[start + i] = allPassFilterSamplesLeft2[i];
      channelRight[start + i] = allPassFilterSamplesRight2[i];
    }
    console.log('Reverb Applied');
    let blob = blobber(buffer);
    waveData[0].waveSurfer.empty();
    waveData[0].waveSurfer.loadBlob(blob).catch(error => console.log(error));
  }

  const closeEquaModal = () => setEquaModalOpen(false);
  const openEquaModal = () => {
    setEquaInit(true);
    setEquaModalOpen(true);
  }
  

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

        <button style={adjustGainButtonStyle} onClick={openReverbModal}>
          Apply Reverb
        </button>

        {isReverbModalOpen && (
          <>
             <div style={overlayStyle} onClick={closeReverbModal} />
              <div style={modalStyle}>
                <h2>Time</h2>
                <input
                  id="reverbT"
                  type="range"
                  min="0"
                  max="3"
                  step="0.01"
                  value={reverbTime}
                  onInput={(e) => setReverbTime(e.target.value)}
                  style={sliderStyle}
                />
                <output id="reverbTime">{reverbTime}</output>

                <h2>Decay</h2>
                <input
                  id="decay"
                  type="range"
                  min="0"
                  max="3"
                  step="0.01"
                  value={decay}
                  onInput={(e) => setDecay(e.target.value)}
                  style={sliderStyle}
                />
                <output id="decayVal">{decay}</output>

                <h2>Wet</h2>
                <input
                  id="wetR"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={reverbWet}
                  onInput={(e) => setReverbWet(e.target.value)}
                  style={sliderStyle}
                />
                <output id="wetRVal">{reverbWet}</output>

              <button onClick={closeReverbModal} style={backButtonStyle}>Close</button>
              <button onClick={reverb} style={backButtonStyle}>Apply Reverb</button>
            </div>
          </>
        )}

        <button style={adjustGainButtonStyle} onClick={openEquaModal}>
          10-Band Equalizer
        </button>

        {isEquaModalOpen && (
          <>
             <div style={overlayStyle} onClick={closeEquaModal} />
              <div style={modalStyle}>
              <div style={{ display: 'flex', gap: '5px' }}>
                <div style={sliderContainerStyle}>
                  <h2>32Hz</h2>
                    <input
                      id="filter0"
                      type="range"
                      min="-40"
                      max="40"
                      step="0.1"
                      value={filter0Val}
                      onInput={(e) => setFilter0(e.target.value)}
                      style={verticalSliderStyle}
                    />
                    <output id="0">{filter0Val} dB</output>
                </div>
                
                <div style={sliderContainerStyle}>
                  <h2>64Hz</h2>
                    <input
                      id="filter1"
                      type="range"
                      min="-40"
                      max="40"
                      step="0.1"
                      value={filter1Val}
                      onInput={(e) => setFilter1(e.target.value)}
                      style={verticalSliderStyle}
                    />
                    <output id="1">{filter1Val} dB</output>
                </div>

                <div style={sliderContainerStyle}>
                  <h2>125Hz</h2>
                  <input
                    id="filter2"
                    type="range"
                    min="-40"
                    max="40"
                    step="0.1"
                    value={filter2Val}
                    onInput={(e) => setFilter2(e.target.value)}
                    style={verticalSliderStyle}
                  />
                  <output id="2">{filter2Val} dB</output>
                  </div>

                <div style={sliderContainerStyle}> 
                <h2>250Hz</h2>
                <input
                  id="filter3"
                  type="range"
                  min="-40"
                  max="40"
                  step="0.1"
                  value={filter3Val}
                  onInput={(e) => setFilter3(e.target.value)}
                  style={verticalSliderStyle}
                />
                <output id="3">{filter3Val} dB</output>
                </div>
                 
                <div style={sliderContainerStyle}>
                <h2>500Hz</h2>
                <input
                  id="filter4"
                  type="range"
                  min="-40"
                  max="40"
                  step="0.1"
                  value={filter4Val}
                  onInput={(e) => setFilter4(e.target.value)}
                  style={verticalSliderStyle}
                />
                <output id="4">{filter4Val} dB</output>
                </div>
                 

                <div style={sliderContainerStyle}>
                <h2>1000Hz</h2>
                <input
                  id="filter5"
                  type="range"
                  min="-40"
                  max="40"
                  step="0.1"
                  value={filter5Val}
                  onInput={(e) => setFilter5(e.target.value)}
                  style={verticalSliderStyle}
                />
                <output id="5">{filter5Val} dB</output>
                </div>
                 
                <div style={sliderContainerStyle}>
                <h2>2000Hz</h2>
                <input
                  id="filter6"
                  type="range"
                  min="-40"
                  max="40"
                  step="0.1"
                  value={filter6Val}
                  onInput={(e) => setFilter6(e.target.value)}
                  style={verticalSliderStyle}
                />
                <output id="6">{filter6Val} dB</output>
                </div>
                 
                <div style={sliderContainerStyle}>
                <h2>4000Hz</h2>
                <input
                  id="filter7"
                  type="range"
                  min="-40"
                  max="40"
                  step="0.1"
                  value={filter7Val}
                  onInput={(e) => setFilter7(e.target.value)}
                  style={verticalSliderStyle}
                />
                <output id="7">{filter7Val} dB</output>
                </div>
                 
                <div style={sliderContainerStyle}>
                <h2>8000Hz</h2>
                <input
                  id="filter8"
                  type="range"
                  min="-40"
                  max="40"
                  step="0.1"
                  value={filter8Val}
                  onInput={(e) => setFilter8(e.target.value)}
                  style={verticalSliderStyle}
                />
                <output id="8">{filter8Val} dB</output>
                </div>
                 
                <div style={sliderContainerStyle}>
                <h2>16000Hz</h2>
                <input
                  id="filter9"
                  type="range"
                  min="-40"
                  max="40"
                  step="0.1"
                  value={filter9Val}
                  onInput={(e) => setFilter9(e.target.value)}
                  style={verticalSliderStyle}
                />
                <output id="9">{filter9Val} dB</output>
                </div>

              <button onClick={closeEquaModal} style={backButtonStyle}>Close</button>
              <button onClick={setFilter} style={backButtonStyle}>Apply EQ</button>

            </div>
            </div>
          </>
        )}
        <button style={adjustGainButtonStyle} onClick={undo}>
          Undo
        </button>
      </div>
    </div>
  );
}

export default Menu;
