import { Character, CharacterClass } from '../game/entities/character';
import { EquipmentSlot, ItemTier, createWeapon, createArmor } from '../game/entities/equipment';

describe('Equipment', () => {
  describe('item creation', () => {
    test('creates a weapon with correct properties', () => {
      const sword = createWeapon({
        name: 'Blade of Mu',
        tier: ItemTier.Rare,
        attackPower: 75,
        requiredLevel: 30,
        requiredStrength: 120,
      });

      expect(sword.name).toBe('Blade of Mu');
      expect(sword.slot).toBe(EquipmentSlot.Weapon);
      expect(sword.tier).toBe(ItemTier.Rare);
      expect(sword.attackPower).toBe(75);
      expect(sword.requiredLevel).toBe(30);
      expect(sword.requiredStats.strength).toBe(120);
    });

    test('weapon defaults required stats to 0', () => {
      const sword = createWeapon({
        name: 'Short Sword',
        tier: ItemTier.Normal,
        attackPower: 15,
      });

      expect(sword.requiredStats.strength).toBe(0);
      expect(sword.requiredStats.agility).toBe(0);
      expect(sword.requiredLevel).toBe(1);
    });

    test('different tiers have different colors', () => {
      const normal = createWeapon({ name: 'A', tier: ItemTier.Normal, attackPower: 1 });
      const rare = createWeapon({ name: 'B', tier: ItemTier.Rare, attackPower: 1 });
      const ancient = createWeapon({ name: 'C', tier: ItemTier.Ancient, attackPower: 1 });

      expect(normal.tierColor).toBe('#ffffff');
      expect(rare.tierColor).toBe('#ffff00');
      expect(ancient.tierColor).toBe('#ff4444');
    });
  });

  describe('stat bonuses', () => {
    test('equipment can grant stat bonuses', () => {
      const armor = createWeapon({
        name: 'Pad Armor',
        tier: ItemTier.Magic,
        attackPower: 10,
        statBonuses: { strength: 3, stamina: 5 },
      });

      expect(armor.statBonuses?.strength).toBe(3);
      expect(armor.statBonuses?.stamina).toBe(5);
    });

    test('equipment without bonuses has undefined statBonuses', () => {
      const sword = createWeapon({
        name: 'Plain Sword',
        tier: ItemTier.Normal,
        attackPower: 10,
      });

      expect(sword.statBonuses).toBeUndefined();
    });
  });

  describe('set items', () => {
    test('equipment can belong to a set', () => {
      const helm = createWeapon({
        name: 'Adamantine Helm',
        tier: ItemTier.Set,
        attackPower: 0,
        defense: 40,
        set: 'Adamantine',
      });

      expect(helm.set).toBe('Adamantine');
    });
  });

  describe('equipping on character', () => {
    test('character equips weapon and gains attack power', () => {
      const char = new Character({ name: 'Test', class: CharacterClass.DarkKnight });
      const sword = createWeapon({ name: 'Sword', tier: ItemTier.Normal, attackPower: 20 });

      char.equip(sword);

      expect(char.getEquippedItem(EquipmentSlot.Weapon)?.name).toBe('Sword');
      expect(char.totalAttackPower).toBe(20);
    });

    test('character equips armor and gains defense', () => {
      const char = new Character({ name: 'Test', class: CharacterClass.DarkKnight });
      const armor = createArmor({
        name: 'Scale Armor', tier: ItemTier.Magic, defense: 35,
      });

      char.equip(armor);

      expect(char.totalDefense).toBe(35);
    });

    test('replacing equipment returns old item', () => {
      const char = new Character({ name: 'Test', class: CharacterClass.DarkKnight });
      const oldSword = createWeapon({ name: 'Old Sword', tier: ItemTier.Normal, attackPower: 10 });
      const newSword = createWeapon({ name: 'New Sword', tier: ItemTier.Rare, attackPower: 50 });

      char.equip(oldSword);
      const returned = char.equip(newSword);

      expect(returned?.name).toBe('Old Sword');
      expect(char.getEquippedItem(EquipmentSlot.Weapon)?.name).toBe('New Sword');
    });

    test('cannot equip if level requirement not met', () => {
      const char = new Character({ name: 'Test', class: CharacterClass.DarkKnight });
      const sword = createWeapon({
        name: 'End Game Sword', tier: ItemTier.Rare, attackPower: 200, requiredLevel: 100,
      });

      expect(() => char.equip(sword)).toThrow('Level requirement not met');
    });

    test('equipping item with stat bonuses modifies character stats', () => {
      const char = new Character({ name: 'Test', class: CharacterClass.DarkKnight });
      const ring = createWeapon({
        name: 'Ring of Power',
        tier: ItemTier.Rare,
        attackPower: 0,
        statBonuses: { strength: 10, agility: 5 },
      });

      char.equip(ring);

      expect(char.stats.strength).toBe(38);
      expect(char.stats.agility).toBe(25);
    });

    test('unequipping removes stat bonuses', () => {
      const char = new Character({ name: 'Test', class: CharacterClass.DarkKnight });
      const ring = createWeapon({
        name: 'Ring of Power',
        tier: ItemTier.Rare,
        attackPower: 0,
        statBonuses: { strength: 10 },
      });

      char.equip(ring);
      const removed = char.unequip(EquipmentSlot.Weapon);

      expect(removed?.name).toBe('Ring of Power');
      expect(char.stats.strength).toBe(28);
      expect(char.getEquippedItem(EquipmentSlot.Weapon)).toBeUndefined();
    });
  });
});
