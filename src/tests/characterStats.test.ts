import { Character, CharacterClass } from '../game/entities/character';
import { formatCharacterStats } from '../game/systems/gameRenderer';
import { Equipment, EquipmentSlot, ItemTier } from '../game/entities/equipment';

describe('CharacterStatsPanel', () => {
  describe('format stats display', () => {
    test('shows all core stats', () => {
      const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });

      const display = formatCharacterStats(char);

      expect(display).toContain('STR:28');
      expect(display).toContain('AGI:20');
      expect(display).toContain('STA:25');
      expect(display).toContain('ENE:10');
    });

    test('shows attack and defense', () => {
      const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });

      const display = formatCharacterStats(char);

      expect(display).toContain('ATK');
      expect(display).toContain('DEF');
    });

    test('updates after stat allocation', () => {
      const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
      char.addExp(500);

      char.allocateStat('strength', 5);
      const display = formatCharacterStats(char);

      expect(display).toContain('STR:33');
    });
  });

  describe('stat calculation', () => {
    test('total stats include equipment bonuses', () => {
      const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
      const ring = new Equipment(EquipmentSlot.Accessory, { name: 'Ring', tier: ItemTier.Magic, attackPower: 5, statBonuses: { strength: 3 } });
      char.equip(ring);

      const display = formatCharacterStats(char);

      expect(display).toContain('STR:31');
      expect(display).toContain('ATK:5');
    });
  });
});
