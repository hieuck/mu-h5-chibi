import Phaser from 'phaser';
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT } from '../phaserGame';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.GAME });
  }

  create(): void {
    this.add.text(GAME_WIDTH / 2, 50, 'MU Chibi Squad', {
      fontSize: '28px',
      color: '#ffdd44',
      fontFamily: 'Arial',
    }).setOrigin(0.5);

    this.scene.launch(SCENE_KEYS.HUD);
  }

  update(): void {
  }
}
