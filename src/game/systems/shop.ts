import { Character } from '../entities/character';
import { Equipment } from '../entities/equipment';
import { Inventory } from './inventory';

export interface ShopItem {
  id: string;
  name: string;
  price: number;
}

export class Shop {
  readonly name: string;
  readonly items: ShopItem[];

  constructor(name: string, items: ShopItem[]) {
    this.name = name;
    this.items = items;
  }

  getItemsSorted(): ShopItem[] {
    return [...this.items].sort((a, b) => a.price - b.price);
  }

  buy(
    buyer: Character,
    itemId: string,
    inventory: Inventory,
    itemResolver: (itemId: string) => Equipment | undefined,
  ): void {
    const shopItem = this.items.find(i => i.id === itemId);
    if (!shopItem) throw new Error('Item not found');
    if (buyer.gold < shopItem.price) throw new Error('Not enough gold');

    const item = itemResolver(itemId);
    if (!item) throw new Error('Item definition not found');

    buyer.gold -= shopItem.price;
    inventory.add(item);
  }

  sell(seller: Character, item: Equipment): void {
    seller.gold += Math.max(10, Math.floor(item.value / 2));
  }
}
