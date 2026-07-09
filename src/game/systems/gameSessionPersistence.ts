import { GameSession } from './gameSession';
import { SaveLoadManager } from './saveLoadManager';
import { MapDatabase } from './maps';
import { ItemDatabase } from '../data/itemDatabase';
import { OfflineProgressionSimulator } from './offlineProgression';

export class GameSessionPersistence {
  private manager: SaveLoadManager;

  constructor(mapDb: MapDatabase, itemDb: ItemDatabase) {
    this.manager = new SaveLoadManager(mapDb, (id) => itemDb.resolveItem(id));
  }

  load(): GameSession | undefined {
    const raw = this.manager.loadFromStorageWithTimestamp();
    if (!raw) return undefined;
    const { session, savedAt } = raw;
    const simulator = new OfflineProgressionSimulator();
    const elapsed = simulator.calculateElapsedMs(savedAt, Date.now());
    if (elapsed > 0) {
      simulator.apply(session, elapsed);
    }
    return session;
  }

  save(session: GameSession): void {
    this.manager.saveToStorage(session);
  }
}
