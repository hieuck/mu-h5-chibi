import { GameSession } from './gameSession';
import { Character, CharacterClass, CharacterOptions } from '../entities/character';
import { Equipment, EquipmentSlot, WeaponOptions, ItemTier, RequiredStats } from '../entities/equipment';
import { Inventory } from './inventory';
import { MapDatabase } from './maps';
import { BaseStats } from '../types';

const SAVE_KEY = 'mu-chibi-squad-save';
const SAVE_VERSION = 1;

interface SavedEquipment {
  slot: EquipmentSlot;
  name: string;
  tier: ItemTier;
  attackPower: number;
  defense: number;
  requiredLevel: number;
  requiredStats: RequiredStats;
  statBonuses?: Partial<BaseStats>;
  set?: string;
  requiredClass?: string;
  attackPowerPercent: number;
  hpBonus: number;
  value: number;
  enhanceLevel: number;
  sockets: string[];
}

interface SavedCharacter {
  name: string;
  class: CharacterClass;
  level: number;
  experience: number;
  stats: BaseStats;
  unspentStatPoints: number;
  gold: number;
  resetCount: number;
  equipment: Partial<Record<EquipmentSlot, SavedEquipment>>;
}

interface SavedGameSession {
  version: number;
  characters: SavedCharacter[];
  inventory: SavedEquipment[];
  currentMapId: string;
}

export class SaveLoadManager {
  constructor(
    private mapDb: MapDatabase,
    private itemResolver: (id: string) => Equipment | undefined,
  ) {}

  serialize(session: GameSession): string {
    const data: SavedGameSession = {
      version: SAVE_VERSION,
      characters: session.getTeam().members.map(char => this._serializeCharacter(char)),
      inventory: session.getInventory().list().map(item => this._serializeEquipment(item)),
      currentMapId: session.currentMapId,
    };
    return JSON.stringify(data);
  }

  deserialize(json: string): GameSession {
    const data: SavedGameSession = JSON.parse(json);
    const session = new GameSession(this.mapDb, this.itemResolver);

    for (const saved of data.characters) {
      const char = new Character({ name: saved.name, class: saved.class });
      char.level = saved.level;
      char.experience = saved.experience;
      char.stats = { ...saved.stats };
      char.gold = saved.gold;
      char.setUnspentStatPoints(saved.unspentStatPoints);
      char.setResetCount(saved.resetCount);

      for (const [slot, savedItem] of Object.entries(saved.equipment)) {
        if (savedItem) {
          char.equip(this._deserializeEquipment(savedItem));
        }
      }

      session.getTeam().add(char);
    }

    for (const savedItem of data.inventory) {
      session.getInventory().add(this._deserializeEquipment(savedItem));
    }

    session.setCurrentMap(data.currentMapId);
    return session;
  }

  saveToStorage(session: GameSession): void {
    localStorage.setItem(SAVE_KEY, this.serialize(session));
  }

  loadFromStorage(): GameSession | undefined {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return undefined;
    try {
      return this.deserialize(raw);
    } catch {
      return undefined;
    }
  }

  private _serializeCharacter(char: Character): SavedCharacter {
    const equipment: Partial<Record<EquipmentSlot, SavedEquipment>> = {};
    for (const slot of Object.values(EquipmentSlot)) {
      const item = char.getEquippedItem(slot);
      if (item) {
        equipment[slot] = this._serializeEquipment(item);
      }
    }

    return {
      name: char.name,
      class: char.class,
      level: char.level,
      experience: char.experience,
      stats: { ...char.stats },
      unspentStatPoints: char.availableStatPoints,
      gold: char.gold,
      resetCount: char.resetCount,
      equipment,
    };
  }

  private _serializeEquipment(item: Equipment): SavedEquipment {
    return {
      slot: item.slot,
      name: item.name,
      tier: item.tier,
      attackPower: item.attackPower,
      defense: item.defense,
      requiredLevel: item.requiredLevel,
      requiredStats: { ...item.requiredStats },
      statBonuses: item.statBonuses ? { ...item.statBonuses } : undefined,
      set: item.set,
      requiredClass: item.requiredClass,
      attackPowerPercent: item.attackPowerPercent,
      hpBonus: item.hpBonus,
      value: item.value,
      enhanceLevel: item.enhanceLevel,
      sockets: [...item.sockets],
    };
  }

  private _deserializeEquipment(saved: SavedEquipment): Equipment {
    const options: WeaponOptions = {
      name: saved.name,
      tier: saved.tier,
      attackPower: saved.attackPower,
      defense: saved.defense,
      requiredLevel: saved.requiredLevel,
      requiredStrength: saved.requiredStats.strength,
      requiredAgility: saved.requiredStats.agility,
      statBonuses: saved.statBonuses ? { ...saved.statBonuses } : undefined,
      set: saved.set,
      requiredClass: saved.requiredClass,
      attackPowerPercent: saved.attackPowerPercent,
      hpBonus: saved.hpBonus,
      value: saved.value,
    };
    const item = new Equipment(saved.slot, options);
    // Restore mutable state not in constructor
    for (let i = 0; i < saved.enhanceLevel; i++) {
      item.enhance();
    }
    for (const socket of saved.sockets) {
      item.addSocket(socket);
    }
    return item;
  }
}
