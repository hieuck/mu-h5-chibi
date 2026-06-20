import { GameSession } from '../game/systems/gameSession';
import { MapDatabase, GameMap } from '../game/systems/maps';
import { FarmArea } from '../game/systems/autoFarm';
import { Monster } from '../game/entities/monster';
import { DropTable } from '../game/systems/loot';
import { Equipment, EquipmentSlot, ItemTier } from '../game/entities/equipment';

describe('GameSession', () => {
  test('creates session with team and starter map', () => {
    const db = new MapDatabase();
    const area = new FarmArea({
      name: 'Training Field',
      monsters: [new Monster({ name: 'Goblin', hp: 30, defense: 2, level: 1 })],
      recommendedLevel: 1,
    });
    db.register(new GameMap({ id: 'brave', name: 'Brave Grounds', requiredLevel: 1, areas: [area] }));
    const itemResolver = (_id: string) => new Equipment(EquipmentSlot.Weapon, { name: 'Test Sword', tier: ItemTier.Normal, attackPower: 5 });

    const session = new GameSession(db, itemResolver);
    session.addCharacter('DK', 'darkKnight');
    session.addCharacter('DW', 'darkWizard');

    expect(session.teamSize).toBe(2);
    expect(session.currentMapId).toBe('brave');
  });

  test('farm tick gives exp and loot', () => {
    const goblin = new Monster({ name: 'Goblin', hp: 5, defense: 0, level: 1 });
    goblin.dropTable = new DropTable({ entries: [{ itemId: 'short_sword', chance: 1.0 }] });
    const area = new FarmArea({ name: 'Field', monsters: [goblin], recommendedLevel: 1 });
    const db = new MapDatabase();
    db.register(new GameMap({ id: 'brave', name: 'Brave Grounds', requiredLevel: 1, areas: [area] }));
    const itemResolver = (id: string) => {
      if (id === 'short_sword') return new Equipment(EquipmentSlot.Weapon, { name: 'Short Sword', tier: ItemTier.Normal, attackPower: 10, value: 500 });
      return undefined;
    };

    const session = new GameSession(db, itemResolver);
    session.addCharacter('DK', 'darkKnight');

    let result = session.farmTick();
    let ticks = 1;
    while (result.expGained === 0 && ticks < 10) {
      result = session.farmTick();
      ticks++;
    }

    expect(result.expGained).toBeGreaterThan(0);
    expect(session.inventorySize).toBeGreaterThan(0);
  });

  test('can buy from shop', () => {
    const db = new MapDatabase();
    const area = new FarmArea({ name: 'Field', monsters: [new Monster({ name: 'Goblin', hp: 30, defense: 2, level: 1 })], recommendedLevel: 1 });
    db.register(new GameMap({ id: 'brave', name: 'Brave Grounds', requiredLevel: 1, areas: [area] }));
    const itemResolver = (id: string) => {
      if (id === 'hp_potion') return new Equipment(EquipmentSlot.Accessory, { name: 'HP Potion', tier: ItemTier.Normal, attackPower: 0, value: 500 });
      return undefined;
    };
    const session = new GameSession(db, itemResolver, 2000);
    session.addCharacter('DK', 'darkKnight');

    session.buyItem('hp_potion');

    expect(session.getGold()).toBe(1500);
    expect(session.inventorySize).toBe(1);
  });
});
