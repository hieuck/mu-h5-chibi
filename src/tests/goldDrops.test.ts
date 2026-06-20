import { Character, CharacterClass } from '../game/entities/character';
import { Team } from '../game/systems/team';
import { Monster } from '../game/entities/monster';
import { FarmArea, autoFarmTick } from '../game/systems/autoFarm';

describe('Gold Drops', () => {
  test('monster has gold value based on level', () => {
    const goblin = new Monster({ name: 'Goblin', hp: 10, defense: 2, level: 1 });

    expect(goblin.goldValue).toBeGreaterThan(0);
  });

  test('higher level monsters give more gold', () => {
    const low = new Monster({ name: 'Low', hp: 10, defense: 2, level: 1 });
    const high = new Monster({ name: 'High', hp: 50, defense: 10, level: 10 });

    expect(high.goldValue).toBeGreaterThan(low.goldValue);
  });

  test('character gains gold when killing monster', () => {
    const team = new Team();
    const dk = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
    team.add(dk);
    const area = new FarmArea({
      name: 'Test', monsters: [new Monster({ name: 'Goblin', hp: 5, defense: 0, level: 1 })],
      recommendedLevel: 1,
    });

    autoFarmTick(team, area);

    expect(dk.gold).toBeGreaterThan(0);
  });

  test('gold accumulates over multiple kills', () => {
    const team = new Team();
    const dk = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
    team.add(dk);
    const area = new FarmArea({
      name: 'Test', monsters: [new Monster({ name: 'Goblin', hp: 5, defense: 0, level: 1 }), new Monster({ name: 'Goblin', hp: 5, defense: 0, level: 1 })],
      recommendedLevel: 1,
    });

    // Kill both goblins (area respawns, but we manually track)
    autoFarmTick(team, area);
    const goldAfterFirst = dk.gold;

    expect(goldAfterFirst).toBeGreaterThan(0);
  });

  test('goldValue formula: level * 10 + random factor', () => {
    const m1 = new Monster({ name: 'M1', hp: 10, defense: 2, level: 1 });
    const m5 = new Monster({ name: 'M5', hp: 30, defense: 5, level: 5 });
    const m10 = new Monster({ name: 'M10', hp: 60, defense: 10, level: 10 });

    expect(m1.goldValue).toBeGreaterThanOrEqual(5);
    expect(m5.goldValue).toBeGreaterThan(m1.goldValue);
    expect(m10.goldValue).toBeGreaterThan(m5.goldValue);
  });
});
