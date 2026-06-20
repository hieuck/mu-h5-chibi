export enum AssetCategory {
  Character = 'character',
  Monster = 'monster',
  Item = 'item',
  UI = 'ui',
  Effect = 'effect',
  Background = 'background',
}

export interface AnimationDef {
  frames: number;
  frameRate: number;
  repeat: number;
}

export interface AssetDef {
  key: string;
  name: string;
  path: string;
  category: AssetCategory;
  frameWidth: number;
  frameHeight: number;
  animations: Record<string, AnimationDef>;
}

const MANIFEST: AssetDef[] = [
  // ── Characters (single frame 64×64) ──
  { key: 'character_dk',  name: 'Dark Knight',     path: 'assets/sprites/dk.png',     category: AssetCategory.Character, frameWidth: 64, frameHeight: 64, animations: { idle: { frames: 1, frameRate: 1, repeat: -1 } } },
  { key: 'character_dw',  name: 'Dark Wizard',     path: 'assets/sprites/dw.png',     category: AssetCategory.Character, frameWidth: 64, frameHeight: 64, animations: { idle: { frames: 1, frameRate: 1, repeat: -1 } } },
  { key: 'character_elf', name: 'Elf',             path: 'assets/sprites/elf.png',    category: AssetCategory.Character, frameWidth: 64, frameHeight: 64, animations: { idle: { frames: 1, frameRate: 1, repeat: -1 } } },
  { key: 'character_sum', name: 'Summoner',        path: 'assets/sprites/sum.png',    category: AssetCategory.Character, frameWidth: 64, frameHeight: 64, animations: { idle: { frames: 1, frameRate: 1, repeat: -1 } } },
  { key: 'character_mg',  name: 'Magic Gladiator', path: 'assets/sprites/mg.png',     category: AssetCategory.Character, frameWidth: 64, frameHeight: 64, animations: { idle: { frames: 1, frameRate: 1, repeat: -1 } } },

  // ── Monsters (single frame) ──
  { key: 'monster_goblin',    name: 'Goblin',    path: 'assets/sprites/goblin.png',    category: AssetCategory.Monster, frameWidth: 32, frameHeight: 32, animations: { idle: { frames: 1, frameRate: 1, repeat: -1 } } },
  { key: 'monster_skeleton',  name: 'Skeleton',  path: 'assets/sprites/skeleton.png',  category: AssetCategory.Monster, frameWidth: 32, frameHeight: 32, animations: { idle: { frames: 1, frameRate: 1, repeat: -1 } } },
  { key: 'monster_giant',     name: 'Giant',     path: 'assets/sprites/giant.png',     category: AssetCategory.Monster, frameWidth: 48, frameHeight: 48, animations: { idle: { frames: 1, frameRate: 1, repeat: -1 } } },

  // ── Item icons (32×32) ──
  { key: 'item_short_sword', name: 'Short Sword', path: 'assets/items/weapons.png',    category: AssetCategory.Item, frameWidth: 32, frameHeight: 32, animations: { idle: { frames: 1, frameRate: 1, repeat: 0 } } },

  // ── UI elements ──
  { key: 'ui_panel',         name: 'Panel',       path: 'assets/ui/panel.png',         category: AssetCategory.UI, frameWidth: 16, frameHeight: 16, animations: { idle: { frames: 1, frameRate: 1, repeat: 0 } } },
  { key: 'ui_button',        name: 'Button',      path: 'assets/ui/button.png',        category: AssetCategory.UI, frameWidth: 32, frameHeight: 16, animations: { idle: { frames: 1, frameRate: 1, repeat: 0 } } },
  { key: 'ui_heart',         name: 'Heart',       path: 'assets/ui/heart.png',         category: AssetCategory.UI, frameWidth: 16, frameHeight: 16, animations: { idle: { frames: 1, frameRate: 1, repeat: 0 } } },

  // ── Backgrounds ──
  { key: 'bg_brave_grounds', name: 'Brave Grounds', path: 'assets/bg/brave_grounds.png', category: AssetCategory.Background, frameWidth: 800, frameHeight: 600, animations: { idle: { frames: 1, frameRate: 1, repeat: 0 } } },
];

export class AssetManifest {
  private _assets: Map<string, AssetDef> = new Map();

  constructor() {
    for (const def of MANIFEST) {
      this._assets.set(def.key, def);
    }
  }

  getByCategory(category: AssetCategory): AssetDef[] {
    return Array.from(this._assets.values()).filter(a => a.category === category);
  }

  getByKey(key: string): AssetDef | undefined {
    return this._assets.get(key);
  }

  getAllKeys(): string[] {
    return Array.from(this._assets.keys());
  }
}
