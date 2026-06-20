import { DropTable, DropEntry } from '../game/systems/loot';
import { ItemTier } from '../game/entities/equipment';

describe('Loot', () => {
  describe('drop table', () => {
    test('creates drop table with entries', () => {
      const table = new DropTable({
        entries: [
          { itemId: 'short_sword', chance: 0.5 },
          { itemId: 'healing_potion', chance: 0.3 },
        ],
      });

      expect(table.entries.length).toBe(2);
      expect(table.totalWeight).toBeCloseTo(0.8);
    });

    test('roll returns item when roll succeeds', () => {
      const table = new DropTable({
        entries: [
          { itemId: 'short_sword', chance: 1.0 },
        ],
      });

      const result = table.roll(0.5);

      expect(result).toBe('short_sword');
    });

    test('roll returns null when roll fails', () => {
      const table = new DropTable({
        entries: [
          { itemId: 'rare_sword', chance: 0.1 },
        ],
      });

      const result = table.roll(0.5);

      expect(result).toBeNull();
    });

    test('roll picks first matching entry by weight', () => {
      const table = new DropTable({
        entries: [
          { itemId: 'common', chance: 0.5 },
          { itemId: 'uncommon', chance: 0.3 },
          { itemId: 'rare', chance: 0.1 },
        ],
      });

      const result = table.roll(0.4);

      expect(result).toBe('common');
    });

    test('roll picks higher entries when below threshold', () => {
      const table = new DropTable({
        entries: [
          { itemId: 'common', chance: 0.5 },
          { itemId: 'uncommon', chance: 0.3 },
        ],
      });

      const result = table.roll(0.6);

      expect(result).toBe('uncommon');
    });

    test('roll returns null when random exceeds all chances', () => {
      const table = new DropTable({
        entries: [
          { itemId: 'common', chance: 0.5 },
        ],
      });

      const result = table.roll(0.9);

      expect(result).toBeNull();
    });
  });

  describe('monster drops', () => {
    test('monster has drop table', () => {
      const table = new DropTable({
        entries: [
          { itemId: 'bone', chance: 0.8 },
        ],
      });

      expect(table.entries[0].itemId).toBe('bone');
    });
  });
});
