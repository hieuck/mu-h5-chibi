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
import { StatsPanel } from '../ui/StatsPanel';
import { MapSelectorUI } from '../ui/MapSelectorUI';
import { InventoryUI } from '../ui/InventoryUI';

const TEAM_CONFIG = [
  { sprite: 'character_dk', name: 'DK' },
  { sprite: 'character_dw', name: 'DW' },
  { sprite: 'character_elf', name: 'Elf' },
];

const WING_SPRITES: Record<string, string> = {
  DK: 'character_dk',
  DW: 'character_dw',
  Elf: 'character_elf',
};

export class GameScene extends Phaser.Scene {
  private session!: GameSession;
  private classSkills!: ClassSkillDatabase;
  private logLines: string[] = [];
  private farmTimer: number = 0;
  private combatText!: Phaser.GameObjects.Text;
  private statsPanel!: StatsPanel;
  private mapSelector!: MapSelectorUI;
  private inventoryUI!: InventoryUI;
  private goldText!: Phaser.GameObjects.Text;
  private teamSprites: { img: Phaser.GameObjects.Image; hpBar: Phaser.GameObjects.Graphics; name: string }[] = [];
  private monsterImages: Phaser.GameObjects.Image[] = [];
  private bgImage?: Phaser.GameObjects.Image;

  constructor() {
    super({ key: SCENE_KEYS.GAME });
  }

  create(): void {
    // Background
    const bgKey = 'bg_brave_grounds';
    if (this.textures.exists(bgKey)) {
      this.bgImage = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, bgKey);
      this.bgImage.setDisplaySize(GAME_WIDTH, GAME_HEIGHT);
    } else {
      const bg = this.add.graphics();
      bg.fillGradientStyle(0x0a0a1e, 0x0a0a1e, 0x16213e, 0x16213e, 1);
      bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }

    // Ground platform
    const ground = this.add.graphics();
    ground.fillStyle(0x000000, 0.35);
    ground.fillRoundedRect(10, GAME_HEIGHT / 2 - 120, GAME_WIDTH - 20, 320, 16);
    ground.lineStyle(1, 0xffdd44, 0.1);
    ground.strokeRoundedRect(10, GAME_HEIGHT / 2 - 120, GAME_WIDTH - 20, 320, 16);

