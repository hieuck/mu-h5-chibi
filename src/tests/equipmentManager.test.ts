import { Character, CharacterClass } from '../game/entities/character';
import { Equipment, EquipmentSlot } from '../game/entities/equipment';
import { Inventory } from '../game/systems/inventory';

describe('EquipmentManager', () => {
  describe('equip from inventory', () => {
    test('equip item from inventory onto character', () => {
      const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
      const inv = new Inventory();
      const sword = new Equipment(EquipmentSlot.Weapon, { name: 'Iron Sword', tier: 'normal' as any, attackPower: 15, value: 100 });
      inv.add(sword);

      const removed = inv.remove(0);
      const oldItem = char.equip(removed!);

      expect(char.getEquippedItem(EquipmentSlot.Weapon)?.name).toBe('Iron Sword');
      expect(char.totalAttackPower).toBe(15);
      expect(oldItem).toBeUndefined();
    });

    test('unequip returns item to inventory', () => {
      const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
      const inv = new Inventory();
      const sword = new Equipment(EquipmentSlot.Weapon, { name: 'Iron Sword', tier: 'normal' as any, attackPower: 15, value: 100 });
      char.equip(sword);

      const removed = char.unequip(EquipmentSlot.Weapon);
      if (removed) inv.add(removed);

      expect(char.getEquippedItem(EquipmentSlot.Weapon)).toBeUndefined();
      expect(inv.size).toBe(1);
      expect(inv.get(0)?.name).toBe('Iron Sword');
    });

    test('swap equipment replaces and returns old to inventory', () => {
      const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
      const inv = new Inventory();
      const oldSword = new Equipment(EquipmentSlot.Weapon, { name: 'Old Sword', tier: 'normal' as any, attackPower: 5, value: 50 });
      const newSword = new Equipment(EquipmentSlot.Weapon, { name: 'New Sword', tier: 'rare' as any, attackPower: 30, value: 500 });
      char.equip(oldSword);

      const removed = char.equip(newSword);
      if (removed) inv.add(removed);

      expect(char.getEquippedItem(EquipmentSlot.Weapon)?.name).toBe('New Sword');
      expect(char.totalAttackPower).toBe(30);
      expect(inv.size).toBe(1);
      expect(inv.get(0)?.name).toBe('Old Sword');
    });
  });

  describe('filtering', () => {
    test('get equippable items for a slot', () => {
      const inv = new Inventory();
      inv.add(new Equipment(EquipmentSlot.Weapon, { name: 'Sword', tier: 'normal' as any, attackPower: 5 }));
      inv.add(new Equipment(EquipmentSlot.Helm, { name: 'Helm', tier: 'normal' as any, defense: 5 }));
      inv.add(new Equipment(EquipmentSlot.Weapon, { name: 'Axe', tier: 'magic' as any, attackPower: 10 }));

      const weapons = inv.filterBySlot(EquipmentSlot.Weapon);

      expect(weapons.length).toBe(2);
      expect(weapons[0].name).toBe('Sword');
      expect(weapons[1].name).toBe('Axe');
    });
  });

  describe('sell from inventory', () => {
    test('sell item gives gold based on item value', () => {
      const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
      const inv = new Inventory();
      const sword = new Equipment(EquipmentSlot.Weapon, { name: 'Iron Sword', tier: 'normal' as any, attackPower: 5, value: 1000 });
      inv.add(sword);

      const item = inv.remove(0);
      if (item) {
        char.gold += Math.floor(item.value / 2);
      }

      expect(char.gold).toBe(500);
      expect(inv.size).toBe(0);
    });
  });
});
