import Phaser from 'phaser';
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT } from '../phaserGame';
import { AssetManifest } from '../systems/assetManifest';
import { getPhaserPreloadConfig, getAnimationConfigs } from '../systems/assetLoader';

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

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(GAME_WIDTH / 2 - 150, GAME_HEIGHT / 2, 300, 20);

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

    for (const c of configs) {
      this.load.spritesheet(c.key, c.path, {
        frameWidth: c.frameWidth,
        frameHeight: c.frameHeight,
      });
    }
  }

  create(): void {
    const manifest = new AssetManifest();
    const animConfigs = getAnimationConfigs(manifest);

    for (const [, anims] of animConfigs) {
      for (const anim of anims) {
        this.anims.create({
          key: anim.name,
          frames: anim.frames.map((frame: number) => ({
            key: anim.key,
            frame,
          })),
          frameRate: anim.frameRate,
          repeat: anim.repeat,
        });
      }
    }

    this.cameras.main.fadeIn(500, 0, 0, 0);
    this.time.delayedCall(300, () => {
      this.scene.start(SCENE_KEYS.GAME);
    });
  }
}
