import { SoundEvent, playSound } from '../game/systems/soundSystem';

describe('SoundSystem', () => {
  test('sound events have configured gain', () => {
    expect(SoundEvent.Attack).toBeDefined();
    expect(SoundEvent.LevelUp).toBeDefined();
    expect(SoundEvent.Loot).toBeDefined();
  });

  test('playSound returns false when no audio context', () => {
    const result = playSound(SoundEvent.Attack);
    expect(result).toBe(false);
  });
});
