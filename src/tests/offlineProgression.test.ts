import { OfflineProgressionSimulator } from '../game/systems/offlineProgression';
import { GameSession } from '../game/systems/gameSession';
import { ItemDatabase } from '../game/data/itemDatabase';
import { MapDatabase } from '../game/systems/maps';
import { createGameMaps } from '../game/data/gameMaps';

function totalExperience(char: { experience: number; level: number }): number {
  // Approximate total EXP: sum of thresholds for passed levels plus current exp
  let total = char.experience;
  for (let l = 1; l < char.level; l++) {
    total += l * 100;
  }
  return total;
}

describe('OfflineProgressionSimulator', () => {
  const itemDb = new ItemDatabase();
  const { db: mapDb } = createGameMaps();
  const itemResolver = (id: string) => itemDb.resolveItem(id);

  function createSession(): GameSession {
    const session = new GameSession(mapDb, itemResolver);
    session.addCharacter('Hero', 'darkKnight');
    return session;
  }

  test('returns zero rewards for zero elapsed time', () => {
    const sim = new OfflineProgressionSimulator();
    const session = createSession();
    const result = sim.simulate(session, 0);

    expect(result.expGained).toBe(0);
    expect(result.loot.length).toBe(0);
  });

  test('rewards increase with elapsed time', () => {
    const sim = new OfflineProgressionSimulator(undefined, { tickMs: 1000, maxOfflineMs: 60 * 1000 });
    const session = createSession();
    const result = sim.simulate(session, 5000);

    expect(result.expGained).toBeGreaterThan(0);
  });

  test('caps rewards at maxOfflineMs', () => {
    const sim = new OfflineProgressionSimulator(undefined, { tickMs: 1000, maxOfflineMs: 3000 });
    const session = createSession();
    const result = sim.simulate(session, 60 * 1000); // way over cap

    // Should simulate at most 3 ticks
    expect(result.expGained).toBeLessThanOrEqual(3 * 50 * 4); // 3 ticks * 50 exp * 4 chars
  });

  test('apply progresses session characters', () => {
    const sim = new OfflineProgressionSimulator(undefined, { tickMs: 1000, maxOfflineMs: 60 * 1000 });
    const session = createSession();
    const before = totalExperience(session.getTeamMember(0));

    sim.apply(session, 5000);

    expect(totalExperience(session.getTeamMember(0))).toBeGreaterThan(before);
  });

  test('calculates elapsed ms from timestamps', () => {
    const now = Date.now();
    const sim = new OfflineProgressionSimulator();
    expect(sim.calculateElapsedMs(now - 10000, now)).toBe(10000);
    expect(sim.calculateElapsedMs(now - 10000, now - 2000)).toBe(8000);
    expect(sim.calculateElapsedMs(undefined, now)).toBe(0);
  });
});
