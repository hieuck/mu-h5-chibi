import { Character, CharacterClass } from '../game/entities/character';
import { Equipment, EquipmentSlot, ItemTier } from '../game/entities/equipment';

describe('Gem Socket', () => {
  test('equipment starts with 0 sockets', () => {
    const sword = new Equipment(EquipmentSlot.Weapon, { name: 'Sword', tier: ItemTier.Normal, attackPower: 10 });
    expect(sword.socketCount).toBe(0);
    expect(sword.sockets.length).toBe(0);
  });

  test('rare+ items have socket slots', () => {
    const normal = new Equipment(EquipmentSlot.Weapon, { name: 'N', tier: ItemTier.Normal, attackPower: 5 });
    const magic = new Equipment(EquipmentSlot.Weapon, { name: 'M', tier: ItemTier.Magic, attackPower: 10 });
    const rare = new Equipment(EquipmentSlot.Weapon, { name: 'R', tier: ItemTier.Rare, attackPower: 20 });

    expect(normal.maxSockets).toBe(0);
    expect(magic.maxSockets).toBe(1);
    expect(rare.maxSockets).toBe(2);
  });

  test('socket gems add stats', () => {
    const sword = new Equipment(EquipmentSlot.Weapon, { name: 'Sword', tier: ItemTier.Rare, attackPower: 20 });
    sword.addSocket('strength');

    expect(sword.sockets.length).toBe(1);
    expect(sword.sockets[0]).toBe('strength');
    expect(sword.statBonuses?.strength).toBe(4);
  });

  test('cannot add more gems than max sockets', () => {
    const sword = new Equipment(EquipmentSlot.Weapon, { name: 'Sword', tier: ItemTier.Magic, attackPower: 10 });

    sword.addSocket('strength');
    expect(() => sword.addSocket('agility')).toThrow('No free sockets');
  });

  test('gem effects apply to character stats when equipped', () => {
    const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
    const sword = new Equipment(EquipmentSlot.Weapon, { name: 'Sword', tier: ItemTier.Rare, attackPower: 20 });
    sword.addSocket('strength');

    char.equip(sword);

    expect(char.stats.strength).toBe(32);
  });

  test('ancient tier items have 3 max sockets', () => {
    const ancient = new Equipment(EquipmentSlot.Weapon, { name: 'A', tier: ItemTier.Ancient, attackPower: 50 });

    expect(ancient.maxSockets).toBe(3);
  });
});
