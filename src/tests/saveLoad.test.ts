import { Character, CharacterClass } from '../game/entities/character';
import { Equipment, EquipmentSlot, ItemTier } from '../game/entities/equipment';
import { Inventory } from '../game/systems/inventory';

describe('SaveLoad', () => {
  test('serialize character to JSON', () => {
    const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
    char.addExp(200);
    char.allocateStat('strength', 3);
    char.gold = 500;

    const data = JSON.stringify({ name: char.name, class: char.class, level: char.level, exp: char.experience, gold: char.gold, stats: char.stats, availableStatPoints: char.availableStatPoints });

    const parsed = JSON.parse(data);
    expect(parsed.name).toBe('DK');
    expect(parsed.level).toBe(2);
    expect(parsed.gold).toBe(500);
    expect(parsed.stats.strength).toBe(31);
  });

  test('serialize equipment with enhancement', () => {
    const sword = new Equipment(EquipmentSlot.Weapon, { name: 'Fire Sword', tier: ItemTier.Rare, attackPower: 30, value: 1000 });
    sword.enhance();
    sword.enhance();

    const data = JSON.stringify({ name: sword.name, tier: sword.tier, attackPower: sword.attackPower, enhanceLevel: sword.enhanceLevel, value: sword.value });
    const parsed = JSON.parse(data);

    expect(parsed.name).toBe('Fire Sword');
    expect(parsed.enhanceLevel).toBe(2);
    expect(parsed.attackPower).toBe(36);
    expect(parsed.value).toBeGreaterThan(1000);
  });

  test('save and restore character level and exp', () => {
    const char = new Character({ name: 'DW', class: CharacterClass.DarkWizard });
    for (let i = 0; i < 10; i++) char.addExp(char.level * 100);

    const saved = { level: char.level, exp: char.experience, stats: char.stats, points: char.availableStatPoints };

    const restored = new Character({ name: 'DW', class: CharacterClass.DarkWizard });
    while (restored.level < saved.level) restored.addExp(restored.level * 100);
    // Re-allocate stats
    Object.entries(saved.stats).forEach(([stat, val]) => {
      const base = new Character({ name: '', class: CharacterClass.DarkWizard }).stats[stat as keyof typeof saved.stats];
      const diff = val as number - base;
      if (diff > 0) restored.allocateStat(stat as any, diff);
    });

    expect(restored.level).toBe(saved.level);
    expect(restored.stats.strength).toBe(saved.stats.strength);
  });
});
