import { Equipment, EquipmentSlot } from '../entities/equipment';

const DEFAULT_MAX_SLOTS = 40;

export class Inventory {
  private _items: Equipment[];
  readonly maxSlots: number;

  constructor(maxSlots: number = DEFAULT_MAX_SLOTS) {
    this.maxSlots = maxSlots;
    this._items = [];
  }

  get size(): number {
    return this._items.length;
  }

  get isFull(): boolean {
    return this._items.length >= this.maxSlots;
  }

  add(item: Equipment): void {
    if (this.isFull) throw new Error('Inventory is full');
    this._items.push(item);
  }

  get(index: number): Equipment | undefined {
    return this._items[index];
  }

  remove(index: number): Equipment | undefined {
    if (index < 0 || index >= this._items.length) return undefined;
    return this._items.splice(index, 1)[0];
  }

  removeAt(index: number): Equipment | undefined {
    if (index < 0 || index >= this._items.length) return undefined;
    const item = this._items[index];
    this._items[index] = this._items[this._items.length - 1];
    this._items.pop();
    return item;
  }

  list(): Equipment[] {
    return [...this._items];
  }

  filterBySlot(slot: EquipmentSlot): Equipment[] {
    return this._items.filter(item => item.slot === slot);
  }
}
