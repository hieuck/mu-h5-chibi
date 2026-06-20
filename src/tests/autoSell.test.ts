import { Inventory } from '../game/systems/inventory';
import { Equipment, EquipmentSlot, ItemTier, createWeapon } from '../game/entities/equipment';

describe('AutoSell', () => {
  function autoSellLowTier(inv: Inventory, maxTier: ItemTier = ItemTier.Magic): number {
    let gold = 0;
    const toRemove: number[] = [];
    inv.list().forEach((item, i) => {
      if (item.tier === ItemTier.Normal || item.tier === ItemTier.Magic) {
        gold += Math.floor(item.value / 2);
        toRemove.push(i);
      }
    });
    for (let i = toRemove.length - 1; i >= 0; i--) {
      inv.removeAt(toRemove[i]);
    }
    return gold;
  }

  test('auto sell normal items returns gold', () => {
    const inv = new Inventory();
    inv.add(new Equipment(EquipmentSlot.Weapon, { name: 'Sword', tier: ItemTier.Normal, attackPower: 5, value: 100 }));

    const gold = autoSellLowTier(inv);

    expect(gold).toBe(50);
    expect(inv.size).toBe(0);
  });

  test('keeps rare and above items', () => {
    const inv = new Inventory();
    inv.add(new Equipment(EquipmentSlot.Weapon, { name: 'Common', tier: ItemTier.Normal, attackPower: 5, value: 100 }));
    inv.add(new Equipment(EquipmentSlot.Weapon, { name: 'Rare', tier: ItemTier.Rare, attackPower: 20, value: 500 }));

    const gold = autoSellLowTier(inv);

    expect(inv.size).toBe(1);
    expect(inv.get(0)?.name).toBe('Rare');
  });

  test('sell returns 0 for empty inventory', () => {
    const inv = new Inventory();
    expect(autoSellLowTier(inv)).toBe(0);
  });
});
