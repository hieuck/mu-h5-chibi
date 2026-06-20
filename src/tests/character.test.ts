import { Character, CharacterClass } from '../game/entities/character';
import { EquipmentSlot, ItemTier, createWeapon } from '../game/entities/equipment';
import { StatName } from '../game/types';

describe('Character', () => {
  describe('creation', () => {
    test('creates Dark Knight with correct base stats', () => {
      const char = new Character({ name: 'DK Test', class: CharacterClass.DarkKnight });

      expect(char.name).toBe('DK Test');
      expect(char.class).toBe(CharacterClass.DarkKnight);
      expect(char.level).toBe(1);
      expect(char.stats.strength).toBe(28);
      expect(char.stats.agility).toBe(20);
      expect(char.stats.stamina).toBe(25);
      expect(char.stats.energy).toBe(10);
    });

    test('creates Dark Wizard with correct base stats', () => {
      const char = new Character({ name: 'DW Test', class: CharacterClass.DarkWizard });

      expect(char.stats.strength).toBe(18);
      expect(char.stats.agility).toBe(18);
      expect(char.stats.stamina).toBe(15);
      expect(char.stats.energy).toBe(30);
    });

    test('creates Elf with correct base stats', () => {
      const char = new Character({ name: 'Elf Test', class: CharacterClass.Elf });

      expect(char.stats.strength).toBe(22);
      expect(char.stats.agility).toBe(25);
      expect(char.stats.stamina).toBe(20);
      expect(char.stats.energy).toBe(14);
    });

    test('creates Summoner with correct base stats', () => {
      const char = new Character({ name: 'Sum Test', class: CharacterClass.Summoner });

      expect(char.stats.strength).toBe(15);
      expect(char.stats.agility).toBe(20);
      expect(char.stats.stamina).toBe(15);
      expect(char.stats.energy).toBe(32);
    });

    test('creates Magic Gladiator with correct base stats', () => {
      const char = new Character({ name: 'MG Test', class: CharacterClass.MagicGladiator });

      expect(char.stats.strength).toBe(26);
      expect(char.stats.agility).toBe(20);
      expect(char.stats.stamina).toBe(20);
      expect(char.stats.energy).toBe(16);
    });
  });

  describe('leveling', () => {
    test('starts at level 1 with 0 experience', () => {
      const char = new Character({ name: 'Test', class: CharacterClass.DarkKnight });

      expect(char.level).toBe(1);
      expect(char.experience).toBe(0);
    });

    test('gains experience and levels up when reaching threshold', () => {
      const char = new Character({ name: 'Test', class: CharacterClass.DarkKnight });

      char.addExp(100);

      expect(char.level).toBe(2);
      expect(char.experience).toBe(0);
    });

    test('carries over excess experience on level up', () => {
      const char = new Character({ name: 'Test', class: CharacterClass.DarkKnight });

      char.addExp(350);

      expect(char.level).toBe(3);
      expect(char.experience).toBe(50);
    });

    test('gains 5 stat points per level up', () => {
      const char = new Character({ name: 'Test', class: CharacterClass.DarkKnight });

      char.addExp(100);

      expect(char.level).toBe(2);
      expect(char.availableStatPoints).toBe(5);
    });

    test('accumulates stat points across multiple levels', () => {
      const char = new Character({ name: 'Test', class: CharacterClass.DarkKnight });

      char.addExp(600);

      expect(char.level).toBe(4);
      expect(char.availableStatPoints).toBe(15);
    });
  });

  describe('reset system', () => {
    test('starts with 0 resets', () => {
      const char = new Character({ name: 'Test', class: CharacterClass.DarkKnight });

      expect(char.resetCount).toBe(0);
    });

    test('cannot reset below minimum level', () => {
      const char = new Character({ name: 'Test', class: CharacterClass.DarkKnight });

      expect(() => char.reset()).toThrow('Minimum level 10 required to reset');
    });

    test('reset returns level to 1 and keeps stats', () => {
      const char = new Character({ name: 'Test', class: CharacterClass.DarkKnight });
      char.addExp(2000);
      while (char.level < 10) char.addExp(char.level * 100);

      char.reset();

      expect(char.level).toBe(1);
      expect(char.experience).toBe(0);
      expect(char.stats.strength).toBeGreaterThan(28);
    });

    test('reset grants bonus all-stats +5', () => {
      const char = new Character({ name: 'Test', class: CharacterClass.DarkKnight });
      const base = { ...char.stats };
      char.addExp(2000);
      while (char.level < 10) char.addExp(char.level * 100);

      char.reset();

      expect(char.stats.strength).toBe(base.strength + 5);
      expect(char.stats.agility).toBe(base.agility + 5);
      expect(char.stats.stamina).toBe(base.stamina + 5);
      expect(char.stats.energy).toBe(base.energy + 5);
    });

    test('keeps equipment after reset', () => {
      const char = new Character({ name: 'Test', class: CharacterClass.DarkKnight });
      char.addExp(2000);
      while (char.level < 10) char.addExp(char.level * 100);
      const sword = createWeapon({ name: 'Keep Sword', tier: ItemTier.Normal, attackPower: 10 });
      char.equip(sword);

      char.reset();

      expect(char.getEquippedItem(EquipmentSlot.Weapon)?.name).toBe('Keep Sword');
    });

    test('reset count increments', () => {
      const char = new Character({ name: 'Test', class: CharacterClass.DarkKnight });
      char.addExp(2000);
      while (char.level < 10) char.addExp(char.level * 100);

      char.reset();

      expect(char.resetCount).toBe(1);
    });

    test('multiple resets stack bonuses', () => {
      const char = new Character({ name: 'Test', class: CharacterClass.DarkKnight });
      const getToLevel10 = () => {
        char.addExp(2000);
        while (char.level < 10) char.addExp(char.level * 100);
      };

      getToLevel10();
      char.reset();
      getToLevel10();
      char.reset();

      expect(char.resetCount).toBe(2);
      expect(char.stats.strength).toBe(38);
    });
  });

  describe('stat allocation', () => {
    test('allocates stat points to strength', () => {
      const char = new Character({ name: 'Test', class: CharacterClass.DarkKnight });
      char.addExp(100);

      char.allocateStat('strength', 3);

      expect(char.stats.strength).toBe(31);
      expect(char.availableStatPoints).toBe(2);
    });

    test('allocates stat points to any stat', () => {
      const char = new Character({ name: 'Test', class: CharacterClass.DarkKnight });
      char.addExp(100);

      char.allocateStat('agility', 2);
      char.allocateStat('energy', 3);

      expect(char.stats.agility).toBe(22);
      expect(char.stats.energy).toBe(13);
      expect(char.availableStatPoints).toBe(0);
    });

    test('throws error when allocating more points than available', () => {
      const char = new Character({ name: 'Test', class: CharacterClass.DarkKnight });

      expect(() => char.allocateStat('strength', 1)).toThrow('Not enough stat points');
    });

    test('throws error when allocating negative points', () => {
      const char = new Character({ name: 'Test', class: CharacterClass.DarkKnight });
      char.addExp(100);

      expect(() => char.allocateStat('strength', -1)).toThrow('Invalid stat point allocation');
    });

    test('needs exp for level 2: level * 100 formula', () => {
      const char = new Character({ name: 'Test', class: CharacterClass.DarkKnight });

      char.addExp(99);
      expect(char.level).toBe(1);

      char.addExp(1);
      expect(char.level).toBe(2);
    });
  });
});
