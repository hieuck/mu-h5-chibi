import { Equipment, EquipmentSlot, ItemTier } from '../game/entities/equipment';
import { Character, CharacterClass } from '../game/entities/character';

describe('ItemTooltip', () => {
  function formatTooltip(item: Equipment, char?: Character): string[] {
    const lines: string[] = [];
    lines.push(`${item.tier === ItemTier.Normal ? '' : `+${item.enhanceLevel} `}${item.name}`);
    lines.push(`Tier: ${item.tier} | Slot: ${item.slot}`);
    if (item.attackPower > 0) lines.push(`ATK: ${item.attackPower}`);
    if (item.defense > 0) lines.push(`DEF: ${item.defense}`);
    if (item.requiredLevel > 1) lines.push(`Required Lv.${item.requiredLevel}`);
    if (item.value > 0) lines.push(`Value: ${item.value} gold`);
    if (char) {
      const current = char.getEquippedItem(item.slot);
      if (current) {
        const curPower = current.attackPower + current.defense;
        const newPower = item.attackPower + item.defense;
        lines.push(newPower > curPower ? '⬆ UPGRADE' : '⬇ WEAKER');
      }
    }
    return lines;
  }

  test('shows item name and tier', () => {
    const sword = new Equipment(EquipmentSlot.Weapon, { name: 'Iron Sword', tier: ItemTier.Normal, attackPower: 10 });

    const tip = formatTooltip(sword);

    expect(tip[0]).toContain('Iron Sword');
    expect(tip[1]).toContain('normal');
  });

  test('shows attack and defense stats', () => {
    const item = new Equipment(EquipmentSlot.Weapon, { name: 'Blade', tier: ItemTier.Rare, attackPower: 50, defense: 5 });

    const tip = formatTooltip(item);

    expect(tip.some(l => l.includes('ATK: 50'))).toBe(true);
    expect(tip.some(l => l.includes('DEF: 5'))).toBe(true);
  });

  test('compares to equipped item', () => {
    const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
    char.equip(new Equipment(EquipmentSlot.Weapon, { name: 'Old', tier: ItemTier.Normal, attackPower: 5 }));
    const newSword = new Equipment(EquipmentSlot.Weapon, { name: 'New', tier: ItemTier.Magic, attackPower: 20 });

    const tip = formatTooltip(newSword, char);

    expect(tip.some(l => l.includes('UPGRADE'))).toBe(true);
  });

  test('shows weaker for downgrade', () => {
    const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
    char.equip(new Equipment(EquipmentSlot.Weapon, { name: 'Old', tier: ItemTier.Rare, attackPower: 50 }));
    const worse = new Equipment(EquipmentSlot.Weapon, { name: 'Worse', tier: ItemTier.Normal, attackPower: 5 });

    const tip = formatTooltip(worse, char);

    expect(tip.some(l => l.includes('WEAKER'))).toBe(true);
  });

  test('enhanced item shows +N', () => {
    const sword = new Equipment(EquipmentSlot.Weapon, { name: 'Sword', tier: ItemTier.Magic, attackPower: 10 });
    sword.enhance();
    sword.enhance();

    const tip = formatTooltip(sword);

    expect(tip[0]).toContain('+2');
  });
});
