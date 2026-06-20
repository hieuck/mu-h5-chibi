import { Character, CharacterClass } from '../game/entities/character';
import { Equipment, EquipmentSlot, ItemTier } from '../game/entities/equipment';
import { SetBonusDatabase, countSetPieces, getActiveBonuses } from '../game/systems/setBonuses';

describe('Set Bonuses', () => {
  describe('set bonus database', () => {
    test('defines set bonuses for known sets', () => {
      const db = new SetBonusDatabase();
      db.defineSet('Adamantine', { 2: { defense: 30 }, 3: { defense: 60, strength: 10 } });

      expect(db.getSetBonuses('Adamantine', 2)).toEqual({ defense: 30 });
    });

    test('unknown set returns undefined', () => {
      const db = new SetBonusDatabase();

      expect(db.getSetBonuses('Mystic', 2)).toBeUndefined();
    });

    test('higher piece count unlocks better bonuses', () => {
      const db = new SetBonusDatabase();
      db.defineSet('Dragon', { 2: { defense: 20 }, 3: { defense: 50 }, 4: { defense: 100, strength: 20 } });

      const fullBonus = db.getSetBonuses('Dragon', 4);
      expect(fullBonus?.defense).toBe(100);
      expect(fullBonus?.strength).toBe(20);
    });

    test('lower bonus tier applies even with more pieces', () => {
      const db = new SetBonusDatabase();
      db.defineSet('Dragon', { 2: { defense: 20 }, 4: { defense: 100 } });

      const bonus3pc = db.getSetBonuses('Dragon', 3);
      expect(bonus3pc?.defense).toBe(20);
    });
  });

  describe('counting set pieces', () => {
    test('counts 0 for character with no equipment', () => {
      const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });

      const count = countSetPieces(char, 'Adamantine');
      expect(count).toBe(0);
    });

    test('counts matching set pieces equipped', () => {
      const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
      char.equip(new Equipment(EquipmentSlot.Weapon, { name: 'Adamantine Sword', tier: ItemTier.Set, attackPower: 50, set: 'Adamantine' }));
      char.equip(new Equipment(EquipmentSlot.Armor, { name: 'Adamantine Armor', tier: ItemTier.Set, defense: 40, set: 'Adamantine' }));

      const count = countSetPieces(char, 'Adamantine');
      expect(count).toBe(2);
    });

    test('ignores equipment from different sets', () => {
      const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
      char.equip(new Equipment(EquipmentSlot.Weapon, { name: 'Adamantine Sword', tier: ItemTier.Set, attackPower: 50, set: 'Adamantine' }));
      char.equip(new Equipment(EquipmentSlot.Armor, { name: 'Dragon Armor', tier: ItemTier.Set, defense: 40, set: 'Dragon' }));

      expect(countSetPieces(char, 'Adamantine')).toBe(1);
      expect(countSetPieces(char, 'Dragon')).toBe(1);
    });
  });

  describe('applying set bonuses to character', () => {
    test('getActiveBonuses returns combined bonuses from all sets', () => {
      const db = new SetBonusDatabase();
      db.defineSet('Adamantine', { 2: { defense: 30 }, 3: { defense: 60 } });
      db.defineSet('Dragon', { 2: { strength: 15 } });
      const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
      char.equip(new Equipment(EquipmentSlot.Weapon, { name: 'Adamantine Sword', tier: ItemTier.Set, attackPower: 50, set: 'Adamantine' }));
      char.equip(new Equipment(EquipmentSlot.Armor, { name: 'Adamantine Armor', tier: ItemTier.Set, defense: 40, set: 'Adamantine' }));
      char.equip(new Equipment(EquipmentSlot.Helm, { name: 'Dragon Helm', tier: ItemTier.Set, defense: 10, set: 'Dragon' }));
      char.equip(new Equipment(EquipmentSlot.Boots, { name: 'Dragon Boots', tier: ItemTier.Set, defense: 10, set: 'Dragon' }));

      const bonuses = getActiveBonuses(char, db);

      expect(bonuses.defense).toBe(30);
      expect(bonuses.strength).toBe(15);
    });

    test('no bonuses with no set pieces', () => {
      const db = new SetBonusDatabase();
      db.defineSet('Adamantine', { 2: { defense: 30 } });
      const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });

      const bonuses = getActiveBonuses(char, db);
      expect(Object.keys(bonuses).length).toBe(0);
    });
  });
});
