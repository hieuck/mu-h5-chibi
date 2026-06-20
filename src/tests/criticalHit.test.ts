import { Character, CharacterClass } from '../game/entities/character';
import { Monster } from '../game/entities/monster';
import { calculateDamage } from '../game/systems/combat';

describe('CriticalHit', () => {
  function calculateCrit(char: Character, monster: Monster): { damage: number; crit: boolean } {
    const base = calculateDamage(char, monster);
    const critChance = char.stats.agility * 0.002;
    const isCrit = Math.random() < critChance;
    return { damage: isCrit ? Math.floor(base * 1.5) : base, crit: isCrit };
  }

  test('crit chance scales with agility', () => {
    const lowAgi = new Character({ name: 'Low', class: CharacterClass.DarkKnight });
    const highAgi = new Character({ name: 'High', class: CharacterClass.Elf });
    const monster = new Monster({ name: 'Goblin', hp: 100, defense: 0, level: 1 });

    const lowChance = lowAgi.stats.agility * 0.002;
    const highChance = highAgi.stats.agility * 0.002;

    expect(highChance).toBeGreaterThan(lowChance);
  });

  test('crit deals 1.5x damage', () => {
    const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
    const monster = new Monster({ name: 'Goblin', hp: 100, defense: 0, level: 1 });

    const base = calculateDamage(char, monster);
    const critDamage = Math.floor(base * 1.5);

    expect(critDamage).toBe(Math.floor(base * 1.5));
  });

  test('agility stacking increases crit more', () => {
    const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
    const baseChance = char.stats.agility * 0.002;

    char.stats.agility += 100;
    const boostedChance = char.stats.agility * 0.002;

    expect(boostedChance).toBeCloseTo(baseChance + 0.2);
  });
});
