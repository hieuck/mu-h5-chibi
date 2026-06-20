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

const TEAM_SPRITES = ['character_dk', 'character_dw'];
const MONSTER_SPRITE = 'monster_goblin';

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
  private teamSprites: { image: Phaser.GameObjects.Image; hpBar: Phaser.GameObjects.Graphics }[] = [];
  private monsterImages: Phaser.GameObjects.Image[] = [];

  constructor() {
    super({ key: SCENE_KEYS.GAME });
  }

  create(): void {
    // Background
    if (this.textures.exists('bg_brave_grounds')) {
      this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'bg_brave_grounds').setDisplaySize(GAME_WIDTH, GAME_HEIGHT);
    } else {
      const bg = this.add.graphics();
      bg.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x16213e, 1);
      bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }

    // Ground panel
    const ground = this.add.graphics();
    ground.fillStyle(0x000000, 0.4);
    ground.fillRoundedRect(20, GAME_HEIGHT / 2 - 100, GAME_WIDTH - 40, 300, 16);
    ground.lineStyle(1, 0xffdd44, 0.15);
    ground.strokeRoundedRect(20, GAME_HEIGHT / 2 - 100, GAME_WIDTH - 40, 300, 16);

    // Title
    this.add.text(GAME_WIDTH / 2, 18, 'MU Chibi Squad', {
      fontSize: '20px', color: '#ffdd44', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Setup
    this.classSkills = new ClassSkillDatabase();
    this.session = this.createSession();

    // Draw team sprites
    this.drawTeam();

    // Draw monsters
    this.drawMonsters();

    // Stats panel
    this.statsPanel = new StatsPanel(this, GAME_WIDTH - 210, 50);
    this.statsPanel.onAllocate((stat) => {
      const leader = this.session.getTeamMember(0);
      try { leader.allocateStat(stat as any, 1); } catch { }
      this.refreshAll();
    });

    // Combat log
    const logBg = this.add.graphics();
    logBg.fillStyle(0x000000, 0.6);
    logBg.fillRoundedRect(15, GAME_HEIGHT - 175, GAME_WIDTH - 30, 160, 8);
    this.add.text(25, GAME_HEIGHT - 168, '⚔ Combat Log', {
      fontSize: '11px', color: '#ffdd44', fontFamily: 'Arial', fontStyle: 'bold',
    });
    this.combatText = this.add.text(25, GAME_HEIGHT - 150, '', {
      fontSize: '11px', color: '#ccffcc', fontFamily: 'monospace',
      wordWrap: { width: GAME_WIDTH - 50 },
    });

    // Gold display
    this.goldText = this.add.text(GAME_WIDTH - 15, 15, '💰 0', {
      fontSize: '14px', color: '#ffdd44', fontFamily: 'Arial', fontStyle: 'bold',
    }).setOrigin(1, 0);

    // Map selector
    const maps = [
      { id: 'brave', name: 'Brave Grounds', level: 1 },
      { id: 'skeleton_dungeon', name: 'Skeleton Dungeon', level: 5 },
      { id: 'giant_peak', name: "Giant's Peak", level: 10 },
      { id: 'dragon_valley', name: 'Dragon Valley', level: 20 },
    ];
    this.mapSelector = new MapSelectorUI(this, 15, 45);
    this.mapSelector.updateMaps(
      maps.map(m => ({ ...m, unlocked: true })),
      'brave',
    );
    this.mapSelector.onMapSwitch((id) => {
      this.log(`📍 Switched to ${maps.find(m => m.id === id)?.name}`);
    });

    // Inventory UI
    this.inventoryUI = new InventoryUI(this, GAME_WIDTH / 2 - 130, GAME_HEIGHT / 2 - 160);

    // Keyboard: I = inventory
    this.input.keyboard!.on('keydown-I', () => {
      this.inventoryUI.toggle();
      if (this.inventoryUI.isVisible) {
        this.inventoryUI.refresh(this.session.getInventory(), (item, index) => {
          const char = this.session.getTeamMember(0);
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

    this.refreshAll();
    this.scene.launch(SCENE_KEYS.HUD);
  }

  private createSession(): GameSession {
    const itemDb = new ItemDatabase();
    const goblin = new Monster({ name: 'Goblin', hp: 15, defense: 2, level: 1 });
    goblin.dropTable = new DropTable({ entries: [{ itemId: 'short_sword', chance: 0.3 }] });
    const area = new FarmArea({
      name: 'Training Field',
      monsters: [goblin, goblin],
      recommendedLevel: 1,
    });
    const db = new MapDatabase();
    db.register(new GameMap({ id: 'brave', name: 'Brave Grounds', requiredLevel: 1, areas: [area] }));
    const session = new GameSession(db, (id) => itemDb.resolveItem(id));
    session.addCharacter('DK', 'darkKnight');
    session.addCharacter('DW', 'darkWizard');
    return session;
  }

  private drawTeam(): void {
    TEAM_SPRITES.forEach((key, i) => {
      const x = 200 + i * 200;
      const y = GAME_HEIGHT / 2 + 10;

      // Character image
      const imageKey = this.textures.exists(key) ? key : null;
      const img = this.add.image(x, y, imageKey || '__default');
      if (imageKey) img.setScale(3);
      img.setAlpha(imageKey ? 1 : 0);

      // HP bar background + fill
      const hpBar = this.add.graphics();
      this.teamSprites.push({ image: img, hpBar });

      // Label
      const label = this.session.getTeamMember(i);
      this.add.text(x, y + 35, `${label.name} Lv.${label.level}`, {
        fontSize: '10px', color: '#ffffff', fontFamily: 'Arial',
      }).setOrigin(0.5, 0);

      // Leader crown
      if (i === 0) {
        this.add.text(x, y - 30, '👑', { fontSize: '14px' }).setOrigin(0.5, 0.5);
      }
    });
  }

  private drawMonsters(): void {
    for (let i = 0; i < 2; i++) {
      const x = GAME_WIDTH - 160 + i * 60;
      const y = GAME_HEIGHT / 2 - 30;
      const key = this.textures.exists(MONSTER_SPRITE) ? MONSTER_SPRITE : null;
      const img = this.add.image(x, y, key || '__default');
      if (key) img.setScale(2);
      img.setAlpha(key ? 1 : 0);
      this.monsterImages.push(img);

      this.add.text(x, y + 20, 'Goblin', {
        fontSize: '9px', color: '#ff8888', fontFamily: 'Arial',
      }).setOrigin(0.5, 0);
    }
  }

  update(_time: number, delta: number): void {
    this.farmTimer += delta;
    if (this.farmTimer >= 2000) {
      this.farmTimer = 0;
      const result = this.session.farmTick(this.classSkills);
      if (result.expGained > 0) {
        this.log('⚔ Defeated! +50 EXP');
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
      if (s.image.texture.key !== '__default') {
        this.tweens.add({ targets: s.image, alpha: 0.5, duration: 80, yoyo: true, repeat: 1 });
      }
    });
  }

  private refreshAll(): void {
    const char = this.session.getTeamMember(0);
    this.statsPanel.updateStats(char.stats, char.totalAttackPower, char.totalDefense,
      char.level, char.resetCount, char.availableStatPoints);
    this.goldText.setText(`💰 ${char.gold}`);

    // Update HP bars
    this.teamSprites.forEach((s, i) => {
      const m = this.session.getTeamMember(i);
      const barX = s.image.x - 25;
      const barY = s.image.y + 30;
      const barW = 50;
      const barH = 4;
      const pct = m.hp / m.maxHp;

      s.hpBar.clear();
      s.hpBar.fillStyle(0x333333, 1);
      s.hpBar.fillRect(barX, barY, barW, barH);
      s.hpBar.fillStyle(Phaser.Display.Color.HexStringToColor(getHealthBarColor(m.hp, m.maxHp)).color, 1);
      s.hpBar.fillRect(barX + 1, barY + 1, (barW - 2) * pct, barH - 2);
    });
  }

  private log(msg: string): void {
    this.logLines.push(msg);
    if (this.logLines.length > 8) this.logLines.shift();
    this.combatText.setText(this.logLines.join('\n'));
  }
}
