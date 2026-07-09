import { SaveLoadManager } from '../game/systems/saveLoadManager';
import { GameSession } from '../game/systems/gameSession';
import { CharacterClass } from '../game/entities/character';
import { createWeapon, createArmor, EquipmentSlot, ItemTier } from '../game/entities/equipment';
import { MapDatabase } from '../game/systems/maps';
import { ItemDatabase } from '../game/data/itemDatabase';

describe('SaveLoadManager', () => {
  const mapDb = new MapDatabase();
  const itemDb = new ItemDatabase();
  const itemResolver = (id: string) => itemDb.resolveItem(id);
  const manager = new SaveLoadManager(mapDb, itemResolver);

  function createSampleSession(startingGold = 1000): GameSession {
    const session = new GameSession(mapDb, itemResolver, startingGold);
    session.addCharacter('Hero', 'darkKnight');
    return session;
  }

  beforeEach(() => {
    localStorage.clear();
  });

  test('serializes and deserializes team member basics', () => {
    const session = createSampleSession();
    const json = manager.serialize(session);
    const restored = manager.deserialize(json);

    const hero = restored.getTeamMember(0);
    expect(hero.name).toBe('Hero');
    expect(hero.class).toBe(CharacterClass.DarkKnight);
    expect(hero.gold).toBe(1000);
  });

  test('serializes and deserializes equipped items', () => {
    const session = createSampleSession();
    const sword = createWeapon({ name: 'Test Sword', tier: ItemTier.Rare, attackPower: 50, value: 1000 });
    session.getTeamMember(0).equip(sword);

    const json = manager.serialize(session);
    const restored = manager.deserialize(json);

    const weapon = restored.getTeamMember(0).getEquippedItem(EquipmentSlot.Weapon);
    expect(weapon).toBeDefined();
    expect(weapon!.name).toBe('Test Sword');
    expect(weapon!.attackPower).toBe(50);
    expect(weapon!.tier).toBe(ItemTier.Rare);
  });

  test('serializes and deserializes inventory', () => {
    const session = createSampleSession();
    const helm = createArmor({ name: 'Test Helm', tier: ItemTier.Magic, defense: 10, value: 500 });
    session.getInventory().add(helm);

    const json = manager.serialize(session);
    const restored = manager.deserialize(json);

    expect(restored.getInventory().size).toBe(1);
    expect(restored.getInventory().get(0)!.name).toBe('Test Helm');
  });

  test('persists to and loads from localStorage', () => {
    const session = createSampleSession();
    manager.saveToStorage(session);

    const loaded = manager.loadFromStorage();
    expect(loaded).toBeDefined();
    expect(loaded!.getTeamMember(0).name).toBe('Hero');
  });

  test('returns undefined when no save exists in localStorage', () => {
    expect(manager.loadFromStorage()).toBeUndefined();
  });

  test('returns undefined for corrupted localStorage data', () => {
    localStorage.setItem('mu-chibi-squad-save', 'not-json');
    expect(manager.loadFromStorage()).toBeUndefined();
  });
});
