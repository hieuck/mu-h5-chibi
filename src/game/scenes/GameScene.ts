import Phaser from 'phaser';
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT } from '../phaserGame';
import { GameSession } from '../systems/gameSession';
import { MapDatabase, GameMap } from '../systems/maps';
import { FarmArea } from '../systems/autoFarm';
import { Monster } from '../entities/monster';
import { DropTable } from '../systems/loot';
import { ItemDatabase } from '../data/itemDatabase';
import { formatTeamStatus, formatCombatLog } from '../systems/gameRenderer';
import { getClassColor, getClassSymbol } from '../systems/spriteRenderer';
import { CharacterClass } from '../entities/character';
import { getHealthBarColor } from '../systems/healthBar';

export class GameScene extends Phaser.Scene {
  private session!: GameSession;
  private itemDb!: ItemDatabase;
  private statusText!: Phaser.GameObjects.Text;
  private combatText!: Phaser.GameObjects.Text;
  private logLines: string[] = [];
  private farmTimer: number = 0;
  private characterSprites: Phaser.GameObjects.Sprite[] = [];
  private monsterSprites: Phaser.GameObjects.Sprite[] = [];

  constructor() {
    super({ key: SCENE_KEYS.GAME });
  }

  create(): void {
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'bg_brave_grounds').setDisplaySize(GAME_WIDTH, GAME_HEIGHT);

    this.itemDb = new ItemDatabase();

    const goblin = new Monster({ name: 'Goblin', hp: 15, defense: 2, level: 1 });
    goblin.dropTable = new DropTable({ entries: [{ itemId: 'short_sword', chance: 0.3 }, { itemId: 'pad_helm', chance: 0.2 }] });

    const area = new FarmArea({
      name: 'Training Field', monsters: [goblin, goblin], recommendedLevel: 1,
    });
    const db = new MapDatabase();
    db.register(new GameMap({ id: 'brave', name: 'Brave Grounds', requiredLevel: 1, areas: [area] }));

    this.session = new GameSession(db, (id) => this.itemDb.resolveItem(id));
    this.session.addCharacter('DK', 'darkKnight');
    this.session.addCharacter('DW', 'darkWizard');

    // ── Render team sprites ──
    const teams = ['character_dk', 'character_dw'];
    teams.forEach((key, i) => {
      const sprite = this.add.sprite(100 + i * 120, GAME_HEIGHT / 2 + 40, key);
      sprite.setScale(2);
      this.characterSprites.push(sprite);
      if (this.anims.exists(`${key}_idle`)) {
        sprite.play(`${key}_idle`);
      }
    });

    // ── Render monster sprites ──
    this.monsterSprites = [];
    for (let i = 0; i < 2; i++) {
      const sprite = this.add.sprite(GAME_WIDTH - 120 + i * 40, GAME_HEIGHT / 2 - 30, 'monster_goblin');
      sprite.setScale(1.5);
      this.monsterSprites.push(sprite);
      if (this.anims.exists('monster_goblin_idle')) {
        sprite.play('monster_goblin_idle');
      }
    }

    // ── UI text ──
    this.statusText = this.add.text(15, GAME_HEIGHT - 120, '', {
      fontSize: '12px', color: '#ffffff', fontFamily: 'monospace',
    });

    this.combatText = this.add.text(15, GAME_HEIGHT - 80, '', {
      fontSize: '11px', color: '#ccffcc', fontFamily: 'monospace',
      wordWrap: { width: GAME_WIDTH - 30 },
    });

    this.scene.launch(SCENE_KEYS.HUD);
    this.updateDisplay();
  }

  update(_time: number, delta: number): void {
    this.farmTimer += delta;
    if (this.farmTimer >= 2000) {
      this.farmTimer = 0;
      const result = this.session.farmTick();

      if (result.expGained > 0) {
        this.logCombat('Team defeated a monster! +EXP');
        this.flashSprites(this.characterSprites);
      }
      if (result.loot.length > 0) {
        this.logCombat(`Loot: ${result.loot.join(', ')}`);
      }
      this.updateDisplay();
    }
  }

  private flashSprites(sprites: Phaser.GameObjects.Sprite[]): void {
    sprites.forEach(s => {
      this.tweens.add({ targets: s, scaleX: 2.3, scaleY: 2.3, duration: 100, yoyo: true });
    });
  }

  private logCombat(msg: string): void {
    this.logLines.push(msg);
    if (this.logLines.length > 6) this.logLines.shift();
    this.combatText.setText(this.logLines.join('\n'));
  }

  private updateDisplay(): void {
    if (this.session.teamSize > 0) {
      this.statusText.setText(formatTeamStatus(this.session.getTeam()));
    }
  }
}
