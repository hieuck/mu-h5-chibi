import Phaser from 'phaser';
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT } from '../phaserGame';
import { GameSession } from '../systems/gameSession';
import { MapDatabase, GameMap } from '../systems/maps';
import { FarmArea } from '../systems/autoFarm';
import { Monster } from '../entities/monster';
import { DropTable } from '../systems/loot';
import { ItemDatabase } from '../data/itemDatabase';
import { ClassSkillDatabase } from '../data/classSkills';
import { getHealthBarColor } from '../systems/healthBar';
import { MAP_BG_COLORS } from '../data/mapBackgrounds';
import { StatsPanel } from '../ui/StatsPanel';
import { InventoryUI } from '../ui/InventoryUI';
import { FloatingDamage } from '../systems/floatingDamage';

const ALL_CLASSES = [
  { key: 'character_dk', name: 'DK', classType: 'darkKnight', color: 0xcc4444 },
  { key: 'character_dw', name: 'DW', classType: 'darkWizard', color: 0x4444cc },
  { key: 'character_elf', name: 'Elf', classType: 'elf', color: 0x44cc44 },
  { key: 'character_sum', name: 'Sum', classType: 'summoner', color: 0xcc44cc },
  { key: 'character_mg', name: 'MG', classType: 'magicGladiator', color: 0xcc8844 },
];

const MAPS = [
  { id: 'brave', name: 'Brave Grounds', level: 1 },
  { id: 'skeleton_dungeon', name: 'Skeleton Dungeon', level: 5 },
  { id: 'giant_peak', name: "Giant's Peak", level: 10 },
  { id: 'dragon_valley', name: 'Dragon Valley', level: 20 },
  { id: 'abyss', name: 'Abyss', level: 30 },
];

export class GameScene extends Phaser.Scene {
  private session!: GameSession;
  private classSkills!: ClassSkillDatabase;
  private itemDb!: ItemDatabase;
  private logLines: string[] = [];
  private farmTimer: number = 0;
  private currentMapIdx: number = 0;

  private bgGraphics!: Phaser.GameObjects.Graphics;
  private combatText!: Phaser.GameObjects.Text;
  private goldText!: Phaser.GameObjects.Text;
  private mapText!: Phaser.GameObjects.Text;
  private statsPanel!: StatsPanel;
  private inventoryUI!: InventoryUI;
  private floatingDamage!: FloatingDamage;
  private charCircles: { g: Phaser.GameObjects.Graphics; hpBar: Phaser.GameObjects.Graphics }[] = [];
  private monsterCircles: Phaser.GameObjects.Graphics[] = [];

  constructor() {
    super({ key: SCENE_KEYS.GAME });
  }

  create(): void {
    this.itemDb = new ItemDatabase();
    this.classSkills = new ClassSkillDatabase();
    this.session = this.createFullSession();
    this.currentMapIdx = 0;
    this.logLines = [];
    this.farmTimer = 0;

    this.drawBackground();
    this.drawTitle();
    this.drawGold();
    this.drawTeam();
    this.drawMonsters();
    this.drawMapUI();
    this.drawControls();
    this.drawCombatLog();
    this.initPanels();

    this.floatingDamage = new FloatingDamage(this);
    this.refreshAll();
    this.scene.launch(SCENE_KEYS.HUD);
  }

  private createFullSession(): GameSession {
    const db = this.buildMapDb();
    const s = new GameSession(db, (id) => this.itemDb.resolveItem(id));
    ALL_CLASSES.forEach(c => s.addCharacter(c.name, c.classType));
    return s;
  }

  private buildMapDb(): MapDatabase {
    const db = new MapDatabase();
    MAPS.forEach((m, i) => {
      const lvl = m.level;
      const area = new FarmArea({
        name: `${m.name} Area`,
        monsters: [
          Object.assign(new Monster({ name: `${m.name} Mob`, hp: 10 * lvl, defense: lvl, level: lvl }), {
            dropTable: new DropTable({ entries: [{ itemId: 'short_sword', chance: 0.2 }, { itemId: 'pad_helm', chance: 0.1 }] }),
          }),
          Object.assign(new Monster({ name: `${m.name} Elite`, hp: 20 * lvl, defense: lvl * 2, level: lvl + 2 }), {
            dropTable: new DropTable({ entries: [{ itemId: 'rapier', chance: 0.15 }, { itemId: 'small_shield', chance: 0.1 }] }),
          }),
        ],
        recommendedLevel: lvl,
      });
      db.register(new GameMap({ id: m.id, name: m.name, requiredLevel: Math.max(1, lvl - 2), areas: [area] }));
    });
    return db;
  }

  private drawBackground(): void {
    this.bgGraphics = this.add.graphics();
    this.updateBackground();
  }

