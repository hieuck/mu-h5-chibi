import { GameSession } from './gameSession';
import { SaveLoadManager } from './saveLoadManager';
import { MapDatabase } from './maps';
import { ItemDatabase } from '../data/itemDatabase';

export class GameSessionPersistence {
  private manager: SaveLoadManager;

  constructor(mapDb: MapDatabase, itemDb: ItemDatabase) {
    this.manager = new SaveLoadManager(mapDb, (id) => itemDb.resolveItem(id));
  }

  load(): GameSession | undefined {
    return this.manager.loadFromStorage();
  }

  save(session: GameSession): void {
    this.manager.saveToStorage(session);
  }
}
