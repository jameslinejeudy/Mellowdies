import WaveSurfer from 'wavesurfer.js';

export function sliceAudio(waveSurferInstance, startTime, endTime) {
    // Get the original buffer from the waveSurfer instance
    const audioBuffer = waveSurferInstance.backend.buffer;

    // Calculate the sample indices for slicing
    const startSample = Math.floor(startTime * audioBuffer.sampleRate);
    const endSample = Math.floor(endTime * audioBuffer.sampleRate);

    // Slice the buffer
    const slicedBuffer = audioBuffer.slice(startSample, endSample);

    // Update the waveSurfer instance with the new sliced buffer
    waveSurferInstance.backend.setBuffer(slicedBuffer);
    waveSurferInstance.drawBuffer();
}

export function deleteAudioSection(waveSurferInstance, startTime, endTime) {
    const audioBuffer = waveSurferInstance.backend.buffer;

    const startSample = Math.floor(startTime * audioBuffer.sampleRate);
    const endSample = Math.floor(endTime * audioBuffer.sampleRate);

    const beforeSlice = audioBuffer.slice(0, startSample);
    const afterSlice = audioBuffer.slice(endSample);

    // Concatenate the before and after parts to delete the selected section
    const newBuffer = concatAudioBuffers(beforeSlice, afterSlice);

    // Update the waveSurfer instance
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

    // Copy buffer1 into the new buffer
    for (let channel = 0; channel < numberOfChannels; channel++) {
        newBuffer.copyToChannel(buffer1.getChannelData(channel), channel);
        newBuffer.copyToChannel(buffer2.getChannelData(channel), channel, buffer1.length);
    }

    return newBuffer;
}

export function handleTrackClick(waveSurferInstance, clickPosition) {
    // Example of what you could do on track click
    const duration = waveSurferInstance.getDuration();
    const clickedTime = clickPosition * duration; // clickPosition is normalized between 0 and 1
    waveSurferInstance.seekTo(clickPosition);
}

