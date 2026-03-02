// Lightweight sound effects using Web Audio API (no external files needed)
const audioCtx = () => {
  if (!(window as any).__gameAudioCtx) {
    (window as any).__gameAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return (window as any).__gameAudioCtx as AudioContext;
};

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.15) {
  try {
    const ctx = audioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio not supported
  }
}

export const GameSounds = {
  tap: () => playTone(600, 0.08, 'square', 0.1),
  correct: () => {
    playTone(523, 0.1, 'sine', 0.15);
    setTimeout(() => playTone(659, 0.1, 'sine', 0.15), 80);
    setTimeout(() => playTone(784, 0.15, 'sine', 0.2), 160);
  },
  miss: () => playTone(200, 0.25, 'sawtooth', 0.1),
  combo: () => {
    playTone(784, 0.08, 'sine', 0.12);
    setTimeout(() => playTone(988, 0.12, 'sine', 0.18), 60);
  },
  countdown: () => playTone(440, 0.15, 'sine', 0.12),
  countdownGo: () => {
    playTone(880, 0.1, 'sine', 0.2);
    setTimeout(() => playTone(1100, 0.2, 'sine', 0.2), 80);
  },
  levelComplete: () => {
    [523, 659, 784, 1047].forEach((f, i) =>
      setTimeout(() => playTone(f, 0.2, 'sine', 0.15), i * 120)
    );
  },
  levelFail: () => {
    playTone(330, 0.2, 'sine', 0.12);
    setTimeout(() => playTone(262, 0.3, 'sine', 0.12), 200);
  },
};

export const Haptics = {
  light: () => navigator.vibrate?.(10),
  medium: () => navigator.vibrate?.(25),
  heavy: () => navigator.vibrate?.(50),
  success: () => navigator.vibrate?.([20, 40, 20]),
  error: () => navigator.vibrate?.([50, 30, 50]),
};
