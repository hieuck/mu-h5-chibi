import { Equipment, EquipmentSlot, ItemTier } from '../game/entities/equipment';
import { Character, CharacterClass } from '../game/entities/character';
import { ItemDatabase } from '../game/data/itemDatabase';

describe('EquipmentDrops', () => {
  function rollDrop(chance: number): boolean {
    return Math.random() < chance;
  }

  test('monsters drop equipment with correct slot', () => {
    const sword = new Equipment(EquipmentSlot.Weapon, { name: 'Iron Sword', tier: ItemTier.Normal, attackPower: 10, value: 100 });

    expect(sword.slot).toBe(EquipmentSlot.Weapon);
    expect(sword.attackPower).toBe(10);
  });

  test('higher level monsters drop better items', () => {
    const low = new Equipment(EquipmentSlot.Weapon, { name: 'Basic', tier: ItemTier.Normal, attackPower: 10, requiredLevel: 1 });
    const high = new Equipment(EquipmentSlot.Weapon, { name: 'Advanced', tier: ItemTier.Rare, attackPower: 50, requiredLevel: 20 });

    expect(high.requiredLevel).toBeGreaterThan(low.requiredLevel);
    expect(high.attackPower).toBeGreaterThan(low.attackPower);
  });

  test('equipping dropped item increases stats', () => {
    const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
    const sword = new Equipment(EquipmentSlot.Weapon, { name: 'Drop Sword', tier: ItemTier.Magic, attackPower: 20, statBonuses: { strength: 3 } });

    char.equip(sword);

    expect(char.totalAttackPower).toBe(20);
    expect(char.stats.strength).toBe(31);
  });

  test('auto-equip better dropped items', () => {
    const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
    char.equip(new Equipment(EquipmentSlot.Weapon, { name: 'Old', tier: ItemTier.Normal, attackPower: 5 }));
    const drop = new Equipment(EquipmentSlot.Weapon, { name: 'Better Drop', tier: ItemTier.Rare, attackPower: 40 });

    const old = char.equip(drop);

    expect(char.getEquippedItem(EquipmentSlot.Weapon)?.name).toBe('Better Drop');
    expect(old?.name).toBe('Old');
  });

  test('item database resolves drop IDs correctly', () => {
    const db = new ItemDatabase();

    const item = db.resolveItem('short_sword');

    expect(item?.name).toBe('Short Sword');
    expect(item?.attackPower).toBe(12);
  });
});
