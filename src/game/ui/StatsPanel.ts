import Phaser from 'phaser';

export interface StatButton {
  stat: string;
  label: string;
  value: number;
  bonus: number;
  x: number;
  y: number;
}

export class StatsPanel {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private statTexts: Map<string, Phaser.GameObjects.Text> = new Map();
  private plusButtons: Phaser.GameObjects.Text[] = [];
  private pointsText!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.container = scene.add.container(x, y);

    // Background
    const bg = scene.add.graphics();
    bg.fillStyle(0x0a0a1e, 0.85);
    bg.fillRoundedRect(0, 0, 200, 180, 8);
    bg.lineStyle(1, 0xffdd44, 0.5);
    bg.strokeRoundedRect(0, 0, 200, 180, 8);
    this.container.add(bg);

    // Title
    const title = scene.add.text(100, 8, 'Character Stats', {
      fontSize: '12px', color: '#ffdd44', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5, 0);
    this.container.add(title);

    // Available points display
    this.pointsText = scene.add.text(100, 25, 'Points: 0', {
      fontSize: '10px', color: '#88ff88', fontFamily: 'monospace',
    }).setOrigin(0.5, 0);
    this.container.add(this.pointsText);

    // Stat rows
    const stats = [
      { stat: 'strength', label: 'STR', y: 45 },
      { stat: 'agility', label: 'AGI', y: 65 },
      { stat: 'stamina', label: 'STA', y: 85 },
      { stat: 'energy', label: 'ENE', y: 105 },
    ];

    stats.forEach(({ stat, label, y: sy }) => {
      const txt = scene.add.text(15, sy, `${label}: 0`, {
        fontSize: '11px', color: '#ffffff', fontFamily: 'monospace',
      });
      this.container.add(txt);
      this.statTexts.set(stat, txt);

      const plus = scene.add.text(175, sy, '[+]', {
        fontSize: '11px', color: '#44ff44', fontFamily: 'monospace',
      }).setInteractive({ useHandCursor: true });
      plus.on('pointerover', () => plus.setColor('#ffff44'));
      plus.on('pointerout', () => plus.setColor('#44ff44'));
      this.container.add(plus);
      this.plusButtons.push(plus);
    });

    // ATK/DEF display
    this.statTexts.set('atk', scene.add.text(15, 128, 'ATK: 0', {
      fontSize: '11px', color: '#aaaaff', fontFamily: 'monospace',
    }));
    this.statTexts.set('def', scene.add.text(100, 128, 'DEF: 0', {
      fontSize: '11px', color: '#aaaaff', fontFamily: 'monospace',
    }));
    this.container.add(this.statTexts.get('atk')!);
    this.container.add(this.statTexts.get('def')!);

    // Level/Reset display
    this.statTexts.set('level', scene.add.text(15, 148, 'Lv.1 | Reset: 0', {
      fontSize: '10px', color: '#ffaa44', fontFamily: 'monospace',
    }));
    this.container.add(this.statTexts.get('level')!);
  }

  updateStats(stats: { strength: number; agility: number; stamina: number; energy: number },
              atk: number, def: number, level: number, resetCount: number, availablePoints: number): void {
    this.statTexts.get('strength')!.setText(`STR: ${stats.strength}`);
    this.statTexts.get('agility')!.setText(`AGI: ${stats.agility}`);
    this.statTexts.get('stamina')!.setText(`STA: ${stats.stamina}`);
    this.statTexts.get('energy')!.setText(`ENE: ${stats.energy}`);
    this.statTexts.get('atk')!.setText(`ATK: ${atk}`);
    this.statTexts.get('def')!.setText(`DEF: ${def}`);
    this.statTexts.get('level')!.setText(`Lv.${level} | Reset: ${resetCount}`);
    this.pointsText.setText(`Points: ${availablePoints}`);

    // Enable/disable plus buttons
    this.plusButtons.forEach(b => b.setAlpha(availablePoints > 0 ? 1 : 0.3));
  }

  onAllocate(callback: (stat: string) => void): void {
    const stats = ['strength', 'agility', 'stamina', 'energy'];
    this.plusButtons.forEach((btn, i) => {
      btn.removeAllListeners('pointerdown');
      btn.on('pointerdown', () => callback(stats[i]));
    });
  }

  setVisible(visible: boolean): void {
    this.container.setVisible(visible);
  }
}
