import { Character, CharacterClass } from '../game/entities/character';
import { EquipmentSlot } from '../game/entities/equipment';
import { WingTier, createWings, getWingForClass } from '../game/entities/wings';

describe('Wings', () => {
  describe('creation', () => {
    test('creates wings with correct properties', () => {
      const wings = createWings({
        name: 'Wings of Elf',
        tier: WingTier.Tier1,
        class: CharacterClass.Elf,
        attackPowerPercent: 12,
        defense: 20,
        hpBonus: 50,
      });

      expect(wings.name).toBe('Wings of Elf');
      expect(wings.attackPowerPercent).toBe(12);
      expect(wings.defense).toBe(20);
      expect(wings.hpBonus).toBe(50);
    });

    test('tier 1 wings have basic stats', () => {
      const wings = createWings({
        name: 'Wings of Elf',
        tier: WingTier.Tier1,
        class: CharacterClass.Elf,
        attackPowerPercent: 12,
        defense: 20,
        hpBonus: 50,
      });

      expect(wings.attackPowerPercent).toBe(12);
      expect(wings.defense).toBe(20);
    });

    test('tier 3 wings have powerful stats', () => {
      const wings = createWings({
        name: 'Wings of Storm',
        tier: WingTier.Tier3,
        class: CharacterClass.DarkKnight,
        attackPowerPercent: 65,
        defense: 120,
        hpBonus: 300,
      });

      expect(wings.attackPowerPercent).toBeGreaterThan(40);
      expect(wings.defense).toBe(120);
    });
  });

  describe('class-specific wings', () => {
    test('getWingForClass returns correct wing for DK', () => {
      const wings = getWingForClass(CharacterClass.DarkKnight, WingTier.Tier1);

      expect(wings.name).toBe('Wings of Dragon');
      expect(wings.requiredClass).toBe(CharacterClass.DarkKnight);
      expect(wings.attackPowerPercent).toBe(12);
      expect(wings.hpBonus).toBe(50);
    });

    test('getWingForClass returns correct wing for DW', () => {
      const wings = getWingForClass(CharacterClass.DarkWizard, WingTier.Tier1);

      expect(wings.name).toBe('Wings of Heaven');
      expect(wings.requiredClass).toBe(CharacterClass.DarkWizard);
    });

    test('higher tier wings are stronger', () => {
      const t1 = getWingForClass(CharacterClass.Elf, WingTier.Tier1);
      const t2 = getWingForClass(CharacterClass.Elf, WingTier.Tier2);
      const t3 = getWingForClass(CharacterClass.Elf, WingTier.Tier3);

      expect(t2.attackPowerPercent).toBeGreaterThan(t1.attackPowerPercent);
      expect(t3.attackPowerPercent).toBeGreaterThan(t2.attackPowerPercent);
      expect(t3.defense).toBeGreaterThan(t2.defense);
    });
  });

  describe('equipping wings', () => {
    test('character equips wings in wing slot', () => {
      const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
      const wings = getWingForClass(CharacterClass.DarkKnight, WingTier.Tier1);

      char.equip(wings);

      expect(char.getEquippedItem(EquipmentSlot.Wings)?.name).toBe('Wings of Dragon');
    });

    test('wings with wrong class throws error', () => {
      const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
      const elfWings = getWingForClass(CharacterClass.Elf, WingTier.Tier1);

      expect(() => char.equip(elfWings)).toThrow('Wrong class for this equipment');
    });
  });
});
