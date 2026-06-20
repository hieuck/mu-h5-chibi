import Phaser from 'phaser';
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT } from '../phaserGame';
import { GameSession } from '../systems/gameSession';
import { MapDatabase, GameMap } from '../systems/maps';
import { FarmArea } from '../systems/autoFarm';
import { Monster } from '../entities/monster';
import { DropTable } from '../systems/loot';
import { ItemDatabase } from '../data/itemDatabase';
import { CharacterClass } from '../entities/character';
import { getCharacterRenderData, getMonsterRenderData, RenderData } from '../systems/visualRenderData';
import { StatsPanel } from '../ui/StatsPanel';

export class GameScene extends Phaser.Scene {
  private session!: GameSession;
  private logLines: string[] = [];
  private farmTimer: number = 0;
  private combatText!: Phaser.GameObjects.Text;

  // Team rendering
  private teamRenders: { data: RenderData; graphics: Phaser.GameObjects.Graphics }[] = [];
  // Monster rendering
  private monsterRenders: { data: RenderData; graphics: Phaser.GameObjects.Graphics; hpBar: Phaser.GameObjects.Graphics }[] = [];
  // Stats panel
  private statsPanel!: StatsPanel;

  constructor() {
    super({ key: SCENE_KEYS.GAME });
  }

