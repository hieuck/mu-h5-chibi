import { Character, CharacterClass } from '../entities/character';
import { Equipment } from '../entities/equipment';
import { Team } from './team';
import { Inventory } from './inventory';
import { MapDatabase, GameMap } from './maps';
import { autoFarmTickWithLoot, LootResult } from './autoFarm';
import { Shop } from './shop';

export class GameSession {
  private _db: MapDatabase;
  private _team: Team;
  private _inventory: Inventory;
  private _currentMap: GameMap;
  private _itemResolver: (id: string) => Equipment | undefined;
  private _shop: Shop;

  constructor(
    mapDb: MapDatabase,
    itemResolver: (id: string) => Equipment | undefined,
    startingGold: number = 0,
  ) {
    this._db = mapDb;
    this._team = new Team();
    this._inventory = new Inventory();
    this._itemResolver = itemResolver;
    const maps = mapDb.all();
    this._currentMap = maps[0];
    this._startingGold = startingGold;
    this._shop = new Shop('General Store', [
      { id: 'hp_potion', name: 'HP Potion', price: 500 },
      { id: 'mana_potion', name: 'Mana Potion', price: 300 },
    ]);
  }

  private _startingGold: number;

  get teamSize(): number { return this._team.size; }
  get currentMapId(): string { return this._currentMap?.id ?? 'none'; }
  get inventorySize(): number { return this._inventory.size; }
  getGold(): number { return this._team.members[0]?.gold ?? 0; }
  getTeam(): Team { return this._team; }
  getTeamMember(index: number): Character { return this._team.members[index]; }

  addCharacter(name: string, className: string): void {
    const classMap: Record<string, CharacterClass> = {
      darkKnight: CharacterClass.DarkKnight,
      darkWizard: CharacterClass.DarkWizard,
      elf: CharacterClass.Elf,
      summoner: CharacterClass.Summoner,
      magicGladiator: CharacterClass.MagicGladiator,
    };
    const char = new Character({ name, class: classMap[className] || CharacterClass.DarkKnight });
    char.gold = this._startingGold;
    this._team.add(char);
  }

  farmTick(): LootResult {
    if (!this._currentMap?.areas?.length) return { loot: [], expGained: 0 };
    const area = this._currentMap.areas[0];
    return autoFarmTickWithLoot(this._team, area, this._inventory, this._itemResolver);
  }

  buyItem(itemId: string): void {
    const buyer = this._team.members[0];
    if (!buyer) throw new Error('No character in team');
    this._shop.buy(buyer, itemId, this._inventory, this._itemResolver);
  }

  getEquippableItems(slot?: string): Equipment[] {
    if (slot) return this._inventory.filterBySlot(slot as any);
    return this._inventory.list();
  }
}
