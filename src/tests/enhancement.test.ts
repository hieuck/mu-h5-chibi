import { Equipment, EquipmentSlot, ItemTier } from '../game/entities/equipment';
import { Character, CharacterClass } from '../game/entities/character';

describe('Enhancement', () => {
  test('equipment starts at +0', () => {
    const sword = new Equipment(EquipmentSlot.Weapon, { name: 'Sword', tier: ItemTier.Normal, attackPower: 10 });

    expect(sword.enhanceLevel).toBe(0);
  });

  test('enhance increases attack power', () => {
    const sword = new Equipment(EquipmentSlot.Weapon, { name: 'Sword', tier: ItemTier.Normal, attackPower: 10 });

    sword.enhance();

    expect(sword.enhanceLevel).toBe(1);
    expect(sword.attackPower).toBe(13);
  });

  test('enhance adds defense to armor', () => {
    const armor = new Equipment(EquipmentSlot.Armor, { name: 'Armor', tier: ItemTier.Magic, defense: 20 });

    armor.enhance();

    expect(armor.enhanceLevel).toBe(1);
    expect(armor.defense).toBe(26);
  });

  test('+9 to +10 gives bigger bonus', () => {
    const sword = new Equipment(EquipmentSlot.Weapon, { name: 'Sword', tier: ItemTier.Rare, attackPower: 50 });
    for (let i = 0; i < 9; i++) sword.enhance();

    sword.enhance();

    expect(sword.enhanceLevel).toBe(10);
    expect(sword.attackPower).toBeGreaterThan(50 + 9 * 3);
  });

  test('max enhance level is 15', () => {
    const sword = new Equipment(EquipmentSlot.Weapon, { name: 'Sword', tier: ItemTier.Normal, attackPower: 10 });
    for (let i = 0; i < 15; i++) sword.enhance();

    expect(() => sword.enhance()).toThrow('Max enhance level reached');
  });

  test('enhance updates equipment value', () => {
    const sword = new Equipment(EquipmentSlot.Weapon, { name: 'Sword', tier: ItemTier.Normal, attackPower: 10, value: 1000});

    sword.enhance();

    expect(sword.value).toBeGreaterThan(1000);
  });

  test('enhanced item equips correctly on character', () => {
    const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
    const sword = new Equipment(EquipmentSlot.Weapon, { name: 'Sword', tier: ItemTier.Normal, attackPower: 10 });
    sword.enhance();

    char.equip(sword);

    expect(char.getEquippedItem(EquipmentSlot.Weapon)?.enhanceLevel).toBe(1);
    expect(char.totalAttackPower).toBe(13);
  });
});
