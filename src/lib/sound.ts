let context: AudioContext | null = null;
export function playSound(kind: 'match' | 'fail' | 'blessing', muted: boolean) {
  if (muted) return;
  try {
    context ??= new AudioContext();
    void context.resume();
    const frequencies = kind === 'blessing' ? [261.63, 329.63, 392, 523.25] : kind === 'fail' ? [180, 120] : [520, 780];
    const time = context.currentTime;
    frequencies.forEach((frequency, i) => {
      const oscillator = context!.createOscillator();
      const gain = context!.createGain();
      oscillator.type = kind === 'blessing' ? 'sine' : 'triangle';
      oscillator.frequency.value = frequency;
      const start = time + i * 0.09;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.04, start + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.001, start + (kind === 'blessing' ? 1.4 : 0.2));
      oscillator.connect(gain); gain.connect(context!.destination);
      oscillator.start(start); oscillator.stop(start + 1.5);
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
    });
  } catch { /* Audio is optional. */ }
}
