import Phaser from 'phaser';
import { SCENE_KEYS } from '../phaserGame';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.BOOT });
  }

  create(): void {
    const text = this.add.text(400, 300, 'MU Chibi Squad', {
      fontSize: '36px',
      color: '#ffdd44',
      fontFamily: 'Arial',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: text,
      alpha: { from: 0, to: 1 },
      duration: 1000,
      onComplete: () => {
        this.time.delayedCall(500, () => {
          this.scene.start(SCENE_KEYS.GAME);
        });
      },
    });
  }
}
