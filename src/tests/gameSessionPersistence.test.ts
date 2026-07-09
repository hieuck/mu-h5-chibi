import { GameSessionPersistence } from '../game/systems/gameSessionPersistence';
import { GameSession } from '../game/systems/gameSession';
import { ItemDatabase } from '../game/data/itemDatabase';
import { MapDatabase } from '../game/systems/maps';

describe('GameSessionPersistence', () => {
  const itemDb = new ItemDatabase();
  const mapDb = new MapDatabase();
  const persistence = new GameSessionPersistence(mapDb, itemDb);

  beforeEach(() => {
    localStorage.clear();
  });

  test('load returns undefined when no save exists', () => {
    expect(persistence.load()).toBeUndefined();
  });

  test('save and load roundtrips team and inventory', () => {
    const session = new GameSession(mapDb, (id) => itemDb.resolveItem(id), 500);
    session.addCharacter('Hero', 'darkKnight');
    session.getTeamMember(0).gold = 9999;

    persistence.save(session);
    const loaded = persistence.load();

    expect(loaded).toBeDefined();
    expect(loaded!.getTeamMember(0).name).toBe('Hero');
    expect(loaded!.getTeamMember(0).gold).toBe(9999);
  });

  test('load returns undefined for corrupted save', () => {
    localStorage.setItem('mu-chibi-squad-save', 'invalid-json');
    expect(persistence.load()).toBeUndefined();
  });
});