    // Gold
    this.goldText = this.add.text(GAME_WIDTH - 15, 15, '💰 0', {
      fontSize: '15px', color: '#ffdd44', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(1, 0);

    // Title
    this.add.text(GAME_WIDTH / 2, 15, 'MU Chibi Squad', {
      fontSize: '18px', color: '#ffdd44', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Session
    this.classSkills = new ClassSkillDatabase();
    this.session = this.createSession();

    // Character sprites
    this.drawTeam();

    // Monster sprites
    this.drawMonsters();

    // Stats panel
    this.statsPanel = new StatsPanel(this, GAME_WIDTH - 210, 43);
    this.statsPanel.onAllocate((stat) => {
      try { this.session.getTeamMember(1).allocateStat(stat as any, 1); } catch {}
      this.refreshAll();
    });

    // Map selector
    this.mapSelector = new MapSelectorUI(this, 10, 40);
    this.mapSelector.onMapSwitch(() => {});
    this.mapSelector.updateMaps([
      { id: 'brave', name: '🌿 Brave', level: 1, unlocked: true },
      { id: 'skeleton_dungeon', name: '💀 Skeleton', level: 5, unlocked: true },
      { id: 'giant_peak', name: '⛰️ Giant', level: 10, unlocked: true },
      { id: 'dragon_valley', name: '🐉 Dragon', level: 20, unlocked: true },
      { id: 'abyss', name: '🌌 Abyss', level: 30, unlocked: true },
    ], 'brave');

    // Inventory
    this.inventoryUI = new InventoryUI(this, GAME_WIDTH / 2 - 130, GAME_HEIGHT / 2 - 160);
    this.input.keyboard!.on('keydown-I', () => {
      this.inventoryUI.toggle();
      if (this.inventoryUI.isVisible) {
        this.inventoryUI.refresh(this.session.getInventory(), (item, index) => {
          const char = this.session.getTeamMember(1);
          try {
            const old = char.equip(item);
            this.session.getInventory().remove(index);
            this.log(`🔄 Equipped ${item.name}`);
            if (old) this.session.getInventory().add(old);
          } catch (e: any) {
            this.log(`⚠️ ${e.message}`);
          }
          this.inventoryUI.refresh(this.session.getInventory());
          this.refreshAll();
        });
      }
    });

    // Combat log
    const logBg = this.add.graphics();
    logBg.fillStyle(0x000000, 0.55);
    logBg.fillRoundedRect(15, GAME_HEIGHT - 175, GAME_WIDTH - 30, 160, 8);
    this.add.text(25, GAME_HEIGHT - 168, '⚔ Combat', {
      fontSize: '11px', color: '#ffdd44', fontFamily: 'Arial', fontStyle: 'bold',
    });
    this.combatText = this.add.text(25, GAME_HEIGHT - 150, '', {
      fontSize: '10px', color: '#ccffcc', fontFamily: 'monospace',
      wordWrap: { width: GAME_WIDTH - 50 },
    });

    this.refreshAll();
    this.scene.launch(SCENE_KEYS.HUD);
  }

  private createSession(): GameSession {
    const itemDb = new ItemDatabase();
    const g = new Monster({ name: 'Goblin', hp: 15, defense: 2, level: 1 });
    g.dropTable = new DropTable({ entries: [{ itemId: 'short_sword', chance: 0.3 }] });
    const area = new FarmArea({ name: 'Field', monsters: [g, g], recommendedLevel: 1 });
    const db = new MapDatabase();
    db.register(new GameMap({ id: 'brave', name: 'Brave Grounds', requiredLevel: 1, areas: [area] }));
    const s = new GameSession(db, (id) => itemDb.resolveItem(id));
    s.addCharacter('DK', 'darkKnight');
    s.addCharacter('DW', 'darkWizard');
    s.addCharacter('Elf', 'elf');
    return s;
  }

  private drawTeam(): void {
    TEAM_CONFIG.forEach((cfg, i) => {
      const x = 120 + i * 140;
      const y = GAME_HEIGHT / 2 + 30;
      const exists = this.textures.exists(cfg.sprite);

      if (exists) {
        const img = this.add.image(x, y, cfg.sprite);
        img.setScale(3.5);
        img.setOrigin(0.5, 0.5);
        const hpBar = this.add.graphics();
        this.teamSprites.push({ img, hpBar, name: cfg.name });
      } else {
        // Fallback: colored circle
        const g = this.add.graphics();
        g.fillStyle(0xcc4444, 1);
        g.fillCircle(x, y, 20);
        const hpBar = this.add.graphics();
        this.teamSprites.push({ img: null as any, hpBar, name: cfg.name });
      }

      // Label
      const lvl = 1;
      this.add.text(x, y + 32, `${cfg.name} Lv.${lvl}`, {
        fontSize: '10px', color: '#ffffff', fontFamily: 'Arial',
      }).setOrigin(0.5, 0);

      if (i === 0) {
        this.add.text(x, y - 32, '👑', { fontSize: '16px' }).setOrigin(0.5);
      }
    });
  }

  private drawMonsters(): void {
    for (let i = 0; i < 2; i++) {
      const x = GAME_WIDTH - 80 + i * 50;
      const y = GAME_HEIGHT / 2 - 40;

      if (this.textures.exists('monster_goblin')) {
        const img = this.add.image(x, y, 'monster_goblin');
        img.setScale(2.5);
        this.monsterImages.push(img);
      } else {
        const g = this.add.graphics();
        g.fillStyle(0x66aa44, 1);
        g.fillCircle(x, y, 14);
        this.monsterImages.push(g as any);
      }

      this.add.text(x, y + 20, '👹', { fontSize: '10px' }).setOrigin(0.5, 0);
    }
  }

  update(_time: number, delta: number): void {
    this.farmTimer += delta;
    if (this.farmTimer >= 2000) {
      this.farmTimer = 0;
      const result = this.session.farmTick(this.classSkills);
      if (result.expGained > 0) {
        this.log('⚔ Monster defeated! +50 EXP');
        this.flashTeam();
      }
      if (result.loot.length > 0) {
        this.log(`📦 ${result.loot.join(', ')}`);
      }
      this.refreshAll();
    }
  }

  private flashTeam(): void {
    this.teamSprites.forEach(s => {
      if (s.img && s.img.texture && s.img.texture.key !== '__DEFAULT') {
        this.tweens.add({ targets: s.img, alpha: 0.4, duration: 80, yoyo: true, repeat: 1 });
      }
    });
  }

  private refreshAll(): void {
    const leader = this.session.getTeamMember(1);
    this.statsPanel.updateStats(
      leader.stats, leader.totalAttackPower, leader.totalDefense,
      leader.level, leader.resetCount, leader.availableStatPoints,
    );
    this.goldText.setText(`💰 ${leader.gold}`);

    this.teamSprites.forEach((s, i) => {
      if (i < this.session.teamSize) {
        const m = this.session.getTeamMember(i + 1);
        const barX = 120 + i * 140 - 22;
        const barY = GAME_HEIGHT / 2 + 58;
        const pct = m.hp / m.maxHp;

        s.hpBar.clear();
        s.hpBar.fillStyle(0x333333, 0.8);
        s.hpBar.fillRect(barX, barY, 44, 4);
        s.hpBar.fillStyle(Phaser.Display.Color.HexStringToColor(getHealthBarColor(m.hp, m.maxHp)).color, 1);
        s.hpBar.fillRect(barX + 1, barY + 1, 42 * pct, 2);
      }
    });
  }

  private log(msg: string): void {
    this.logLines.push(msg);
    if (this.logLines.length > 8) this.logLines.shift();
    this.combatText.setText(this.logLines.join('\n'));
  }
}