  create(): void {
    // Background gradient
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x16213e, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Ground area
    const ground = this.add.graphics();
    ground.fillStyle(0x2a3a2a, 0.6);
    ground.fillRoundedRect(20, GAME_HEIGHT / 2 - 80, GAME_WIDTH - 40, 280, 16);

    // Grid lines on ground
    ground.lineStyle(1, 0x3a4a3a, 0.3);
    for (let x = 30; x < GAME_WIDTH - 30; x += 40) {
      ground.lineBetween(x, GAME_HEIGHT / 2 - 70, x, GAME_HEIGHT / 2 + 190);
    }
    for (let y = GAME_HEIGHT / 2 - 70; y < GAME_HEIGHT / 2 + 200; y += 40) {
      ground.lineBetween(30, y, GAME_WIDTH - 30, y);
    }

    // Title
    this.add.text(GAME_WIDTH / 2, 20, 'MU Chibi Squad', {
      fontSize: '22px', color: '#ffdd44', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Setup game session
    this.session = this.createGameSession();

    // Draw team
    this.drawTeam();

    // Draw monsters
    this.drawMonsters();

    // Combat log background
    const logBg = this.add.graphics();
    logBg.fillStyle(0x000000, 0.5);
    logBg.fillRoundedRect(15, GAME_HEIGHT - 175, GAME_WIDTH - 30, 160, 8);
    this.add.text(25, GAME_HEIGHT - 170, '⚔ Combat Log', {
      fontSize: '12px', color: '#ffdd44', fontFamily: 'Arial', fontStyle: 'bold',
    });

    this.combatText = this.add.text(25, GAME_HEIGHT - 150, '', {
      fontSize: '11px', color: '#ccffcc', fontFamily: 'monospace',
      wordWrap: { width: GAME_WIDTH - 50 },
    });

    // Stats panel
    const leader = this.session.getTeamMember(0);
    this.statsPanel = new StatsPanel(this, GAME_WIDTH - 210, 50);
    this.statsPanel.onAllocate((stat) => {
      try { leader.allocateStat(stat as any, 1); } catch { }
      this.refreshStats();
    });
    this.refreshStats();

    this.scene.launch(SCENE_KEYS.HUD);
  }

  private refreshStats(): void {
    const char = this.session.getTeamMember(0);
    this.statsPanel.updateStats(
      char.stats,
      char.totalAttackPower,
      char.totalDefense,
      char.level,
      char.resetCount,
      char.availableStatPoints,
    );
  }

  private createGameSession(): GameSession {
    const itemDb = new ItemDatabase();
    const goblin = new Monster({ name: 'Goblin', hp: 15, defense: 2, level: 1 });
    goblin.dropTable = new DropTable({ entries: [{ itemId: 'short_sword', chance: 0.3 }] });
    const area = new FarmArea({
      name: 'Training Field', monsters: [goblin, goblin], recommendedLevel: 1,
    });
    const db = new MapDatabase();
    db.register(new GameMap({ id: 'brave', name: 'Brave Grounds', requiredLevel: 1, areas: [area] }));
    const session = new GameSession(db, (id) => itemDb.resolveItem(id));
    session.addCharacter('DK', 'darkKnight');
    session.addCharacter('DW', 'darkWizard');
    return session;
  }

  private drawTeam(): void {
    const members = [
      { class: CharacterClass.DarkKnight, name: 'DK' },
      { class: CharacterClass.DarkWizard, name: 'DW' },
    ];
    members.forEach((m, i) => {
      const x = 180 + i * 200;
      const y = GAME_HEIGHT / 2 + 20;
      const char = this.session.getTeamMember(i);
      const data = getCharacterRenderData(char, x, y);

      const g = this.add.graphics();
      this.drawCharacter(g, data, i === 0);
      this.teamRenders.push({ data, graphics: g });

      // Label
      this.add.text(x, y + 32, `${m.name} Lv.${char.level}`, {
        fontSize: '11px', color: '#ffffff', fontFamily: 'Arial',
      }).setOrigin(0.5, 0);
    });
  }

  private drawCharacter(g: Phaser.GameObjects.Graphics, d: RenderData, isLeader: boolean): void {
    // Shadow
    g.fillStyle(0x000000, 0.3);
    g.fillEllipse(d.x + 2, d.y + d.height / 2 + 4, d.width - 8, 12);

    // Body (rounded rect for chibi feel)
    g.fillStyle(d.color, d.isAlive ? 1 : 0.3);
    g.fillRoundedRect(d.x - d.width / 2, d.y - d.height / 2, d.width, d.height, 8);

    // Head (circle on top)
    g.fillStyle(d.color, d.isAlive ? 1 : 0.3);
    g.fillCircle(d.x, d.y - d.height / 2 - 6, 14);

    // Eyes
    g.fillStyle(0xffffff, 1);
    g.fillCircle(d.x - 4, d.y - d.height / 2 - 7, 3);
    g.fillCircle(d.x + 4, d.y - d.height / 2 - 7, 3);
    g.fillStyle(0x000000, 1);
    g.fillCircle(d.x - 4, d.y - d.height / 2 - 7, 1.5);
    g.fillCircle(d.x + 4, d.y - d.height / 2 - 7, 1.5);

    // Leader crown
    if (isLeader) {
      g.fillStyle(0xffdd44, 1);
      g.fillTriangle(d.x - 6, d.y - d.height / 2 - 22, d.x + 6, d.y - d.height / 2 - 22, d.x, d.y - d.height / 2 - 28);
    }

    // Health bar background
    const barW = 44;
    const barH = 4;
    const barX = d.x - barW / 2;
    const barY = d.y + d.height / 2 + 6;
    g.fillStyle(0x333333, 1);
    g.fillRect(barX, barY, barW, barH);

    // Health bar fill
    const hpPct = d.maxHp > 0 ? d.hp / d.maxHp : 0;
    const hpColor = hpPct > 0.6 ? 0x44cc44 : hpPct > 0.3 ? 0xcccc44 : 0xcc4444;
    g.fillStyle(hpColor, 1);
    g.fillRect(barX + 1, barY + 1, (barW - 2) * hpPct, barH - 2);
  }

  private drawMonsters(): void {
    for (let i = 0; i < 2; i++) {
      const x = GAME_WIDTH - 140 + i * 60;
      const y = GAME_HEIGHT / 2 - 20;
      const data = getMonsterRenderData('Goblin', x, y);
      const g = this.add.graphics();
      const hpBar = this.add.graphics();

      this.drawMonster(g, hpBar, data);
      this.monsterRenders.push({ data, graphics: g, hpBar });

      this.add.text(x, y + 22, 'Goblin', {
        fontSize: '10px', color: '#ff8888', fontFamily: 'Arial',
      }).setOrigin(0.5, 0);
    }
  }

  private drawMonster(g: Phaser.GameObjects.Graphics, hpBar: Phaser.GameObjects.Graphics, d: RenderData): void {
    // Body
    g.fillStyle(d.color, 1);
    g.fillRoundedRect(d.x - d.width / 2, d.y - d.height / 2, d.width, d.height, 6);

    // Eyes (red for monsters)
    g.fillStyle(0xff0000, 1);
    g.fillCircle(d.x - 5, d.y - 4, 3);
    g.fillCircle(d.x + 5, d.y - 4, 3);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(d.x - 5, d.y - 4, 1.5);
    g.fillCircle(d.x + 5, d.y - 4, 1.5);

    // Health bar
    const barW = 30;
    const barH = 3;
    const barX = d.x - barW / 2;
    const barY = d.y + d.height / 2 + 4;
    hpBar.fillStyle(0x333333, 1);
    hpBar.fillRect(barX, barY, barW, barH);
    hpBar.fillStyle(0xcc4444, 1);
    hpBar.fillRect(barX + 1, barY + 1, barW - 2, barH - 2);
  }

  update(_time: number, delta: number): void {
    this.farmTimer += delta;
    if (this.farmTimer >= 2000) {
      this.farmTimer = 0;
      const result = this.session.farmTick();

      if (result.expGained > 0) {
        this.logCombat('⚔ Team defeated a monster! +50 EXP');
        this.flashTeam();
      }
      if (result.loot.length > 0) {
        this.logCombat(`📦 Loot: ${result.loot.join(', ')}`);
      }
      this.refreshTeamHP();
    }
  }

  private flashTeam(): void {
    this.teamRenders.forEach((r, i) => {
      this.tweens.add({
        targets: r.graphics,
        alpha: { from: 1, to: 0.5 },
        duration: 100,
        yoyo: true,
        repeat: 1,
      });
    });
  }

  private refreshTeamHP(): void {
    this.teamRenders.forEach((r, i) => {
      const char = this.session.getTeamMember(i);
      r.data.hp = char.hp;
      r.data.level = char.level;
      r.graphics.clear();
      this.drawCharacter(r.graphics, r.data, i === 0);
    });
    this.refreshStats();
  }

  private logCombat(msg: string): void {
    this.logLines.push(msg);
    if (this.logLines.length > 8) this.logLines.shift();
    this.combatText.setText(this.logLines.join('\n'));
  }
}
