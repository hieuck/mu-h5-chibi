import { MapDatabase, GameMap } from '../systems/maps';
import { FarmArea } from '../systems/autoFarm';
import { Monster } from '../entities/monster';
import { DropTable } from '../systems/loot';
import { BossEncounter } from '../systems/bossEncounter';

export function createGameMaps(): MapDatabase {
  const db = new MapDatabase();

  // ── Map 1: Brave Grounds (Lv 1-7) ──
  const braveArea = new FarmArea({
    name: 'Training Field',
    monsters: [
      Object.assign(new Monster({ name: 'Goblin', hp: 15, defense: 2, level: 1 }), {
        dropTable: new DropTable({ entries: [{ itemId: 'short_sword', chance: 0.3 }, { itemId: 'pad_helm', chance: 0.15 }] }),
      }),
      Object.assign(new Monster({ name: 'Goblin', hp: 15, defense: 2, level: 1 }), {
        dropTable: new DropTable({ entries: [{ itemId: 'short_sword', chance: 0.3 }, { itemId: 'pad_boots', chance: 0.15 }] }),
      }),
      Object.assign(new Monster({ name: 'Goblin Fighter', hp: 25, defense: 4, level: 2 }), {
        dropTable: new DropTable({ entries: [{ itemId: 'hand_axe', chance: 0.3 }, { itemId: 'small_shield', chance: 0.2 }] }),
      }),
    ],
    recommendedLevel: 1,
  });
  db.register(new GameMap({ id: 'brave', name: '🌿 Brave Grounds', requiredLevel: 1, areas: [braveArea] }));

  // ── Map 2: Skeleton Dungeon (Lv 5-12) ──
  const skeleArea = new FarmArea({
    name: 'Dungeon Corridor',
    monsters: [
      Object.assign(new Monster({ name: 'Skeleton', hp: 45, defense: 6, level: 5 }), {
        dropTable: new DropTable({ entries: [{ itemId: 'rapier', chance: 0.25 }, { itemId: 'horn_shield', chance: 0.2 }] }),
      }),
      Object.assign(new Monster({ name: 'Skeleton Archer', hp: 30, defense: 3, level: 6 }), {
        dropTable: new DropTable({ entries: [{ itemId: 'angel_staff', chance: 0.2 }, { itemId: 'crossbow', chance: 0.2 }] }),
      }),
      Object.assign(new Monster({ name: 'Skeleton Knight', hp: 80, defense: 12, level: 8 }), {
        dropTable: new DropTable({ entries: [{ itemId: 'battle_axe', chance: 0.2 }, { itemId: 'bone_helm', chance: 0.15 }] }),
      }),
    ],
    recommendedLevel: 5,
  });
  db.register(new GameMap({ id: 'skeleton_dungeon', name: '💀 Skeleton Dungeon', requiredLevel: 5, areas: [skeleArea] }));

  // ── Map 3: Giant's Peak (Lv 10-18) ──
  const giantArea = new FarmArea({
    name: 'Mountain Base',
    monsters: [
      Object.assign(new Monster({ name: 'Giant', hp: 120, defense: 15, level: 12 }), {
        dropTable: new DropTable({ entries: [{ itemId: 'blade', chance: 0.2 }, { itemId: 'bone_armor', chance: 0.15 }] }),
      }),
      Object.assign(new Monster({ name: 'Elite Giant', hp: 200, defense: 22, level: 15 }), {
        dropTable: new DropTable({ entries: [{ itemId: 'doom_blade', chance: 0.15 }, { itemId: 'adamantine_helm', chance: 0.1 }] }),
      }),
    ],
    recommendedLevel: 10,
  });
  db.register(new GameMap({ id: 'giant_peak', name: '⛰️ Giant\'s Peak', requiredLevel: 10, areas: [giantArea] }));

  // ── Map 4: Dragon Valley (Lv 20+) ──
  const dragonArea = new FarmArea({
    name: 'Dragon Valley',
    monsters: [
      Object.assign(new Monster({ name: 'Young Dragon', hp: 300, defense: 30, level: 22 }), {
        dropTable: new DropTable({ entries: [{ itemId: 'legendary_sword', chance: 0.1 }, { itemId: 'dragon_helm', chance: 0.1 }] }),
      }),
      Object.assign(new Monster({ name: 'Elder Dragon', hp: 500, defense: 45, level: 28 }), {
        dropTable: new DropTable({ entries: [{ itemId: 'dragon_armor', chance: 0.08 }, { itemId: 'ring_of_strength', chance: 0.15 }] }),
      }),
    ],
    recommendedLevel: 20,
  });
  db.register(new GameMap({ id: 'dragon_valley', name: '🐉 Dragon Valley', requiredLevel: 20, areas: [dragonArea] }));

  // ── Map 5: Abyss (Lv 30+) ──
  const abyssArea = new FarmArea({
    name: 'Abyss Floor',
    monsters: [
      Object.assign(new Monster({ name: 'Fallen Angel', hp: 600, defense: 50, level: 30 }), {
        dropTable: new DropTable({ entries: [{ itemId: 'legendary_sword', chance: 0.12 }, { itemId: 'pendant_of_life', chance: 0.1 }] }),
      }),
      Object.assign(new Monster({ name: 'Dark Elf', hp: 450, defense: 40, level: 32 }), {
        dropTable: new DropTable({ entries: [{ itemId: 'dw_armor', chance: 0.1 }, { itemId: 'dragon_boots', chance: 0.12 }] }),
      }),
      Object.assign(new Monster({ name: 'Abyss Guardian', hp: 800, defense: 60, level: 35 }), {
        dropTable: new DropTable({ entries: [{ itemId: 'dk_armor', chance: 0.08 }, { itemId: 'dragon_armor', chance: 0.06 }] }),
      }),
    ],
    recommendedLevel: 30,
  });
  db.register(new GameMap({ id: 'abyss', name: '🌌 Abyss', requiredLevel: 30, areas: [abyssArea] }));

  // ── Boss Encounters ──
  const bosses = [
    new BossEncounter({
      boss: Object.assign(new Monster({ name: 'Goblin King', hp: 300, defense: 15, level: 10 }), {
        dropTable: new DropTable({ entries: [{ itemId: 'battle_axe', chance: 0.5 }, { itemId: 'ring_of_strength', chance: 0.3 }] }),
      }),
      requiredLevel: 5, area: 'brave', goldReward: 200,
      abilities: ['Summon Minions', 'Berserk'],
    }),
    new BossEncounter({
      boss: Object.assign(new Monster({ name: 'Skeleton Lord', hp: 600, defense: 30, level: 18 }), {
        dropTable: new DropTable({ entries: [{ itemId: 'doom_blade', chance: 0.4 }, { itemId: 'adamantine_armor', chance: 0.25 }] }),
      }),
      requiredLevel: 15, area: 'skeleton_dungeon', goldReward: 500,
      abilities: ['Bone Shield', 'Dark Curse'],
    }),
    new BossEncounter({
      boss: Object.assign(new Monster({ name: 'Dragon King', hp: 2000, defense: 60, level: 35 }), {
        dropTable: new DropTable({ entries: [{ itemId: 'legendary_sword', chance: 0.3 }, { itemId: 'dragon_armor', chance: 0.2 }, { itemId: 'pendant_of_life', chance: 0.15 }] }),
      }),
      requiredLevel: 30, area: 'dragon_valley', goldReward: 2000,
      abilities: ['Fire Breath', 'Tail Swipe', 'Fear Roar'],
    }),
  ];

  return { db, bosses };
}
