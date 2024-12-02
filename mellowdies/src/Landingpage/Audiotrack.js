import WaveSurfer from 'wavesurfer.js';

export function sliceAudio(waveSurferInstance, startTime, endTime) {
    
    const audioBuffer = waveSurferInstance.backend.buffer;

    
    const startSample = Math.floor(startTime * audioBuffer.sampleRate);
    const endSample = Math.floor(endTime * audioBuffer.sampleRate);

    
    const slicedBuffer = audioBuffer.slice(startSample, endSample);

    
    waveSurferInstance.backend.setBuffer(slicedBuffer);
    waveSurferInstance.drawBuffer();
}

export function deleteAudioSection(waveSurferInstance, startTime, endTime) {
    const audioBuffer = waveSurferInstance.backend.buffer;

    const startSample = Math.floor(startTime * audioBuffer.sampleRate);
    const endSample = Math.floor(endTime * audioBuffer.sampleRate);

    const beforeSlice = audioBuffer.slice(0, startSample);
    const afterSlice = audioBuffer.slice(endSample);

    
    const newBuffer = concatAudioBuffers(beforeSlice, afterSlice);

    
    waveSurferInstance.backend.setBuffer(newBuffer);
    waveSurferInstance.drawBuffer();
}

function concatAudioBuffers(buffer1, buffer2) {
    const numberOfChannels = buffer1.numberOfChannels;
    const newBufferLength = buffer1.length + buffer2.length;
    const newBuffer = new AudioBuffer({
        length: newBufferLength,
        numberOfChannels: numberOfChannels,
        sampleRate: buffer1.sampleRate
    });

    
    for (let channel = 0; channel < numberOfChannels; channel++) {
        newBuffer.copyToChannel(buffer1.getChannelData(channel), channel);
        newBuffer.copyToChannel(buffer2.getChannelData(channel), channel, buffer1.length);
    }

    return newBuffer;
}

export function handleTrackClick(waveSurferInstance, clickPosition) {
    
    const duration = waveSurferInstance.getDuration();
    const clickedTime = clickPosition * duration; 
    waveSurferInstance.seekTo(clickPosition);
}

