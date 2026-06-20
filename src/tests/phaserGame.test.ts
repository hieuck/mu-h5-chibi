jest.mock('phaser', () => {
  class MockScene {
    scene: { key: string };
    add: any;
    tweens: any;
    time: any;
    constructor(config: { key: string }) {
      this.scene = { key: config.key };
      this.add = { text: () => ({ setOrigin: () => this }) };
      this.tweens = { add: () => {} };
      this.time = { delayedCall: () => {} };
    }
  }
  const Scale = { FIT: 'FIT', CENTER_BOTH: 'CENTER_BOTH' };
  const Phaser = {
    AUTO: 'AUTO',
    Scale,
    Scene: MockScene,
  };
  return { __esModule: true, default: Phaser };
});

import { createGameConfig, SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT } from '../game/phaserGame';

describe('PhaserGame', () => {
  test('creates game config with correct dimensions', () => {
    const config = createGameConfig();

    expect(config.width).toBe(800);
    expect(config.height).toBe(600);
  });

  test('exports correct dimensions', () => {
    expect(GAME_WIDTH).toBe(800);
    expect(GAME_HEIGHT).toBe(600);
  });

  test('game config has correct parent element', () => {
    const config = createGameConfig();

    expect(config.parent).toBe('game-container');
  });

  test('SCENE_KEYS has all three scenes defined', () => {
    expect(SCENE_KEYS.BOOT).toBe('BootScene');
    expect(SCENE_KEYS.GAME).toBe('GameScene');
    expect(SCENE_KEYS.HUD).toBe('HUDScene');
  });

  test('game config registers scene classes', () => {
    const config = createGameConfig();

    expect(config.scene).toBeDefined();
  });
});
