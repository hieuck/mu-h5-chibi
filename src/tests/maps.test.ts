import { GameMap, MapDatabase } from '../game/systems/maps';
import { Monster } from '../game/entities/monster';
import { Character, CharacterClass } from '../game/entities/character';
import { Team } from '../game/systems/team';
import { FarmArea, autoFarmTick } from '../game/systems/autoFarm';

describe('GameMap', () => {
  test('creates map with areas', () => {
    const map = new GameMap({
      id: 'brave_grounds',
      name: 'Brave Grounds',
      requiredLevel: 1,
      areas: [
        new FarmArea({ name: 'Field', monsters: [
          new Monster({ name: 'Goblin', hp: 50, defense: 5, level: 1 }),
        ], recommendedLevel: 1 }),
      ],
    });

    expect(map.id).toBe('brave_grounds');
    expect(map.name).toBe('Brave Grounds');
    expect(map.requiredLevel).toBe(1);
    expect(map.areas.length).toBe(1);
  });

  test('isUnlocked checks character level', () => {
    const map = new GameMap({ id: 'mid_zone', name: 'Mid Zone', requiredLevel: 5, areas: [] });

    const lowChar = new Character({ name: 'Low', class: CharacterClass.DarkKnight });
    const highChar = new Character({ name: 'High', class: CharacterClass.DarkKnight });
    for (let i = 0; i < 5; i++) highChar.addExp(highChar.level * 100);

    expect(map.isUnlocked(lowChar)).toBe(false);
    expect(highChar.level).toBeGreaterThanOrEqual(5);
    expect(map.isUnlocked(highChar)).toBe(true);
  });
});

describe('MapDatabase', () => {
  test('registers and retrieves maps', () => {
    const db = new MapDatabase();
    const map = new GameMap({ id: 'brave', name: 'Brave Grounds', requiredLevel: 1, areas: [] });
    db.register(map);

    expect(db.get('brave')?.name).toBe('Brave Grounds');
  });

  test('getUnlockedMaps returns only accessible maps', () => {
    const db = new MapDatabase();
    db.register(new GameMap({ id: 'start', name: 'Start', requiredLevel: 1, areas: [] }));
    db.register(new GameMap({ id: 'advanced', name: 'Advanced', requiredLevel: 50, areas: [] }));
    const char = new Character({ name: 'Test', class: CharacterClass.DarkKnight });

    const unlocked = db.getUnlockedMaps(char);

    expect(unlocked.length).toBe(1);
    expect(unlocked[0].id).toBe('start');
  });

  test('getNextMap returns next progression target', () => {
    const db = new MapDatabase();
    const m1 = new GameMap({ id: 'map1', name: 'Map 1', requiredLevel: 1, areas: [] });
    const m2 = new GameMap({ id: 'map2', name: 'Map 2', requiredLevel: 10, areas: [] });
    const m3 = new GameMap({ id: 'map3', name: 'Map 3', requiredLevel: 20, areas: [] });

    db.register(m1, m2, m3);

    const char = new Character({ name: 'Test', class: CharacterClass.DarkKnight });
    char.addExp(500);
    expect(char.level).toBeGreaterThanOrEqual(3);

    const next = db.getNextMap(char);
    expect(next?.id).toBe('map2');
  });

  test('getNextMap returns undefined when at max', () => {
    const db = new MapDatabase();
    db.register(new GameMap({ id: 'map1', name: 'Map 1', requiredLevel: 1, areas: [] }));
    const highChar = new Character({ name: 'High', class: CharacterClass.DarkKnight });
    highChar.addExp(5000);
    expect(highChar.level).toBeGreaterThanOrEqual(10);

    const next = db.getNextMap(highChar);
    expect(next).toBeUndefined();
  });
});

describe('map progression flow', () => {
  test('auto-farm on first map gives progression', () => {
    const db = new MapDatabase();
    const map = new GameMap({ id: 'brave', name: 'Brave Grounds', requiredLevel: 1, areas: [
      new FarmArea({ name: 'Field', monsters: [
        new Monster({ name: 'Goblin', hp: 10, defense: 0, level: 1 }),
        new Monster({ name: 'Goblin', hp: 10, defense: 0, level: 1 }),
      ], recommendedLevel: 1 }),
    ]});
    db.register(map);
    const team = new Team();
    team.add(new Character({ name: 'DK', class: CharacterClass.DarkKnight }));

    for (let i = 0; i < 10; i++) {
      autoFarmTick(team, map.areas[0]);
    }

    expect(team.members[0].level).toBeGreaterThan(1);
    expect(map.areas[0].monsters.length).toBe(2);
  });
});
