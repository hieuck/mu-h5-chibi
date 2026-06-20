import { FarmArea } from './autoFarm';
import { Character } from '../entities/character';

export interface GameMapOptions {
  id: string;
  name: string;
  requiredLevel: number;
  areas: FarmArea[];
}

export class GameMap {
  readonly id: string;
  readonly name: string;
  readonly requiredLevel: number;
  readonly areas: FarmArea[];

  constructor(options: GameMapOptions) {
    this.id = options.id;
    this.name = options.name;
    this.requiredLevel = options.requiredLevel;
    this.areas = options.areas;
  }

  isUnlocked(character: Character): boolean {
    return character.level >= this.requiredLevel;
  }
}

export class MapDatabase {
  private _maps: GameMap[] = [];

  register(...maps: GameMap[]): void {
    for (const map of maps) {
      this._maps.push(map);
    }
  }

  get(id: string): GameMap | undefined {
    return this._maps.find(m => m.id === id);
  }

  getUnlockedMaps(character: Character): GameMap[] {
    return this._maps.filter(m => m.isUnlocked(character));
  }

  getNextMap(character: Character): GameMap | undefined {
    return this._maps.find(m => !m.isUnlocked(character));
  }

  all(): GameMap[] {
    return [...this._maps];
  }
}
