import { Shop, ShopItem } from '../game/systems/shop';
import { Equipment, EquipmentSlot, ItemTier } from '../game/entities/equipment';
import { Character, CharacterClass } from '../game/entities/character';
import { Inventory } from '../game/systems/inventory';

describe('Shop', () => {
  describe('shop items', () => {
    test('creates shop with items for sale', () => {
      const potion = { id: 'hp_potion', name: 'HP Potion', price: 500 };
      const shop = new Shop('Potion Shop', [potion]);

      expect(shop.name).toBe('Potion Shop');
      expect(shop.items.length).toBe(1);
      expect(shop.items[0].price).toBe(500);
    });

    test('shows items sorted by price', () => {
      const shop = new Shop('General Store', [
        { id: 'sword', name: 'Sword', price: 2000 },
        { id: 'potion', name: 'Potion', price: 500 },
        { id: 'armor', name: 'Armor', price: 5000 },
      ]);

      const items = shop.getItemsSorted();
      expect(items[0].id).toBe('potion');
      expect(items[1].id).toBe('sword');
      expect(items[2].id).toBe('armor');
    });
  });

  describe('buying', () => {
    test('buy item with enough gold removes gold and adds to inventory', () => {
      const shop = new Shop('Weapon Shop', [
        { id: 'short_sword', name: 'Short Sword', price: 1000 },
      ]);
      const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
      char.gold = 2000;
      const inventory = new Inventory();
      const itemResolver = (id: string): Equipment | undefined => {
        if (id === 'short_sword') return new Equipment(EquipmentSlot.Weapon, { name: 'Short Sword', tier: ItemTier.Normal, attackPower: 10, value: 1000 });
        return undefined;
      };

      shop.buy(char, 'short_sword', inventory, itemResolver);

      expect(char.gold).toBe(1000);
      expect(inventory.size).toBe(1);
    });

    test('cannot buy item with insufficient gold', () => {
      const shop = new Shop('Weapon Shop', [
        { id: 'short_sword', name: 'Short Sword', price: 1000 },
      ]);
      const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
      char.gold = 500;

      expect(() => shop.buy(char, 'short_sword', new Inventory(), () => undefined)).toThrow('Not enough gold');
    });
  });

  describe('selling', () => {
    test('sell item gives half price gold', () => {
      const shop = new Shop('Weapon Shop', [
        { id: 'short_sword', name: 'Short Sword', price: 1000 },
      ]);
      const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
      char.gold = 0;
      const item = new Equipment(EquipmentSlot.Weapon, { name: 'Short Sword', tier: ItemTier.Normal, attackPower: 10, value: 1000 });

      shop.sell(char, item);

      expect(char.gold).toBe(500);
    });
  });
});
