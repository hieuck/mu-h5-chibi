import Phaser from 'phaser';
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT } from '../phaserGame';
import { GameSession } from '../systems/gameSession';
import { MapDatabase, GameMap } from '../systems/maps';
import { FarmArea } from '../systems/autoFarm';
import { Monster } from '../entities/monster';
import { DropTable } from '../systems/loot';
import { ItemDatabase } from '../data/itemDatabase';
import { formatTeamStatus, formatCombatLog, formatCharacterStats } from '../systems/gameRenderer';

export class GameScene extends Phaser.Scene {
  private session!: GameSession;
  private itemDb!: ItemDatabase;
  private statusText!: Phaser.GameObjects.Text;
  private combatText!: Phaser.GameObjects.Text;
  private statsText!: Phaser.GameObjects.Text;
  private logLines: string[] = [];
  private farmTimer: number = 0;

  constructor() {
    super({ key: SCENE_KEYS.GAME });
  }

  create(): void {
    this.itemDb = new ItemDatabase();

    const goblin = new Monster({ name: 'Goblin', hp: 15, defense: 2, level: 1 });
    goblin.dropTable = new DropTable({ entries: [{ itemId: 'short_sword', chance: 0.3 }, { itemId: 'pad_helm', chance: 0.2 }] });

    const area = new FarmArea({
      name: 'Training Field',
      monsters: [goblin, goblin],
      recommendedLevel: 1,
    });

    const db = new MapDatabase();
    db.register(new GameMap({ id: 'brave', name: 'Brave Grounds', requiredLevel: 1, areas: [area] }));

    this.session = new GameSession(db, (id) => this.itemDb.resolveItem(id));
    this.session.addCharacter('DK', 'darkKnight');
    this.session.addCharacter('DW', 'darkWizard');

    this.add.text(GAME_WIDTH / 2, 15, 'MU Chibi Squad', {
      fontSize: '20px', color: '#ffdd44', fontFamily: 'Arial',
    }).setOrigin(0.5);

    this.statusText = this.add.text(15, 45, '', {
      fontSize: '13px', color: '#ffffff', fontFamily: 'monospace',
    });

    this.statsText = this.add.text(15, 85, '', {
      fontSize: '11px', color: '#aaaaff', fontFamily: 'monospace',
    });

    this.add.text(15, GAME_HEIGHT - 180, '─ Combat Log ─', {
      fontSize: '12px', color: '#ffdd44', fontFamily: 'monospace',
    });

    this.combatText = this.add.text(15, GAME_HEIGHT - 160, '', {
      fontSize: '11px', color: '#ccffcc', fontFamily: 'monospace',
      wordWrap: { width: GAME_WIDTH - 30 },
    });

    this.scene.launch(SCENE_KEYS.HUD);
  }

  update(_time: number, delta: number): void {
    this.farmTimer += delta;

    if (this.farmTimer >= 2000) {
      this.farmTimer = 0;

      const result = this.session.farmTick();
      const member = this.session.teamSize > 0 ? this.session.getTeamMember(0) : undefined;

      if (result.expGained > 0) {
        this.logCombat('Team defeated a monster! +EXP');
      }

      if (result.loot.length > 0) {
        this.logCombat(`Loot: ${result.loot.join(', ')}`);
      }

      this.updateDisplay();
    }
  }

  private logCombat(msg: string): void {
    this.logLines.push(msg);
    if (this.logLines.length > 8) this.logLines.shift();
    this.combatText.setText(this.logLines.join('\n'));
  }

  private updateDisplay(): void {
    if (this.session.teamSize > 0) {
      const member = this.session.getTeamMember(0);
      this.statusText.setText(formatTeamStatus(this.session.getTeam()));
      this.statsText.setText(formatCharacterStats(member));
    }
  }
}
