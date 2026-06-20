import Phaser from 'phaser';
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT } from '../phaserGame';
import { AssetManifest } from '../systems/assetManifest';
import { getPhaserPreloadConfig } from '../systems/assetLoader';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.BOOT });
  }

  preload(): void {
    const manifest = new AssetManifest();
    const configs = getPhaserPreloadConfig(manifest);

    const loadingText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40, 'Loading...', {
      fontSize: '24px', color: '#ffdd44', fontFamily: 'Arial',
    }).setOrigin(0.5);

    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(GAME_WIDTH / 2 - 150, GAME_HEIGHT / 2, 300, 20);
    const progressBar = this.add.graphics();

    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0xffdd44, 1);
      progressBar.fillRect(GAME_WIDTH / 2 - 148, GAME_HEIGHT / 2 + 2, 296 * value, 16);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });

    // Load all assets as images (single-frame PNGs)
    for (const c of configs) {
      this.load.image(c.key, c.path);
    }
  }

  create(): void {
    this.cameras.main.fadeIn(500, 0, 0, 0);
    this.time.delayedCall(300, () => {
      this.scene.start(SCENE_KEYS.GAME);
    });
  }
}
