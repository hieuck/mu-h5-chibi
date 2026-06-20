import { GameMap, MapDatabase } from '../game/systems/maps';
import { Character, CharacterClass } from '../game/entities/character';
import { FarmArea } from '../game/systems/autoFarm';
import { Monster } from '../game/entities/monster';

function makeMap(id: string, name: string, level: number): GameMap {
  return new GameMap({ id, name, requiredLevel: level, areas: [] });
}

describe('MapSelector', () => {
  test('shows unlocked maps for character level', () => {
    const db = new MapDatabase();
    db.register(makeMap('map1', 'Map 1', 1), makeMap('map2', 'Map 2', 5));
    const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });

    const unlocked = db.getUnlockedMaps(char);

    expect(unlocked.length).toBe(1);
    expect(unlocked[0].id).toBe('map1');
  });

  test('getNextMap returns first locked map', () => {
    const db = new MapDatabase();
    db.register(makeMap('m1', 'M1', 1), makeMap('m2', 'M2', 5), makeMap('m3', 'M3', 10));
    const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
    for (let i = 0; i < 5; i++) char.addExp(char.level * 100);

    const next = db.getNextMap(char);

    expect(next?.id).toBe('m3');
  });

  test('all maps unlocked returns undefined for next', () => {
    const db = new MapDatabase();
    db.register(makeMap('m1', 'M1', 1));
    const highChar = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
    for (let i = 0; i < 10; i++) highChar.addExp(highChar.level * 100);

    const next = db.getNextMap(highChar);

    expect(next).toBeUndefined();
  });
});
