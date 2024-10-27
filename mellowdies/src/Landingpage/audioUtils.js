function adjustGain(audioCtx, gain, val) {
    // Loop through each channel in the audio buffer
    for (var k = 0; k < val.length; ++k)
    {
        var curr = val[k];
        if (curr.length)
        {
            for (var i = 0; i < curr.length; ++i) {
                gain.gain.linearRampToValueAtTime (curr[i].val, audioCtx.currentTime + curr[i].time);
            }
        }
        else
        {
            gain.gain.setValueAtTime ( curr.val, audioCtx.currentTime );
        }
    }
}


function applyFadeOut( audioCtx, destination, source, duration ) {
    var gain = audioCtx.createGain ();
    gain.gain.setValueAtTime (1, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime (0, audioCtx.currentTime + duration/1);
    gain.connect (destination);			
    source.connect (gain);
    return (gain);
}

function applyFadeOut( audioCtx, destination, source, duration ) {
    var gain = audioCtx.createGain ();
    gain.gain.setValueAtTime (0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime (1, audioCtx.currentTime + duration/1);
    gain.connect (destination);	
    source.connect (gain);

    return (gain);
}

function applyInvert(destination, source) {
    for (var i = 0; i < source.buffer.numberOfChannels; ++i) {
        var channel = source.buffer.getChannelData (i);
        
        for (var j = 0; j < channel.length; ++j)
            channel[j] *= -1;
    }

    source.connect (destination);
    return (source);
}

function applyFlip(destination, source) {
    var chan0 = source.buffer.getChannelData (0);
    var chan1 = source.buffer.getChannelData (1);
    var tmp   = 0;

    for (var j = 0; j < chan0.length; ++j)
    {
        tmp = chan0[j];
        chan0[j] = chan1[j];
        chan1[j] = tmp;
    }
    source.connect (destination);
	return (source);
}

function applyReverb( filter_chain, audioCtx, val ) {

    audioCtx   = wavesurfer.backend.ac;

    var reverbNode = filter_chain[2];
    var dryGainNode = filter_chain[3];
    var wetGainNode = filter_chain[4];

    dryGainNode.gain.value = 1 - ((val.mix - 0.5) * 2);
    wetGainNode.gain.value = 1 - ((0.5 - val.mix) * 2);

    var length = audioCtx.sampleRate * val.time;
    var impulse = audioCtx.createBuffer (2, length, audioCtx.sampleRate);
    var impulseL = impulse.getChannelData(0);
    var impulseR = impulse.getChannelData(1);
    var n, i;

    for (i = 0; i < length; i++) {
        n = val.reverse ? length - i : i;
        impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, val.decay);
        impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, val.decay);
    }
    reverbNode.buffer = impulse;
}
