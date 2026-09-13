let context: AudioContext | null = null;

// A short, original four-syllable choir cadence: ah / eh / oo / ah.
// Vowel formants give the arcade harmony a hallelujah-like choral sound.
export function playCircleBlessing(muted: boolean): () => void {
  if (muted) return () => {};
  const nodes: AudioNode[] = [];
  const voices: OscillatorNode[] = [];
  let cleanupTimer: ReturnType<typeof setTimeout> | undefined;
  let stopped = false;
  const stop = () => {
    if (stopped) return;
    stopped = true;
    clearTimeout(cleanupTimer);
    for (const voice of voices) { try { voice.stop(); } catch { /* Already ended. */ } }
    for (const node of nodes) node.disconnect();
  };
  try {
    context ??= new AudioContext();
    void context.resume().catch(stop);
    const audio = context;
    const master = audio.createGain();
    master.gain.value = 0.45;
    master.connect(audio.destination);
    nodes.push(master);
    const reverb = audio.createConvolver();
    const impulse = audio.createBuffer(2, Math.floor(audio.sampleRate * 1.6), audio.sampleRate);
    let noise = 17;
    for (let channel = 0; channel < 2; channel++) {
      const samples = impulse.getChannelData(channel);
      for (let i = 0; i < samples.length; i++) {
        noise = (Math.imul(noise, 1664525) + 1013904223) | 0;
        samples[i] = noise / 2147483648 * Math.pow(1 - i / samples.length, 3);
      }
    }
    reverb.buffer = impulse;
    const wet = audio.createGain();
    wet.gain.value = 0.2;
    reverb.connect(wet); wet.connect(master);
    nodes.push(reverb, wet);
    const start = audio.currentTime + 0.025;
    const syllables = [
      { at: 0, length: 0.36, root: 261.63, formants: [730, 1090, 2440] },
      { at: 0.32, length: 0.36, root: 329.63, formants: [530, 1840, 2480] },
      { at: 0.64, length: 0.44, root: 392, formants: [300, 870, 2240] },
      { at: 1.04, length: 1.35, root: 523.25, formants: [730, 1090, 2440] },
    ];
    for (const syllable of syllables) {
      for (const ratio of [0.5, 0.75, 1]) {
        const oscillator = audio.createOscillator();
        oscillator.type = 'sawtooth';
        oscillator.frequency.value = syllable.root * ratio;
        oscillator.detune.value = ratio === 1 ? 4 : -4;
        const envelope = audio.createGain();
        const at = start + syllable.at;
        envelope.gain.setValueAtTime(0, at);
        envelope.gain.linearRampToValueAtTime(0.075, at + 0.055);
        envelope.gain.setValueAtTime(0.055, at + syllable.length * 0.65);
        envelope.gain.exponentialRampToValueAtTime(0.001, at + syllable.length);
        for (const frequency of syllable.formants) {
          const formant = audio.createBiquadFilter();
          formant.type = 'bandpass'; formant.frequency.value = frequency; formant.Q.value = 7;
          oscillator.connect(formant); formant.connect(envelope); nodes.push(formant);
        }
        envelope.connect(master); envelope.connect(reverb);
        nodes.push(oscillator, envelope); voices.push(oscillator);
        oscillator.start(at); oscillator.stop(at + syllable.length + 0.03);
      }
    }
    cleanupTimer = setTimeout(stop, 4400);
    return stop;
  } catch { stop(); return () => {}; }
}
