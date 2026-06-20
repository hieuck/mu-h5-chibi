import { GameMap } from '../game/systems/maps';
import { Monster } from '../game/entities/monster';
import { FarmArea } from '../game/systems/autoFarm';
import { DropTable } from '../game/systems/loot';

describe('GameMaps', () => {
  test('Brave Grounds has goblins for beginners', () => {
    const area = new FarmArea({
      name: 'Training Field',
      monsters: [
        new Monster({ name: 'Goblin', hp: 15, defense: 2, level: 1 }),
        new Monster({ name: 'Goblin', hp: 15, defense: 2, level: 1 }),
        new Monster({ name: 'Goblin Fighter', hp: 25, defense: 4, level: 2 }),
      ],
      recommendedLevel: 1,
    });
    const map = new GameMap({ id: 'brave', name: 'Brave Grounds', requiredLevel: 1, areas: [area] });

    expect(map.areas[0].monsters.length).toBe(3);
    const goblins = map.areas[0].monsters.filter(m => m.name === 'Goblin');
    expect(goblins.length).toBe(2);
  });

  test('Lost Tower has skeletons for mid-level', () => {
    const area = new FarmArea({
      name: 'Tower Floor 1',
      monsters: [
        new Monster({ name: 'Skeleton', hp: 60, defense: 8, level: 8 }),
        new Monster({ name: 'Skeleton Archer', hp: 40, defense: 4, level: 10 }),
        new Monster({ name: 'Skeleton Knight', hp: 100, defense: 15, level: 12 }),
      ],
      recommendedLevel: 8,
    });
    const map = new GameMap({ id: 'lost_tower', name: 'Lost Tower', requiredLevel: 8, areas: [area] });

    expect(map.requiredLevel).toBe(8);
    expect(map.areas[0].monsters.some(m => m.name === 'Skeleton Knight')).toBe(true);
  });

  test('higher level maps give more gold', () => {
    const goblin = new Monster({ name: 'Goblin', hp: 15, defense: 2, level: 1 });
    const skeleton = new Monster({ name: 'Skeleton', hp: 60, defense: 8, level: 8 });
    const giant = new Monster({ name: 'Giant', hp: 200, defense: 20, level: 20 });

    expect(skeleton.goldValue).toBeGreaterThan(goblin.goldValue);
    expect(giant.goldValue).toBeGreaterThan(skeleton.goldValue);
  });

  test('Elite monsters have higher stats', () => {
    const elite = new Monster({ name: 'Elite Goblin', hp: 60, defense: 10, level: 5 });

    expect(elite.hp).toBe(60);
    expect(elite.defense).toBe(10);
    expect(elite.level).toBe(5);
  });

  test('maps have recommended level for guidance', () => {
    const area = new FarmArea({ name: 'Test', monsters: [new Monster({ name: 'T', hp: 10, defense: 0, level: 1 })], recommendedLevel: 5 });
    const map = new GameMap({ id: 'test', name: 'Test', requiredLevel: 3, areas: [area] });

    expect(map.areas[0].recommendedLevel).toBe(5);
  });

  test('drop tables vary per monster type', () => {
    const goblin = new Monster({ name: 'Goblin', hp: 15, defense: 2, level: 1 });
    goblin.dropTable = new DropTable({ entries: [{ itemId: 'short_sword', chance: 0.3 }, { itemId: 'pad_helm', chance: 0.2 }] });

    const skeleton = new Monster({ name: 'Skeleton', hp: 60, defense: 8, level: 8 });
    skeleton.dropTable = new DropTable({ entries: [{ itemId: 'rapier', chance: 0.3 }, { itemId: 'horn_shield', chance: 0.2 }] });

    expect(goblin.dropTable.entries.length).toBe(2);
    expect(skeleton.dropTable.entries.length).toBe(2);
    expect(goblin.dropTable.entries[0].itemId).not.toBe(skeleton.dropTable.entries[0].itemId);
  });
});
