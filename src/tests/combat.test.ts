import { Character, CharacterClass } from '../game/entities/character';
import { ItemTier, createWeapon } from '../game/entities/equipment';
import { Monster } from '../game/entities/monster';
import { calculateDamage, attack } from '../game/systems/combat';

describe('Combat', () => {
  describe('damage calculation', () => {
    test('bare hands deal strength-based damage', () => {
      const attacker = new Character({ name: 'Fighter', class: CharacterClass.DarkKnight });
      const defender = new Monster({ name: 'Goblin', hp: 100, defense: 0, level: 1 });

      const damage = calculateDamage(attacker, defender);

      expect(damage).toBe(8);
    });

    test('defense reduces damage', () => {
      const attacker = new Character({ name: 'Fighter', class: CharacterClass.DarkKnight });
      const sword = createWeapon({ name: 'Iron Sword', tier: ItemTier.Normal, attackPower: 50 });
      attacker.equip(sword);
      const defender = new Monster({ name: 'Armored Goblin', hp: 100, defense: 50, level: 1 });

      const damage = calculateDamage(attacker, defender);

      expect(damage).toBeLessThan(attacker.totalAttackPower);
      expect(damage).toBeGreaterThan(0);
    });

    test('equipping weapon increases damage', () => {
      const attacker = new Character({ name: 'Fighter', class: CharacterClass.DarkKnight });
      const defender = new Monster({ name: 'Goblin', hp: 100, defense: 0, level: 1 });
      const before = calculateDamage(attacker, defender);
      const sword = createWeapon({ name: 'Iron Sword', tier: ItemTier.Normal, attackPower: 20 });
      attacker.equip(sword);

      const after = calculateDamage(attacker, defender);

      expect(after).toBeGreaterThan(before);
    });

    test('higher strength adds more damage', () => {
      const lowStr = new Character({ name: 'Low STR', class: CharacterClass.DarkKnight });
      const highStr = new Character({ name: 'High STR', class: CharacterClass.DarkKnight });
      highStr.addExp(100);
      highStr.allocateStat('strength', 5);
      const defender = new Monster({ name: 'Slime', hp: 200, defense: 0, level: 1 });

      const lowDamage = calculateDamage(lowStr, defender);
      const highDamage = calculateDamage(highStr, defender);

      expect(highDamage).toBeGreaterThan(lowDamage);
    });
  });

  describe('attack execution', () => {
    test('attack reduces monster HP', () => {
      const attacker = new Character({ name: 'Fighter', class: CharacterClass.DarkKnight });
      const defender = new Monster({ name: 'Goblin', hp: 100, defense: 0, level: 1 });

      attack(attacker, defender);

      expect(defender.hp).toBeLessThan(100);
    });

    test('monster HP cannot go below 0', () => {
      const attacker = new Character({ name: 'Fighter', class: CharacterClass.DarkKnight });
      const sword = createWeapon({ name: 'Legendary Sword', tier: ItemTier.Mythic, attackPower: 999 });
      attacker.equip(sword);
      const defender = new Monster({ name: 'Weak Goblin', hp: 10, defense: 0, level: 1 });

      attack(attacker, defender);

      expect(defender.hp).toBe(0);
    });

    test('monster dies when HP reaches 0', () => {
      const attacker = new Character({ name: 'Fighter', class: CharacterClass.DarkKnight });
      const defender = new Monster({ name: 'Very Weak Goblin', hp: 5, defense: 0, level: 1 });

      attack(attacker, defender);

      expect(defender.isAlive).toBe(false);
    });
  });
});
