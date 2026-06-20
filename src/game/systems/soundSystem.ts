export enum SoundEvent {
  Attack = 'attack',
  LevelUp = 'levelup',
  Loot = 'loot',
  Click = 'click',
  Error = 'error',
}

const FREQUENCIES: Record<SoundEvent, number> = {
  [SoundEvent.Attack]: 220,
  [SoundEvent.LevelUp]: 880,
  [SoundEvent.Loot]: 440,
  [SoundEvent.Click]: 330,
  [SoundEvent.Error]: 110,
};

const GAINS: Record<SoundEvent, number> = {
  [SoundEvent.Attack]: 0.1,
  [SoundEvent.LevelUp]: 0.2,
  [SoundEvent.Loot]: 0.15,
  [SoundEvent.Click]: 0.08,
  [SoundEvent.Error]: 0.3,
};

let audioCtx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)(); }
    catch { return null; }
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

export function playSound(event: SoundEvent): boolean {
  try {
    const ctx = getContext();
    if (!ctx) return false;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = FREQUENCIES[event];
    gain.gain.value = GAINS[event];
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
    return true;
  } catch { return false; }
}
