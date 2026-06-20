import { Inventory } from '../game/systems/inventory';
import { Equipment, EquipmentSlot, ItemTier } from '../game/entities/equipment';

describe('Inventory', () => {
  describe('basic operations', () => {
    test('starts empty', () => {
      const inv = new Inventory();

      expect(inv.size).toBe(0);
      expect(inv.isFull).toBe(false);
    });

    test('adds item to inventory', () => {
      const inv = new Inventory();
      const item = new Equipment(EquipmentSlot.Weapon, { name: 'Sword', tier: ItemTier.Normal, attackPower: 10 });

      inv.add(item);

      expect(inv.size).toBe(1);
    });

    test('default max 40 slots', () => {
      const inv = new Inventory();
      expect(inv.maxSlots).toBe(40);
    });

    test('isFull when at max slots', () => {
      const inv = new Inventory(2);
      inv.add(new Equipment(EquipmentSlot.Weapon, { name: 'A', tier: ItemTier.Normal, attackPower: 1 }));
      inv.add(new Equipment(EquipmentSlot.Weapon, { name: 'B', tier: ItemTier.Normal, attackPower: 1 }));

      expect(inv.isFull).toBe(true);
    });

    test('cannot add when full', () => {
      const inv = new Inventory(1);
      inv.add(new Equipment(EquipmentSlot.Weapon, { name: 'A', tier: ItemTier.Normal, attackPower: 1 }));

      expect(() => inv.add(new Equipment(EquipmentSlot.Weapon, { name: 'B', tier: ItemTier.Normal, attackPower: 1 }))).toThrow('Inventory is full');
    });
  });

  describe('retrieval and removal', () => {
    test('gets item by index', () => {
      const inv = new Inventory();
      const item = new Equipment(EquipmentSlot.Weapon, { name: 'Sword', tier: ItemTier.Normal, attackPower: 10 });
      inv.add(item);

      expect(inv.get(0)?.name).toBe('Sword');
    });

    test('removes item by index', () => {
      const inv = new Inventory();
      inv.add(new Equipment(EquipmentSlot.Weapon, { name: 'Sword', tier: ItemTier.Normal, attackPower: 10 }));

      const removed = inv.remove(0);
      expect(removed?.name).toBe('Sword');
      expect(inv.size).toBe(0);
    });

    test('remove returns undefined for invalid index', () => {
      const inv = new Inventory();

      expect(inv.remove(0)).toBeUndefined();
      expect(inv.remove(-1)).toBeUndefined();
    });

    test('removeAt swaps with last and shrinks', () => {
      const inv = new Inventory();
      inv.add(new Equipment(EquipmentSlot.Weapon, { name: 'A', tier: ItemTier.Normal, attackPower: 1 }));
      inv.add(new Equipment(EquipmentSlot.Weapon, { name: 'B', tier: ItemTier.Normal, attackPower: 1 }));
      inv.add(new Equipment(EquipmentSlot.Weapon, { name: 'C', tier: ItemTier.Normal, attackPower: 1 }));

      const removed = inv.removeAt(0);

      expect(removed?.name).toBe('A');
      expect(inv.size).toBe(2);
    });
  });

  describe('listing items', () => {
    test('lists all items', () => {
      const inv = new Inventory();
      inv.add(new Equipment(EquipmentSlot.Weapon, { name: 'Sword', tier: ItemTier.Normal, attackPower: 10 }));
      inv.add(new Equipment(EquipmentSlot.Armor, { name: 'Armor', tier: ItemTier.Magic, defense: 20 }));

      const items = inv.list();
      expect(items.length).toBe(2);
    });

    test('filter by slot type', () => {
      const inv = new Inventory();
      inv.add(new Equipment(EquipmentSlot.Weapon, { name: 'Sword', tier: ItemTier.Normal, attackPower: 10 }));
      inv.add(new Equipment(EquipmentSlot.Armor, { name: 'Armor', tier: ItemTier.Magic, defense: 20 }));

      const weapons = inv.filterBySlot(EquipmentSlot.Weapon);
      expect(weapons.length).toBe(1);
      expect(weapons[0].name).toBe('Sword');
    });
  });
});
