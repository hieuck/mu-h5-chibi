import { Character, CharacterClass } from '../game/entities/character';

describe('Stat Allocation Flow', () => {
  test('allocate points via handler updates character stats', () => {
    const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
    char.addExp(200);
    expect(char.availableStatPoints).toBe(5);

    char.allocateStat('strength', 2);
    char.allocateStat('agility', 3);

    expect(char.stats.strength).toBe(30);
    expect(char.stats.agility).toBe(23);
    expect(char.availableStatPoints).toBe(0);
  });

  test('can allocate one point at a time', () => {
    const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
    char.addExp(100);

    char.allocateStat('strength', 1);
    expect(char.stats.strength).toBe(29);
    expect(char.availableStatPoints).toBe(4);

    char.allocateStat('agility', 1);
    expect(char.stats.agility).toBe(21);
    expect(char.availableStatPoints).toBe(3);
  });

  test('level up multiple times gives more points', () => {
    const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
    for (let i = 0; i < 10; i++) char.addExp(char.level * 100);

    expect(char.level).toBeGreaterThan(1);
    expect(char.availableStatPoints).toBe((char.level - 1) * 5);
  });
});
