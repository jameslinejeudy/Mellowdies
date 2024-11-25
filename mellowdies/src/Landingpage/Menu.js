import React, {useState}  from 'react';
import './Menu.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

var utils = require("audio-buffer-utils");
var blobber = require('audiobuffer-to-blob');
var slicer = require('audiobuffer-slice');
let sliceBuffer = null;

let buffers = [];
let copyBufs = [];

function storeBuffer (buffer) {
  buffers.push(buffer);
}

function getAudioSlice(buffer, start, end) {
  slicer(buffer, start * 1000, end * 1000, function(error, slicedBuffer) {
      if (error) {
          console.error(error);
          return;
      } else {
          sliceBuffer = slicedBuffer;
      }
  })
  return sliceBuffer;
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
  const [showAdvanced, setShowAdvanced] = useState(false);

  const error = (message) => toast.error(message);

  const success = (message) => toast.success(message);
  
  const toggleAdvancedOptions = () => {
    setShowAdvanced((prev) => !prev);
  };

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
      success("EQ applied to current playback.");
  }
  
  const undo = () => {
    if (buffers.length > 1) {
      let blob = blobber(buffers.pop());
      waveData[0].waveSurfer.loadBlob(blob).catch(error => console.log(error));
      success("Undid last action.");
    } else {
      error("Nothing to undo.");
      return;
    }
  }

  const reset = () => {
    if (buffers.length >= 1) {
      waveData[0].waveSurfer.loadBlob(blobber(buffers[0])).catch(error => console.log(error));
      buffers = [];
      success("All changes have been reset.");
    } else {
      error("Nothing to reset.");
      return;
    }
  }

  const redo = () => {
    if (buffers.length >= 1) {
      waveData[0].waveSurfer.loadBlob(blobber(buffers[0])).catch(error => console.log(error));
      buffers = [];
      success("All changes have been reset.");
    } else {
      error("Nothing to reset.");
      return;
    }
  }

  const reverse = () => {
    console.log(buffers.length);
    if (waveData[0].regions.getRegions().length != 1) {
      error("Please select a region to apply the effect.");
      return;
    }

    let buffer = waveData[0].waveSurfer.getDecodedData();
    let clone = utils.clone(buffer);
    storeBuffer(clone);
    let region = (waveData[0].regions.getRegions())[0];
    let sampleRate = buffer.sampleRate;
    if (buffer) {
      utils.reverse(buffer, buffer, region.start * sampleRate, region.end * sampleRate);
      success("Reversed region.");
      let blob = blobber(buffer);
      waveData[0].waveSurfer.loadBlob(blob).catch(error => console.log(error));
    } else {
      error('No audio buffer loaded');
    }
  };

  const invert = () => {
    if (waveData[0].regions.getRegions().length != 1) {
      error("Please select a region to apply the effect.");
      return;
    }

    let buffer = waveData[0].waveSurfer.getDecodedData();
    let clone = utils.clone(buffer);
    storeBuffer(clone);
    let region = (waveData[0].regions.getRegions())[0];
    let sampleRate = buffer.sampleRate;
    if (buffer) {
      utils.invert(buffer, buffer, region.start * sampleRate, region.end * sampleRate);
      success("Inverted region.");
      let blob = blobber(buffer);
      waveData[0].waveSurfer.loadBlob(blob).catch(error => console.log(error));
    } else {
      error('No audio buffer loaded');
    }
  };

  const normalize = () => {
    if (waveData[0].regions.getRegions().length != 1) {
      error("Please select a region to apply the effect.");
      return;
    }

    let buffer = waveData[0].waveSurfer.getDecodedData();
    let clone = utils.clone(buffer);
    storeBuffer(clone);
    let region = (waveData[0].regions.getRegions())[0];
    let sampleRate = buffer.sampleRate;
    if (buffer) {
      utils.normalize(buffer, buffer, region.start * sampleRate, region.end * sampleRate);
      success("Normalized region.");
      let blob = blobber(buffer);
      waveData[0].waveSurfer.loadBlob(blob).catch(error => console.log(error));
    } else {
      error('No audio buffer loaded');
    }
  };

  const openGainModal = () => setGainModalOpen(true);
  const closeGainModal = () => setGainModalOpen(false);

  const adjustGain = () => {
    if (waveData[0].regions.getRegions().length != 1) {
      error("Please select a region to apply the effect.");
      return;
    }

    let buffer = waveData[0].waveSurfer.getDecodedData();
    let clone = utils.clone(buffer);
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
      success('Adjusted gain on region:', gain);
      let blob = blobber(buffer);
      waveData[0].waveSurfer.loadBlob(blob).catch(error => console.log(error));
    }
  };

  const fadeIn = () => {
    if (waveData[0].regions.getRegions().length != 1) {
      error("Please select a region to apply the effect.");
      return;
    }

    let buffer = waveData[0].waveSurfer.getDecodedData();
    let clone = utils.clone(buffer);
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
      success('Region faded in.');
      let blob = blobber(buffer);
      waveData[0].waveSurfer.loadBlob(blob).catch(error => console.log(error));
    }
  };

  const fadeOut = () => {
    if (waveData[0].regions.getRegions().length != 1) {
      error("Please select a region to apply the effect.");
      return;
    }

    let buffer = waveData[0].waveSurfer.getDecodedData();
    let clone = utils.clone(buffer);
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
      success('Region faded out.');
      let blob = blobber(buffer);
      waveData[0].waveSurfer.loadBlob(blob).catch(error => console.log(error));
    }
  };

  const openDistortionModal = () => setDistortionModalOpen(true);
  const closeDistortionModal = () => setDistortionModalOpen(false);

  const distort = () => {
    if (waveData[0].regions.getRegions().length != 1) {
      error("Please select a region to apply the effect.");
      return;
    }

    let buffer = waveData[0].waveSurfer.getDecodedData();
    if (!buffer) return;

    let clone = utils.clone(buffer);
    storeBuffer(clone);

    let region = waveData[0].regions.getRegions()[0];
    let sampleRate = buffer.sampleRate;

    const gain = gainDistortValue / 100; 
    const wet = 0.5;
    const dry = 1 - wet; 

    let start = Math.floor(region.start * sampleRate);
    let end = Math.ceil(region.end * sampleRate);

    if (buffer) {
        for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
            let channelData = buffer.getChannelData(channel);

            for (let sample = start; sample < end; sample += 1) {
                const drySample = channelData[sample];
                const wetSample = Math.atan(gain * drySample);
                channelData[sample] = (dry * drySample) + (wet * wetSample);
            }
        }

        success('Applied distortion to region.');
        let blob = blobber(buffer);
        waveData[0].waveSurfer.loadBlob(blob).catch(error => console.log(error));
    }
};


  const openDelayModal = () => setDelayModalOpen(true);
  const closeDelayModal = () => setDelayModalOpen(false);

  const delay = () => {
    if (waveData[0].regions.getRegions().length != 1) {
      error("Please select a region to apply the effect.");
      return;
    }

    let buffer = waveData[0].waveSurfer.getDecodedData();
    if (!buffer) return;

    let clone = utils.clone(buffer);
    storeBuffer(clone);

    let region = waveData[0].regions.getRegions()[0];
    let sampleRate = buffer.sampleRate;
    let start = Math.floor(region.start * sampleRate);
    let end = Math.ceil(region.end * sampleRate);
    let wet = wetness;
    let dry = dryness;
    let feeder = feedback;

    let numChannels = buffer.numberOfChannels;
    let delaySamples = Math.ceil(sampleRate * delayTime);

    if (numChannels === 1) {
        let channelData = buffer.getChannelData(0);
        let delayBuffer = new Float32Array(delaySamples).fill(0);

        for (let i = start; i < end; i++) {
            let delayIndex = (i - start) % delaySamples;
            let delayedSample = delayBuffer[delayIndex];
            channelData[i] = (channelData[i] * dry) + (delayedSample * wet);
            delayBuffer[delayIndex] = (feeder * delayedSample) + channelData[i];
        }
    } else if (numChannels === 2) {
        let channelLeft = buffer.getChannelData(0);
        let channelRight = buffer.getChannelData(1);
        let delayBufferLeft = new Float32Array(delaySamples).fill(0);
        let delayBufferRight = new Float32Array(delaySamples).fill(0);

        for (let i = start; i < end; i++) {
            let delayIndex = (i - start) % delaySamples;
            let delayedLeft = delayBufferLeft[delayIndex];
            channelLeft[i] = (channelLeft[i] * dry) + (delayedLeft * wet);
            delayBufferLeft[delayIndex] = (feeder * delayedLeft) + channelLeft[i];
            let delayedRight = delayBufferRight[delayIndex];
            channelRight[i] = (channelRight[i] * dry) + (delayedRight * wet);
            delayBufferRight[delayIndex] = (feeder * delayedRight) + channelRight[i];
        }
    }
    success("Applied delay to region.");
    let blob = blobber(buffer);
    waveData[0].waveSurfer.loadBlob(blob).catch(error => console.error(error));
};


  const openReverbModal = () => setReverbModalOpen(true);
  const closeReverbModal = () => setReverbModalOpen(false);

  const reverb = () => {
    if (waveData[0].regions.getRegions().length != 1) {
      error("Please select a region to apply the effect.");
      return;
    }

    let buffer = waveData[0].waveSurfer.getDecodedData();
    if (!buffer) return;

    let clone = utils.clone(buffer);
    storeBuffer(clone);

    let region = waveData[0].regions.getRegions()[0];
    let sampleRate = buffer.sampleRate;
    let start = Math.floor(region.start * sampleRate);
    let end = Math.ceil(region.end * sampleRate);
    let bufferSize = end - start;

    let channelLeft = buffer.getChannelData(0);
    let channelRight = buffer.getChannelData(1);
    let samplesLeft = new Float32Array(channelLeft.subarray(start, end));
    let samplesRight = new Float32Array(channelRight.subarray(start, end));

    const combDelays = [0.0297, 0.0371, 0.0411, 0.0437].map(t => Math.floor(t * sampleRate));
    const combGains = [0.773, 0.802, 0.753, 0.733];
    const allPassDelays = [0.005, 0.0017].map(t => Math.floor(t * sampleRate));
    const decayFactor = decay || 0.5;
    const wetLevel = reverbWet || 0.5;

    const processCombFilters = (samples) => {
        const combBuffers = combDelays.map(delay => new Float32Array(delay).fill(0));
        let output = new Float32Array(samples.length);

        for (let i = 0; i < samples.length; i++) {
            let wetSample = 0;
            for (let c = 0; c < combBuffers.length; c++) {
                const delay = combBuffers[c];
                const delayIndex = i % delay.length;
                const delayedSample = delay[delayIndex];
                wetSample += delayedSample;
                delay[delayIndex] = samples[i] + delayedSample * combGains[c] * decayFactor;
            }
            output[i] = wetSample;
        }
        return output;
    };

    let combOutputLeft = processCombFilters(samplesLeft);
    let combOutputRight = processCombFilters(samplesRight);

    const processAllPassFilters = (samples) => {
        const allPassBuffers = allPassDelays.map(delay => new Float32Array(delay).fill(0));

        for (let i = 0; i < samples.length; i++) {
            for (let a = 0; a < allPassBuffers.length; a++) {
                const delay = allPassBuffers[a];
                const delayIndex = i % delay.length;
                const delayedSample = delay[delayIndex];

                const allPassSample = -0.7 * samples[i] + delayedSample + 0.7 * samples[i];
                delay[delayIndex] = samples[i] + delayedSample * 0.7;
                samples[i] = allPassSample;
            }
        }
        return samples;
    };

    let allPassOutputLeft = processAllPassFilters(combOutputLeft);
    let allPassOutputRight = processAllPassFilters(combOutputRight);

    for (let i = 0; i < bufferSize; i++) {
        channelLeft[start + i] = ((1 - wetLevel) * samplesLeft[i]) + (wetLevel * allPassOutputLeft[i]);
        channelRight[start + i] = ((1 - wetLevel) * samplesRight[i]) + (wetLevel * allPassOutputRight[i]);
    }

    success('Applied reverb to region');
    let blob = blobber(buffer);
    waveData[0].waveSurfer.loadBlob(blob).catch(error => console.log(error));
};

  const closeEquaModal = () => setEquaModalOpen(false);
  const openEquaModal = () => {
    setEquaInit(true);
    setEquaModalOpen(true);
  }

  const cut = () => {
    if (waveData[0].regions.getRegions().length === 1) {
      let buffer = waveData[0].waveSurfer.getDecodedData();
      let clone = utils.clone(buffer)
      storeBuffer(clone);
      let region = (waveData[0].regions.getRegions())[0];
      let slicedBuffer = getAudioSlice(buffer, region.start, region.end);
      copyBufs[0] = slicedBuffer;
      let newBuf1 = getAudioSlice(buffer, 0, region.start);
      let newBuf2 = getAudioSlice(buffer, region.end, buffer.duration);
      let newBuf = utils.concat(newBuf1, newBuf2);
      let blob = blobber(newBuf);
      waveData[0].waveSurfer.loadBlob(blob).catch(error => console.log(error));
      success("Region has been cut.");
      return;
    } else {
      error("Please select a region to cut.");
      return;
    }
  }

  const copy = () => {
    if (waveData[0].regions.getRegions().length === 1) {
      let buffer = waveData[0].waveSurfer.getDecodedData();
      let clone = utils.clone(buffer);
      storeBuffer(clone);
      let region = (waveData[0].regions.getRegions())[0];
      let slicedBuffer = getAudioSlice(buffer, region.start, region.end);
      copyBufs[0] = slicedBuffer;
      success("Region has been copied.");
      return;
    } else {
      error("Please select a region to copy.");
      return;
    }
  }

  const paste = () => {
    if (copyBufs.length >= 1) {
      let buffer = waveData[0].waveSurfer.getDecodedData();
      let clone = utils.clone(buffer);
      storeBuffer(clone);
      if (waveData[0].regions.getRegions().length === 1) {
        let region = (waveData[0].regions.getRegions())[0];
        let newBuf1 = getAudioSlice(buffer, 0, region.start);
        let newBuf2 = getAudioSlice(buffer, region.end, buffer.duration);
        let newBuf = utils.concat(newBuf1, copyBufs[0], newBuf2);
        let blob = blobber(newBuf);
        waveData[0].waveSurfer.loadBlob(blob).catch(error => console.log(error));
        success("Region has been pasted.");
      } else {
        let currTime = waveData[0].waveSurfer.getCurrentTime();
        let newBuf1 = getAudioSlice(buffer, 0, currTime);
        let newBuf2 = getAudioSlice(buffer, currTime, buffer.duration);
        let newBuf = utils.concat(newBuf1, copyBufs[0], newBuf2);
        let blob = blobber(newBuf);
        waveData[0].waveSurfer.loadBlob(blob).catch(error => console.log(error));
        success("Region has been pasted.");
      }
    } else {
      error("Nothing to paste.");
      return;
    }
  }
  

  return (
    <div className="menubackground">
      <ToastContainer position="bottom-right" autoClose={2000} />

      {/* Toolbar at the Top */}
      <div className="topToolbar">
        <button className="toolbarButtonStyle" onClick={undo}>
          Undo
        </button>
        <button className="toolbarButtonStyle" onClick={redo}>
          Redo
        </button>
        <button className="toolbarButtonStyle" onClick={reset}>
          Reset
        </button>
        <button  className="bufferButtonStyle" onClick={cut}>
          Cut
        </button>

        <button  className="bufferButtonStyle" onClick={copy}>
          Copy
        </button>

        <button  className="bufferButtonStyle" onClick={paste}>
          Paste
        </button>
      </div>

      <div className="contentStyle">
        <h3 className="sectionTitle">Selected Region</h3>
        <div className="buttonGrid">
          <button className="backButtonStyle" onClick={handleBack}>Back</button>
          <button className="simpleButtonStyle" onClick={reverse}>Reverse</button>
          <button className="simpleButtonStyle" onClick={fadeIn}>Fade In</button>
          <button className="simpleButtonStyle" onClick={fadeOut}>Fade Out</button>
          <button className="simpleButtonStyle" onClick={invert}>Invert</button>
        </div>
      </div>


      <div className="contentStyle">
        <div className='buttonContainer'>

        <button className="backButtonStyle" onClick={handleBack}>Back</button>

        {isGainModalOpen && (
          <>
             <div className="overlayStyle" onClick={closeGainModal} />
              <div className="modalStyle">
                <h2>Gain Percentage</h2>
                <input
                  id="gains"
                  type="range"
                  min="0"
                  max="200"
                  step="0.01"
                  value={gainValue}
                  onInput={(e) => setGainValue(e.target.value)}
                  className="sliderStyle"
                />
                <output id="gainVal">{gainValue}%</output>
              <button onClick={closeGainModal} className="navigationButtonStyle">Close</button>
              <button onClick={adjustGain} className="navigationButtonStyle">Apply Gain</button>
            </div>
          </>
        )}

        {isDelayModalOpen && (
          <>
             <div className="overlayStyle" onClick={closeDelayModal} />
              <div className="modalStyle">
                <h2>Delay Time</h2>
                <input
                  id="delayT"
                  type="range"
                  min="0"
                  max="6"
                  step="0.01"
                  value={delayTime}
                  onInput={(e) => setDelayTime(e.target.value)}
                  className="sliderStyle"
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
                  className="sliderStyle"
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
                  className="sliderStyle"
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
                  className="sliderStyle"
                />
                <output id="dryVal">{dryness}</output>
              <button onClick={closeDelayModal} className="navigationButtonStyle">Close</button>
              <button onClick={delay} className="navigationButtonStyle">Apply Delay</button>
            </div>
          </>
        )}

        {isDistortionModalOpen && (
          <>
             <div className="overlayStyle" onClick={closeDistortionModal} />
              <div className="modalStyle">
                <h2>Gain Percentage</h2>
                <input
                  id="gains"
                  type="range"
                  min="0"
                  max="200"
                  step="0.01"
                  value={gainDistortValue}
                  onInput={(e) => setGainDistortValue(e.target.value)}
                  className="sliderStyle"
                />
                <output id="gainDistortVal">{gainDistortValue}%</output>
              <button onClick={closeDistortionModal} className="navigationButtonStyle">Close</button>
              <button onClick={distort} className="navigationButtonStyle">Apply Distortion</button>
            </div>
          </>
        )}

        {isReverbModalOpen && (
          <>
             <div className="overlayStyle" onClick={closeReverbModal} />
              <div className="modalStyle">
                <h2>Time</h2>
                <input
                  id="reverbT"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={reverbTime}
                  onInput={(e) => setReverbTime(e.target.value)}
                  className="sliderStyle"
                />
                <output id="reverbTime">{reverbTime}</output>

                <h2>Decay</h2>
                <input
                  id="decay"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={decay}
                  onInput={(e) => setDecay(e.target.value)}
                  className="sliderStyle"
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
                  className="sliderStyle"
                />
                <output id="wetRVal">{reverbWet}</output>

              <button onClick={closeReverbModal} className="navigationButtonStyle">Close</button>
              <button onClick={reverb} className="navigationButtonStyle">Apply Reverb</button>
            </div>
          </>
        )}

        {isEquaModalOpen && (
          <>
             <div className="overlayStyle" onClick={closeEquaModal} />
              <div className="modalStyle">
              <div style={{ display: 'flex', gap: '5px' }}>
                <div className="sliderContainerStyle">
                  <h2>32Hz</h2>
                    <input
                      id="filter0"
                      type="range"
                      min="-40"
                      max="40"
                      step="0.1"
                      value={filter0Val}
                      onInput={(e) => setFilter0(e.target.value)}
                      className="verticalSliderStyle"
                    />
                    <output id="0">{filter0Val} dB</output>
                </div>
                
                <div className="sliderContainerStyle">
                  <h2>64Hz</h2>
                    <input
                      id="filter1"
                      type="range"
                      min="-40"
                      max="40"
                      step="0.1"
                      value={filter1Val}
                      onInput={(e) => setFilter1(e.target.value)}
                      className="verticalSliderStyle"
                    />
                    <output id="1">{filter1Val} dB</output>
                </div>

                <div className="sliderContainerStyle">
                  <h2>125Hz</h2>
                  <input
                    id="filter2"
                    type="range"
                    min="-40"
                    max="40"
                    step="0.1"
                    value={filter2Val}
                    onInput={(e) => setFilter2(e.target.value)}
                    className="verticalSliderStyle"
                  />
                  <output id="2">{filter2Val} dB</output>
                  </div>

                <div className="sliderContainerStyle"> 
                <h2>250Hz</h2>
                <input
                  id="filter3"
                  type="range"
                  min="-40"
                  max="40"
                  step="0.1"
                  value={filter3Val}
                  onInput={(e) => setFilter3(e.target.value)}
                  className="verticalSliderStyle"
                />
                <output id="3">{filter3Val} dB</output>
                </div>
                 
                <div className="sliderContainerStyle">
                <h2>500Hz</h2>
                <input
                  id="filter4"
                  type="range"
                  min="-40"
                  max="40"
                  step="0.1"
                  value={filter4Val}
                  onInput={(e) => setFilter4(e.target.value)}
                  className="verticalSliderStyle"
                />
                <output id="4">{filter4Val} dB</output>
                </div>
                 

                <div className="sliderContainerStyle">
                <h2>1000Hz</h2>
                <input
                  id="filter5"
                  type="range"
                  min="-40"
                  max="40"
                  step="0.1"
                  value={filter5Val}
                  onInput={(e) => setFilter5(e.target.value)}
                  className="verticalSliderStyle"
                />
                <output id="5">{filter5Val} dB</output>
                </div>
                 
                <div className="sliderContainerStyle">
                <h2>2000Hz</h2>
                <input
                  id="filter6"
                  type="range"
                  min="-40"
                  max="40"
                  step="0.1"
                  value={filter6Val}
                  onInput={(e) => setFilter6(e.target.value)}
                  className="verticalSliderStyle"
                />
                <output id="6">{filter6Val} dB</output>
                </div>
                 
                <div className="sliderContainerStyle">
                <h2>4000Hz</h2>
                <input
                  id="filter7"
                  type="range"
                  min="-40"
                  max="40"
                  step="0.1"
                  value={filter7Val}
                  onInput={(e) => setFilter7(e.target.value)}
                  className="verticalSliderStyle"
                />
                <output id="7">{filter7Val} dB</output>
                </div>
                 
                <div className="sliderContainerStyle">
                <h2>8000Hz</h2>
                <input
                  id="filter8"
                  type="range"
                  min="-40"
                  max="40"
                  step="0.1"
                  value={filter8Val}
                  onInput={(e) => setFilter8(e.target.value)}
                  className="verticalSliderStyle"
                />
                <output id="8">{filter8Val} dB</output>
                </div>
                 
                <div className="sliderContainerStyle">
                <h2>16000Hz</h2>
                <input
                  id="filter9"
                  type="range"
                  min="-40"
                  max="40"
                  step="0.1"
                  value={filter9Val}
                  onInput={(e) => setFilter9(e.target.value)}
                  className="verticalSliderStyle"
                />
                <output id="9">{filter9Val} dB</output>
                </div>

              <button onClick={closeEquaModal} className="navigationButtonStyle">Close</button>
              <button onClick={setFilter} className="navigationButtonStyle">Apply EQ</button>

            </div>
            </div>
          </>
        )}
        <button className="effectsButtonStyle" onClick={toggleAdvancedOptions}>
            {showAdvanced ? 'Hide Audio Effects' : 'Audio Effects'}
          </button>
          {showAdvanced && (
            <div className="advancedOptions">
              <button className="modalButtonStyle" onClick={normalize}>
                Normalize
              </button>
              <button  className="modalButtonStyle" onClick={openGainModal}>
                Adjust Gain
              </button>
              <button  className="modalButtonStyle" onClick={openDelayModal}>
                Adjust Delay
              </button>
              <button  className="modalButtonStyle" onClick={openDistortionModal}>
                Apply Distortion
              </button>
              <button  className="modalButtonStyle" onClick={openReverbModal}>
                Apply Reverb
              </button>
              <button  className="modalButtonStyle" onClick={openEquaModal}>
                10-Band Equalizer
              </button>
              {/* Add other advanced buttons here as needed */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Menu;
