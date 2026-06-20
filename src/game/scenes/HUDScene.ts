import Phaser from 'phaser';
import { SCENE_KEYS } from '../phaserGame';

export class HUDScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.HUD });
  }

  create(): void {
    this.add.text(10, 10, 'Team: 0/4 | Lv.1', {
      fontSize: '14px',
      color: '#ffffff',
      fontFamily: 'Arial',
    });
  }
}
