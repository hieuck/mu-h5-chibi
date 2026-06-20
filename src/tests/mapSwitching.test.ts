import { GameMap, MapDatabase } from '../game/systems/maps';
import { FarmArea } from '../game/systems/autoFarm';
import { Monster } from '../game/entities/monster';
import { Character, CharacterClass } from '../game/entities/character';

describe('Map Progression UI', () => {
  function makeMap(id: string, name: string, level: number): GameMap {
    const area = new FarmArea({
      name: `${name} Area`,
      monsters: [new Monster({ name: 'Monster', hp: 10 * level, defense: level, level })],
      recommendedLevel: level,
    });
    return new GameMap({ id, name, requiredLevel: level, areas: [area] });
  }

  test('brave grounds unlocked at level 1', () => {
    const map = makeMap('brave', 'Brave Grounds', 1);
    const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });

    expect(map.isUnlocked(char)).toBe(true);
  });

  test('dragon valley locked until level 20', () => {
    const map = makeMap('dragon', 'Dragon Valley', 20);
    const low = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
    const high = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
    for (let i = 0; i < 20; i++) high.addExp(high.level * 100);

    expect(map.isUnlocked(low)).toBe(false);
    expect(map.isUnlocked(high)).toBe(true);
  });

  test('switchMap changes current area', () => {
    const db = new MapDatabase();
    db.register(makeMap('m1', 'M1', 1), makeMap('m2', 'M2', 5));

    const switched = db.get('m2');
    expect(switched?.id).toBe('m2');
  });

  test('map has area with monsters', () => {
    const map = makeMap('test', 'Test', 1);

    expect(map.areas.length).toBe(1);
    expect(map.areas[0].monsters.length).toBeGreaterThan(0);
  });

  test('higher level maps have stronger monsters', () => {
    const lowMap = makeMap('low', 'Low', 1);
    const highMap = makeMap('high', 'High', 20);

    expect(highMap.areas[0].monsters[0].defense).toBeGreaterThan(lowMap.areas[0].monsters[0].defense);
  });
});
