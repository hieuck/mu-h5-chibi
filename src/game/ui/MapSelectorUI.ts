import Phaser from 'phaser';

export interface MapOption {
  id: string;
  name: string;
  level: number;
  unlocked: boolean;
}

export class MapSelectorUI {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private buttons: Phaser.GameObjects.Text[] = [];
  private currentLabel!: Phaser.GameObjects.Text;
  private onSwitch: (mapId: string) => void = () => {};

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.container = scene.add.container(x, y);

    const bg = scene.add.graphics();
    bg.fillStyle(0x0a0a1e, 0.85);
    bg.fillRoundedRect(0, 0, 180, 130, 8);
    bg.lineStyle(1, 0x44aaff, 0.5);
    bg.strokeRoundedRect(0, 0, 180, 130, 8);
    this.container.add(bg);

    const title = scene.add.text(90, 8, '🗺 Maps', {
      fontSize: '12px', color: '#44aaff', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5, 0);
    this.container.add(title);

    this.currentLabel = scene.add.text(90, 25, 'Current: --', {
      fontSize: '10px', color: '#88ddff', fontFamily: 'monospace',
    }).setOrigin(0.5, 0);
    this.container.add(this.currentLabel);
  }

  updateMaps(maps: MapOption[], currentId: string): void {
    this.buttons.forEach(b => b.destroy());
    this.buttons = [];
    this.currentLabel.setText(`Current: ${maps.find(m => m.id === currentId)?.name || '--'}`);

    maps.forEach((m, i) => {
      const y = 42 + i * 22;
      const color = m.unlocked ? (m.id === currentId ? '#44ff44' : '#ffffff') : '#555555';
      const prefix = m.id === currentId ? '▶ ' : (m.unlocked ? '' : '🔒 ');
      const txt = this.scene.add.text(10, y, `${prefix}${m.name} (Lv.${m.level})`, {
        fontSize: '10px', color, fontFamily: 'monospace',
      });

      if (m.unlocked && m.id !== currentId) {
        txt.setInteractive({ useHandCursor: true });
        txt.on('pointerover', () => txt.setColor('#ffff44'));
        txt.on('pointerout', () => txt.setColor('#ffffff'));
        txt.on('pointerdown', () => this.onSwitch(m.id));
      }

      this.container.add(txt);
      this.buttons.push(txt);
    });
  }

  onMapSwitch(callback: (mapId: string) => void): void {
    this.onSwitch = callback;
  }

  setVisible(v: boolean): void {
    this.container.setVisible(v);
  }
}
