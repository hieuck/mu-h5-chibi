import { ItemDatabase } from '../game/data/itemDatabase';
import { EquipmentSlot, ItemTier } from '../game/entities/equipment';
import { CharacterClass } from '../game/entities/character';

describe('ItemDatabase', () => {
  test('creates default item database', () => {
    const db = new ItemDatabase();

    expect(db.allItems().length).toBeGreaterThan(0);
  });

  test('getItem returns item by id', () => {
    const db = new ItemDatabase();

    const item = db.getItem('short_sword');

    expect(item?.name).toBe('Short Sword');
    expect(item?.slot).toBe(EquipmentSlot.Weapon);
  });

  test('getItemsByLevel returns items within range', () => {
    const db = new ItemDatabase();

    const lowItems = db.getItemsByLevel(1, 10);

    expect(lowItems.length).toBeGreaterThan(0);
    expect(lowItems.every(i => i.requiredLevel <= 10)).toBe(true);
  });

  test('getItemsBySlot filters by equipment slot', () => {
    const db = new ItemDatabase();

    const weapons = db.getItemsBySlot(EquipmentSlot.Weapon);

    expect(weapons.every(i => i.slot === EquipmentSlot.Weapon)).toBe(true);
  });

  test('getSetItems returns all pieces of a set', () => {
    const db = new ItemDatabase();

    const adamantine = db.getSetItems('Adamantine');

    expect(adamantine.length).toBeGreaterThanOrEqual(2);
    expect(adamantine.every(i => i.set === 'Adamantine')).toBe(true);
  });

  test('getItemsByClass filters items for specific class', () => {
    const db = new ItemDatabase();

    const dkItems = db.getItemsByClass(CharacterClass.DarkKnight);

    expect(dkItems.every(i => i.requiredClass === CharacterClass.DarkKnight)).toBe(true);
  });

  test('getMobDrops returns items a monster can drop', () => {
    const db = new ItemDatabase();

    const drops = db.getMobDrops('goblin');

    expect(drops.length).toBeGreaterThan(0);
  });

  test('resolveItem creates Equipment from item id', () => {
    const db = new ItemDatabase();

    const equip = db.resolveItem('short_sword');

    expect(equip?.name).toBe('Short Sword');
    expect(equip?.attackPower).toBe(12);
    expect(equip?.value).toBe(300);
  });

  test('resolveItem returns undefined for unknown id', () => {
    const db = new ItemDatabase();

    const equip = db.resolveItem('unknown_item');

    expect(equip).toBeUndefined();
  });

  test('getShopItems returns items available in shop', () => {
    const db = new ItemDatabase();

    const items = db.getShopItems();

    expect(items.length).toBeGreaterThan(0);
  });
});