  private updateBackground(): void {
    this.bgGraphics.clear();
    const colors = MAP_BG_COLORS[MAPS[this.currentMapIdx]?.id] || { top: 0x1a1a2e, bottom: 0x0a0a1e };
    this.bgGraphics.fillGradientStyle(colors.top, colors.top, colors.bottom, colors.bottom, 1);
    this.bgGraphics.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Platform
    this.bgGraphics.fillStyle(0x000000, 0.3);
    this.bgGraphics.fillRoundedRect(5, GAME_HEIGHT / 2 - 130, GAME_WIDTH - 10, 330, 16);
    this.bgGraphics.lineStyle(1, 0xffffff, 0.1);
    this.bgGraphics.strokeRoundedRect(5, GAME_HEIGHT / 2 - 130, GAME_WIDTH - 10, 330, 16);
  }

  private drawTitle(): void {
    this.add.text(GAME_WIDTH / 2, 12, 'MU Chibi Squad', {
      fontSize: '16px', color: '#ffdd44', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);
  }

  private drawGold(): void {
    this.goldText = this.add.text(GAME_WIDTH - 15, 12, '💰 0', {
      fontSize: '13px', color: '#ffdd44', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(1, 0);
    this.mapText = this.add.text(15, 12, MAPS[0].name, {
      fontSize: '12px', color: '#88ddff', fontFamily: 'Arial',
    });
  }

  private drawTeam(): void {
    this.charCircles.forEach(c => { c.g.destroy(); c.hpBar.destroy(); });
    this.charCircles = [];

    ALL_CLASSES.forEach((cfg, i) => {
      const x = 80 + i * 130;
      const y = GAME_HEIGHT / 2 + 30;
      const g = this.add.graphics();
      g.fillStyle(cfg.color, 1);
      g.fillRoundedRect(x - 22, y - 22, 44, 44, 6);
      g.fillStyle(0xffffff, 0.9);
      // Face
      g.fillCircle(x - 6, y - 6, 4);
      g.fillCircle(x + 6, y - 6, 4);
      g.fillStyle(0x000000, 1);
      g.fillCircle(x - 6, y - 6, 2);
      g.fillCircle(x + 6, y - 6, 2);

      const hpBar = this.add.graphics();
      this.charCircles.push({ g, hpBar });

      this.add.text(x, y + 28, `${cfg.name} Lv.1`, {
        fontSize: '9px', color: '#ffffff', fontFamily: 'Arial',
      }).setOrigin(0.5, 0);
    });
  }

  private drawMonsters(): void {
    this.monsterCircles.forEach(g => g.destroy());
    this.monsterCircles = [];

    for (let i = 0; i < 2; i++) {
      const x = GAME_WIDTH - 60 + i * 40;
      const y = GAME_HEIGHT / 2 - 60;
      const g = this.add.graphics();
      g.fillStyle(0x66aa44, 1);
      g.fillCircle(x, y, 16);
      g.fillStyle(0xff0000, 1);
      g.fillCircle(x - 5, y - 3, 3);
      g.fillCircle(x + 5, y - 3, 3);
      g.fillStyle(0xffffff, 1);
      g.fillCircle(x - 5, y - 3, 1.5);
      g.fillCircle(x + 5, y - 3, 1.5);
      this.monsterCircles.push(g);
    }
  }

  private drawMapUI(): void {
    this.add.text(10, 35, '◄', { fontSize: '14px', color: '#88ddff', fontFamily: 'Arial' })
      .setInteractive({ useHandCursor: true }).on('pointerdown', () => this.switchMap(-1));
    this.add.text(70, 35, '►', { fontSize: '14px', color: '#88ddff', fontFamily: 'Arial' })
      .setInteractive({ useHandCursor: true }).on('pointerdown', () => this.switchMap(1));
  }

  private drawControls(): void {
    const controls = [
      { key: 'I', label: 'Inventory', x: GAME_WIDTH / 2 - 80 },
      { key: 'R', label: 'Reset', x: GAME_WIDTH / 2 },
      { key: 'S', label: 'Auto-Sell', x: GAME_WIDTH / 2 + 80 },
    ];
    controls.forEach(c => {
      this.add.text(c.x, GAME_HEIGHT - 190, `[${c.key}] ${c.label}`, {
        fontSize: '9px', color: '#888888', fontFamily: 'monospace',
      }).setOrigin(0.5, 0);
    });
  }

  private drawCombatLog(): void {
    const logBg = this.add.graphics();
    logBg.fillStyle(0x000000, 0.5);
    logBg.fillRoundedRect(10, GAME_HEIGHT - 175, GAME_WIDTH - 20, 155, 8);
    this.add.text(18, GAME_HEIGHT - 170, '⚔ Combat', {
      fontSize: '11px', color: '#ffdd44', fontFamily: 'Arial', fontStyle: 'bold',
    });
    this.combatText = this.add.text(18, GAME_HEIGHT - 155, '', {
      fontSize: '10px', color: '#ccffcc', fontFamily: 'monospace',
      wordWrap: { width: GAME_WIDTH - 36 },
    });
  }

  private initPanels(): void {
    const leader = this.session.getTeamMember(0);
    this.statsPanel = new StatsPanel(this, GAME_WIDTH - 210, 43);
    this.statsPanel.onAllocate((stat) => {
      ALL_CLASSES.forEach((_, i) => {
        try { this.session.getTeamMember(i).allocateStat(stat as any, 1); } catch { }
      });
      this.refreshAll();
    });

    this.inventoryUI = new InventoryUI(this, GAME_WIDTH / 2 - 130, GAME_HEIGHT / 2 - 160);
    this.input.keyboard!.on('keydown-I', () => {
      this.inventoryUI.toggle();
      if (this.inventoryUI.isVisible) {
        this.inventoryUI.refresh(this.session.getInventory(), (item, index) => {
          const char = this.session.getTeamMember(0);
          try {
            const old = char.equip(item);
            this.session.getInventory().remove(index);
            this.log(`Equipped ${item.name}`);
            if (old) this.session.getInventory().add(old);
          } catch (e: any) { this.log(`⚠ ${e.message}`); }
          this.inventoryUI.refresh(this.session.getInventory());
          this.refreshAll();
        });
      }
    });
    this.input.keyboard!.on('keydown-R', () => {
      const char = this.session.getTeamMember(0);
      try { char.reset(); this.log(`🔄 Reset! Now Lv.1 (Reset #${char.resetCount})`); } catch (e: any) { this.log(`⚠ ${e.message}`); }
      this.refreshAll();
    });
    this.input.keyboard!.on('keydown-S', () => {
      const items = this.session.getInventory().list();
      const toSell = items.filter(i => i.tier === 'normal' || i.tier === 'magic');
      toSell.forEach(item => {
        const idx = this.session.getInventory().list().indexOf(item);
        if (idx >= 0) {
          this.session.getInventory().removeAt(idx);
          this.session.getTeamMember(0).gold += Math.floor(item.value / 2);
        }
      });
      if (toSell.length > 0) this.log(`💰 Auto-sold ${toSell.length} items`);
      this.refreshAll();
    });
  }

  private switchMap(dir: number): void {
    this.currentMapIdx = (this.currentMapIdx + dir + MAPS.length) % MAPS.length;
    this.updateBackground();
    this.drawMonsters();
    this.mapText.setText(MAPS[this.currentMapIdx].name);
    this.log(`📍 ${MAPS[this.currentMapIdx].name}`);
    this.refreshAll();
  }

  update(_time: number, delta: number): void {
    this.floatingDamage.update(delta);
    this.farmTimer += delta;
    if (this.farmTimer >= 2000) {
      this.farmTimer = 0;
      const result = this.session.farmTick(this.classSkills);
      if (result.expGained > 0) {
        this.log(`⚔ Victory! +${result.expGained} EXP`);
        this.floatingDamage.show(GAME_WIDTH / 2, 100, result.expGained, true);
        this.flashChars();
      }
      if (result.loot.length > 0) {
        this.log(`📦 ${result.loot.join(', ')}`);
        this.floatingDamage.showDrop(GAME_WIDTH / 2, 130, result.loot[0], 'rare');
      }
      this.floatingDamage.showGold(GAME_WIDTH / 2, 70, 10);
      this.refreshAll();
    }
  }

  private flashChars(): void {
    this.charCircles.forEach(c => {
      this.tweens.add({ targets: c.g, alpha: 0.4, duration: 80, yoyo: true, repeat: 1 });
    });
  }

  private refreshAll(): void {
    const leader = this.session.getTeamMember(0);
    this.statsPanel.updateStats(leader.stats, leader.totalAttackPower, leader.totalDefense,
      leader.level, leader.resetCount, leader.availableStatPoints);
    this.goldText.setText(`💰 ${leader.gold}`);

    this.charCircles.forEach((c, i) => {
      if (i < this.session.teamSize) {
        const m = this.session.getTeamMember(i);
        const x = 80 + i * 130;
        const y = GAME_HEIGHT / 2 + 58;
        const pct = m.hp / m.maxHp;
        c.hpBar.clear();
        c.hpBar.fillStyle(0x333333, 0.8);
        c.hpBar.fillRect(x - 20, y, 40, 4);
        c.hpBar.fillStyle(Phaser.Display.Color.HexStringToColor(getHealthBarColor(m.hp, m.maxHp)).color, 1);
        c.hpBar.fillRect(x - 19, y + 1, 38 * pct, 2);
      }
    });
  }

  private log(msg: string): void {
    this.logLines.push(msg);
    if (this.logLines.length > 8) this.logLines.shift();
    this.combatText.setText(this.logLines.join('\n'));
  }
}
