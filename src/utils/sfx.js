let audioCtx = null;
let sfxMuted = false;
let bgmEnabled = true;
let bgmTimer = null;
let bgmStep = 0;

const BGM_MELODY = [
  65, 69, 72, 76, 72, 69, 67, 69,
  67, 71, 74, 76, 74, 71, 69, 67,
  64, 67, 71, 74, 71, 67, 69, 71,
  69, 72, 76, 79, 76, 72, 74, 76,
];
const BGM_BASS = [53, 55, 52, 57];

const midiToFreq = (m) => 440 * Math.pow(2, (m - 69) / 12);

export function isSfxMuted() {
  return sfxMuted;
}

export function isBgmEnabled() {
  return bgmEnabled;
}

function ensureCtx() {
  if (typeof window === 'undefined') return null;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) {
    try {
      audioCtx = new Ctx();
    } catch {
      return null;
    }
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playBgmPluck(freq, gainPeak = 0.022, dur = 0.42) {
  const ctx = ensureCtx();
  if (!ctx || !bgmEnabled) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1150, now);
    filter.frequency.exponentialRampToValueAtTime(340, now + dur);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(gainPeak, now + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + dur + 0.03);
  } catch {
    return;
  }
}

export function startBgmLoop() {
  if (!bgmEnabled || bgmTimer !== null || typeof window === 'undefined') return;
  ensureCtx();
  const stepMs = 285;
  const tick = () => {
    if (!bgmEnabled) return;
    const note = BGM_MELODY[bgmStep % BGM_MELODY.length];
    playBgmPluck(midiToFreq(note), 0.02, 0.36);

    if (bgmStep % 8 === 0) {
      const bassNote = BGM_BASS[Math.floor(bgmStep / 8) % BGM_BASS.length];
      playBgmPluck(midiToFreq(bassNote), 0.024, 0.95);
    }
    bgmStep = (bgmStep + 1) % BGM_MELODY.length;
  };
  tick();
  bgmTimer = window.setInterval(tick, stepMs);
}

export function stopBgmLoop() {
  if (bgmTimer !== null && typeof window !== 'undefined') {
    window.clearInterval(bgmTimer);
    bgmTimer = null;
  }
}

export function toggleBgm() {
  bgmEnabled = !bgmEnabled;
  if (bgmEnabled) startBgmLoop();
  else stopBgmLoop();
  return bgmEnabled;
}

export function toggleSfxMute() {
  sfxMuted = !sfxMuted;
  return sfxMuted;
}

export function ensureBgmStarted() {
  if (bgmEnabled && bgmTimer === null) {
    startBgmLoop();
  }
}

function tone(freq, duration = 0.08, type = 'sine', gainVal = 0.06, delay = 0) {
  if (sfxMuted) return;
  const ctx = ensureCtx();
  if (!ctx) return;
  try {
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(gainVal, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  } catch {
    //kalau browser masih ngeblok autoplay sblm user klik apa2 biarin aja biar ga error
  }
}

export const SFX = {
  pop(pitchIndex = 0) {
    ensureBgmStarted();
    const base = 360 + Math.min(24, Math.max(0, pitchIndex)) * 18;
    tone(base, 0.075, 'triangle', 0.055);
  },
  remove() {
    ensureBgmStarted();
    tone(290, 0.08, 'sine', 0.045);
    tone(220, 0.08, 'sine', 0.035, 0.03);
  },
  click() {
    ensureBgmStarted();
    tone(520, 0.045, 'sine', 0.04);
  },
  success() {
    ensureBgmStarted();
    tone(523.25, 0.14, 'triangle', 0.06, 0);
    tone(659.25, 0.14, 'triangle', 0.06, 0.08);
    tone(783.99, 0.22, 'triangle', 0.07, 0.16);
    tone(1046.5, 0.28, 'sine', 0.05, 0.24);
  },
  wrong() {
    ensureBgmStarted();
    tone(210, 0.14, 'sawtooth', 0.04, 0);
    tone(165, 0.22, 'sawtooth', 0.04, 0.11);
  },
  zap() {
    ensureBgmStarted();
    tone(740, 0.09, 'sawtooth', 0.045, 0);
    tone(480, 0.14, 'triangle', 0.04, 0.06);
  },
};
