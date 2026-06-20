import { Character, CharacterClass } from '../game/entities/character';
import { Team } from '../game/systems/team';
import { FarmArea, autoFarmTickWithLoot } from '../game/systems/autoFarm';
import { Monster } from '../game/entities/monster';
import { Inventory } from '../game/systems/inventory';
import { DropTable } from '../game/systems/loot';
import { Equipment, EquipmentSlot, ItemTier } from '../game/entities/equipment';

const testItemResolver = (id: string): Equipment | undefined => {
  if (id === 'short_sword') return new Equipment(EquipmentSlot.Weapon, { name: 'Short Sword', tier: ItemTier.Normal, attackPower: 5 });
  return undefined;
};

describe('AutoFarm with Loot', () => {
  test('collects item when monster dies', () => {
    const goblin = new Monster({ name: 'Goblin', hp: 5, defense: 0, level: 1 });
    goblin.dropTable = new DropTable({
      entries: [{ itemId: 'short_sword', chance: 1.0 }],
    });
    const area = new FarmArea({
      name: 'Test', monsters: [goblin], recommendedLevel: 1,
    });
    const team = new Team();
    team.add(new Character({ name: 'DK', class: CharacterClass.DarkKnight }));
    const inventory = new Inventory();

    const result = autoFarmTickWithLoot(team, area, inventory, testItemResolver);

    expect(result.loot.length).toBe(1);
    expect(result.loot[0]).toBe('short_sword');
    expect(inventory.size).toBe(1);
  });

  test('no loot when monster does not die', () => {
    const tank = new Monster({ name: 'Tank', hp: 999, defense: 0, level: 1 });
    const area = new FarmArea({
      name: 'Test', monsters: [tank], recommendedLevel: 1,
    });
    const team = new Team();
    team.add(new Character({ name: 'DK', class: CharacterClass.DarkKnight }));
    const inventory = new Inventory();

    const result = autoFarmTickWithLoot(team, area, inventory, testItemResolver);

    expect(result.loot.length).toBe(0);
    expect(inventory.size).toBe(0);
  });

  test('no loot when monster has no drop table', () => {
    const goblin = new Monster({ name: 'Goblin', hp: 5, defense: 0, level: 1 });
    const area = new FarmArea({
      name: 'Test', monsters: [goblin], recommendedLevel: 1,
    });
    const team = new Team();
    team.add(new Character({ name: 'DK', class: CharacterClass.DarkKnight }));
    const inventory = new Inventory();

    const result = autoFarmTickWithLoot(team, area, inventory, testItemResolver);

    expect(result.loot.length).toBe(0);
    expect(result.expGained).toBeGreaterThan(0);
  });
});
