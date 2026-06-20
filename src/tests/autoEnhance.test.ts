import { Character, CharacterClass } from '../game/entities/character';
import { Equipment, EquipmentSlot, ItemTier } from '../game/entities/equipment';

describe('AutoEnhance', () => {
  function canAutoEnhance(item: Equipment, gold: number): { can: boolean; cost: number } {
    const cost = 100 * (item.enhanceLevel + 1);
    return { can: gold >= cost, cost };
  }

  test('enhance cost scales with level', () => {
    const sword = new Equipment(EquipmentSlot.Weapon, { name: 'Sword', tier: ItemTier.Normal, attackPower: 10, value: 100 });
    expect(canAutoEnhance(sword, 100).cost).toBe(100);
    sword.enhance();
    expect(canAutoEnhance(sword, 200).cost).toBe(200);
  });

  test('cannot enhance without enough gold', () => {
    const sword = new Equipment(EquipmentSlot.Weapon, { name: 'Sword', tier: ItemTier.Normal, attackPower: 10 });

    expect(canAutoEnhance(sword, 50).can).toBe(false);
    expect(canAutoEnhance(sword, 200).can).toBe(true);
  });

  test('max enhance level 15 cannot be enhanced', () => {
    const sword = new Equipment(EquipmentSlot.Weapon, { name: 'Sword', tier: ItemTier.Normal, attackPower: 10 });
    for (let i = 0; i < 15; i++) sword.enhance();

    expect(() => sword.enhance()).toThrow('Max enhance level reached');
  });
});
