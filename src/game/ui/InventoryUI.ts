import Phaser from 'phaser';
import { Inventory } from '../systems/inventory';
import { Equipment } from '../entities/equipment';

export class InventoryUI {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private items: Phaser.GameObjects.Container[] = [];
  private visible_: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.container = scene.add.container(x, y);
    this.container.setVisible(false);

    const bg = scene.add.graphics();
    bg.fillStyle(0x0a0a1e, 0.92);
    bg.fillRoundedRect(0, 0, 260, 320, 8);
    bg.lineStyle(1, 0x44ff44, 0.5);
    bg.strokeRoundedRect(0, 0, 260, 320, 8);
    this.container.add(bg);

    const title = scene.add.text(130, 8, '🎒 Inventory', {
      fontSize: '13px', color: '#44ff44', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5, 0);
    this.container.add(title);

    const closeBtn = scene.add.text(240, 6, '✕', {
      fontSize: '14px', color: '#ff4444', fontFamily: 'Arial',
    }).setInteractive({ useHandCursor: true });
    closeBtn.on('pointerdown', () => this.hide());
    this.container.add(closeBtn);
  }

  refresh(inv: Inventory, onEquip?: (item: Equipment, index: number) => void): void {
    this.items.forEach(c => c.destroy());
    this.items = [];

    const list = inv.list();
    if (list.length === 0) {
      const txt = this.scene.add.text(130, 40, 'Empty inventory', {
        fontSize: '11px', color: '#888888', fontFamily: 'monospace',
      }).setOrigin(0.5, 0);
      const c = this.scene.add.container(0, 0, [txt]);
      this.container.add(c);
      this.items.push(c);
      return;
    }

    list.forEach((item, i) => {
      const y = 35 + i * 28;
      if (y > 310) return;

      const bg = this.scene.add.graphics();
      bg.fillStyle(0x222244, 0.6);
      bg.fillRoundedRect(5, y, 248, 24, 4);

      const tierColors: Record<string, string> = { normal: '#cccccc', magic: '#4488ff', rare: '#ffff00', set: '#00ff44', ancient: '#ff4444', mythic: '#cc44ff' };
      const color = tierColors[item.tier] || '#ffffff';
      const enchant = item.enhanceLevel > 0 ? `+${item.enhanceLevel} ` : '';

      const text = this.scene.add.text(12, y + 4, `${enchant}${item.name}`, {
        fontSize: '11px', color, fontFamily: 'monospace',
      });
      const slot = this.scene.add.text(200, y + 4, item.slot.slice(0, 4), {
        fontSize: '9px', color: '#888888', fontFamily: 'monospace',
      });

      const c = this.scene.add.container(0, 0, [bg, text, slot]);
      c.setSize(248, 24);
      c.setInteractive({ useHandCursor: true });
      c.on('pointerover', () => bg.clear().fillStyle(0x444466, 0.8).fillRoundedRect(5, y, 248, 24, 4));
      c.on('pointerout', () => bg.clear().fillStyle(0x222244, 0.6).fillRoundedRect(5, y, 248, 24, 4));
      c.on('pointerdown', () => onEquip?.(item, i));

      this.container.add(c);
      this.items.push(c);
    });
  }

  toggle(): void {
    this.visible_ = !this.visible_;
    this.container.setVisible(this.visible_);
  }

  show(): void { this.visible_ = true; this.container.setVisible(true); }
  hide(): void { this.visible_ = false; this.container.setVisible(false); }
  get isVisible(): boolean { return this.visible_; }
}
