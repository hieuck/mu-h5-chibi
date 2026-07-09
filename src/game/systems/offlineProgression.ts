import { GameSession } from './gameSession';
import { LootResult } from './autoFarm';
import { SkillProvider } from './gameSession';

export interface OfflineProgressionOptions {
  tickMs: number;
  maxOfflineMs: number;
}

const DEFAULT_OPTIONS: OfflineProgressionOptions = {
  tickMs: 2000,
  maxOfflineMs: 8 * 60 * 60 * 1000, // 8 hours
};

export class OfflineProgressionSimulator {
  private options: OfflineProgressionOptions;

  constructor(
    private skillProvider?: SkillProvider,
    options?: Partial<OfflineProgressionOptions>,
  ) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  calculateElapsedMs(savedAt: number | undefined, now: number): number {
    if (!savedAt) return 0;
    return Math.max(0, now - savedAt);
  }

  simulate(session: GameSession, elapsedMs: number): LootResult {
    const cappedElapsed = Math.min(elapsedMs, this.options.maxOfflineMs);
    const ticks = Math.floor(cappedElapsed / this.options.tickMs);

    const total: LootResult = { loot: [], expGained: 0 };
    for (let i = 0; i < ticks; i++) {
      const result = session.farmTick(this.skillProvider);
      total.expGained += result.expGained;
      total.loot.push(...result.loot);
    }
    return total;
  }

  apply(session: GameSession, elapsedMs: number): LootResult {
    return this.simulate(session, elapsedMs);
  }
}
