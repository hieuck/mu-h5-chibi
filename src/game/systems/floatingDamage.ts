import Phaser from 'phaser';
import { getHealthBarColor } from './healthBar';

export interface FloatingNumber {
  text: Phaser.GameObjects.Text;
  timer: number;
}

export class FloatingDamage {
  private scene: Phaser.Scene;
  private active: FloatingNumber[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  show(x: number, y: number, damage: number, isCrit: boolean = false): void {
    const color = isCrit ? '#ffdd44' : '#ffffff';
    const size = isCrit ? '16px' : '12px';
    const prefix = isCrit ? 'CRIT! ' : '-';

    const text = this.scene.add.text(x, y, `${prefix}${damage}`, {
      fontSize: size, color, fontFamily: 'Arial', fontStyle: isCrit ? 'bold' : 'normal',
      stroke: '#000000', strokeThickness: 3,
    }).setOrigin(0.5);

    this.active.push({ text, timer: 0 });
  }

  showDrop(x: number, y: number, itemName: string, tier: string): void {
    const tierColors: Record<string, string> = { normal: '#cccccc', magic: '#4488ff', rare: '#ffff00', set: '#00ff44', ancient: '#ff4444', mythic: '#cc44ff' };
    const text = this.scene.add.text(x, y, `📦 ${itemName}`, {
      fontSize: '10px', color: tierColors[tier] || '#ffffff', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 2,
    }).setOrigin(0.5);

    this.active.push({ text, timer: 0 });
  }

  showGold(x: number, y: number, amount: number): void {
    const text = this.scene.add.text(x, y, `💰 +${amount}`, {
      fontSize: '10px', color: '#ffdd44', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 2,
    }).setOrigin(0.5);

    this.active.push({ text, timer: 0 });
  }

  update(delta: number): void {
    const DURATION = 1500;
    const FLOAT_SPEED = 30;

    for (let i = this.active.length - 1; i >= 0; i--) {
      const f = this.active[i];
      f.timer += delta;
      f.text.y -= FLOAT_SPEED * (delta / 1000);
      f.text.setAlpha(Math.max(0, 1 - f.timer / DURATION));

      if (f.timer >= DURATION) {
        f.text.destroy();
        this.active.splice(i, 1);
      }
    }
  }

  destroy(): void {
    this.active.forEach(f => f.text.destroy());
    this.active = [];
  }
}
