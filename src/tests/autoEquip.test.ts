import { Character, CharacterClass } from '../game/entities/character';
import { Equipment, EquipmentSlot, ItemTier } from '../game/entities/equipment';

describe('AutoEquip', () => {
  function isItemUpgrade(char: Character, item: Equipment): boolean {
    const current = char.getEquippedItem(item.slot);
    if (!current) return true;
    const currentPower = current.attackPower + current.defense;
    const newPower = item.attackPower + item.defense;
    return newPower > currentPower;
  }

  describe('item comparison', () => {
    test('empty slot is always an upgrade', () => {
      const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
      const sword = new Equipment(EquipmentSlot.Weapon, { name: 'Sword', tier: ItemTier.Normal, attackPower: 10 });

      expect(isItemUpgrade(char, sword)).toBe(true);
    });

    test('higher attack power is upgrade', () => {
      const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
      char.equip(new Equipment(EquipmentSlot.Weapon, { name: 'Old', tier: ItemTier.Normal, attackPower: 5 }));

      const better = new Equipment(EquipmentSlot.Weapon, { name: 'Better', tier: ItemTier.Magic, attackPower: 15 });

      expect(isItemUpgrade(char, better)).toBe(true);
    });

    test('lower attack power is not upgrade', () => {
      const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
      char.equip(new Equipment(EquipmentSlot.Weapon, { name: 'Old', tier: ItemTier.Rare, attackPower: 50 }));

      const worse = new Equipment(EquipmentSlot.Weapon, { name: 'Worse', tier: ItemTier.Normal, attackPower: 5 });

      expect(isItemUpgrade(char, worse)).toBe(false);
    });

    test('higher defense armor is upgrade', () => {
      const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
      char.equip(new Equipment(EquipmentSlot.Armor, { name: 'Old', tier: ItemTier.Normal, defense: 10 }));

      const better = new Equipment(EquipmentSlot.Armor, { name: 'Better', tier: ItemTier.Magic, defense: 30 });

      expect(isItemUpgrade(char, better)).toBe(true);
    });

    test('cannot equip if level requirement not met', () => {
      const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
      const highLevel = new Equipment(EquipmentSlot.Weapon, { name: 'End Game', tier: ItemTier.Mythic, attackPower: 500, requiredLevel: 100 });

      expect(() => char.equip(highLevel)).toThrow('Level requirement not met');
    });

    test('cannot equip wrong class item', () => {
      const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
      const elfOnly = new Equipment(EquipmentSlot.Weapon, { name: 'Elf Bow', tier: ItemTier.Magic, attackPower: 20, requiredClass: CharacterClass.Elf });

      expect(() => char.equip(elfOnly)).toThrow('Wrong class for this equipment');
    });
  });

  describe('auto equip flow', () => {
    test('autoEquip equips if upgrade and returns old item', () => {
      const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
      char.equip(new Equipment(EquipmentSlot.Weapon, { name: 'Old', tier: ItemTier.Normal, attackPower: 5 }));
      const newSword = new Equipment(EquipmentSlot.Weapon, { name: 'New', tier: ItemTier.Magic, attackPower: 20 });

      const old = char.equip(newSword);

      expect(char.getEquippedItem(EquipmentSlot.Weapon)?.name).toBe('New');
      expect(old?.name).toBe('Old');
    });
  });
});
