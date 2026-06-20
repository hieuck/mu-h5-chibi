import Phaser from 'phaser';
import { SCENE_KEYS, GAME_WIDTH } from '../phaserGame';
import { GameScene } from './GameScene';

export class HUDScene extends Phaser.Scene {
  private goldText!: Phaser.GameObjects.Text;
  private invText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: SCENE_KEYS.HUD });
  }

  create(): void {
    this.goldText = this.add.text(GAME_WIDTH - 10, 10, 'Gold: 0', {
      fontSize: '14px', color: '#ffdd44', fontFamily: 'Arial',
    }).setOrigin(1, 0);

    this.invText = this.add.text(GAME_WIDTH - 10, 30, 'Inv: 0/40', {
      fontSize: '12px', color: '#aaaaff', fontFamily: 'Arial',
    }).setOrigin(1, 0);
  }

  update(): void {
    const gameScene = this.scene.get('GameScene') as GameScene | null;
    if (!gameScene) return;
  }
}
