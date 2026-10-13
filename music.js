// The songs (engine/audio.js: one token per step, `-` holds, `.` rests) and the sea under them.
export const songs = {
  // the harbour at dusk: unhurried, a little wistful
  harbor: {
    bpm: 96,
    channels: { lead: { inst: 'pulse25', echo: 0.3 }, harp: { inst: 'pluck' }, bass: { inst: 'bass' }, drums: { inst: 'drums', vol: 0.4 } },
    patterns: {
      A: {
        lead: 'E5 - - D5 C5 - D5 - E5 - G5 - E5 - - -',
        harp: 'C4 E4 G4 E4 A3 C4 E4 C4 F3 A3 C4 A3 G3 B3 D4 B3',
        bass: 'C3 - . . A2 - . . F2 - . . G2 - . .',
        drums: 'k . h . . . h . k . h . . . h h',
      },
      B: {
        lead: 'A5 - G5 - E5 - D5 - C5 - D5 - E5 - - -',
        harp: 'F3 A3 C4 A3 C4 E4 G4 E4 F3 A3 C4 A3 G3 B3 D4 G4',
        bass: 'F2 - . . C3 - . . F2 - . . G2 - G2 .',
        drums: 'k . h . s . h . k . h . s . h h',
      },
    },
    song: ['A', 'A', 'B', 'A'],
  },
  // inside the lighthouse: an old man's room, a slow waltz
  keeper: {
    bpm: 84, steps: 3,
    channels: { lead: { inst: 'bell' }, bass: { inst: 'tri' } },
    patterns: {
      A: { lead: 'G4 - B4 D5 - B4 C5 - A4 G4 - -', bass: 'G2 . . G2 . . A2 . . D2 . .' },
      B: { lead: 'E5 - D5 C5 - A4 B4 - G4 A4 - -', bass: 'C3 . . A2 . . G2 . . D2 . .' },
    },
    song: ['A', 'B'],
  },
  // the lamp lit, night over the harbour: the harbour's tune, slower and softer
  night: {
    bpm: 72,
    channels: { lead: { inst: 'sine', echo: 0.45 }, pad: { inst: 'pad' }, bass: { inst: 'bass' } },
    patterns: {
      A: {
        lead: 'E5 - - D5 C5 - D5 - E5 - G5 - E5 - - -',
        pad: 'C4 - - - A3 - - - F3 - - - G3 - - -',
        bass: 'C3 - - - A2 - - - F2 - - - G2 - - -',
      },
    },
    song: ['A'],
  },
};

const rnd = (a, b) => a + Math.random() * (b - a);

// A looping noise through a filter, its level breathing at `lfo` Hz: the sea's bed.
function bed(ctx, noise, dest, { type, freq, gain, lfo = 0, depth = 0 }) {
  const src = ctx.createBufferSource();
  src.buffer = noise;
  src.loop = true;
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.frequency.value = freq;
  const g = ctx.createGain();
  g.gain.value = gain;
  src.connect(f).connect(g).connect(dest);
  let osc = null;
  if (lfo) {
    osc = ctx.createOscillator();
    osc.frequency.value = lfo;
    const d = ctx.createGain();
    d.gain.value = depth;
    osc.connect(d).connect(g.gain);
    osc.start();
  }
  src.start();
  return () => { src.stop(); osc?.stop(); };
}

export const ambiences = {
  // waves coming in slowly, and now and then a gull
  sea: ({ ctx, dest, noise, tone }) => {
    const stops = [bed(ctx, noise, dest, { type: 'lowpass', freq: 520, gain: 0.08, lfo: 0.12, depth: 0.06 })];
    const gull = setInterval(() => {
      if (Math.random() > 0.3) return;
      const at = ctx.currentTime + 0.05;
      for (let i = 0; i < 2; i++) tone({ at: at + i * 0.22, freq: rnd(1500, 1800), to: rnd(1100, 1300), len: 0.18, wave: 'sine', gain: 0.02, dest });
    }, 2500);
    return () => { stops.forEach((s) => s()); clearInterval(gull); };
  },
};
