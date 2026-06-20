import { Monster } from '../game/entities/monster';
import { BossEncounter } from '../game/systems/bossEncounter';
import { DropTable } from '../game/systems/loot';

describe('BossEncounter', () => {
  test('boss has higher stats than normal monsters', () => {
    const boss = new Monster({ name: 'Boss Goblin', hp: 500, defense: 30, level: 5 });

    expect(boss.hp).toBeGreaterThan(100);
    expect(boss.goldValue).toBeGreaterThanOrEqual(50);
  });

  test('boss encounter requires minimum level', () => {
    const boss = new Monster({ name: 'Dragon', hp: 1000, defense: 50, level: 30 });
    const encounter = new BossEncounter({ boss, requiredLevel: 20, area: 'dragon_valley' });

    expect(encounter.requiredLevel).toBe(20);
    expect(encounter.canAttempt(19)).toBe(false);
    expect(encounter.canAttempt(20)).toBe(true);
  });

  test('boss drops rare loot table', () => {
    const boss = new Monster({ name: 'Dragon', hp: 1000, defense: 50, level: 30 });
    boss.dropTable = new DropTable({
      entries: [
        { itemId: 'legendary_sword', chance: 0.5 },
        { itemId: 'dragon_armor', chance: 0.3 },
        { itemId: 'ring_of_strength', chance: 0.2 },
      ],
    });
    const encounter = new BossEncounter({ boss, requiredLevel: 20, area: 'dragon_valley' });

    expect(encounter.boss.dropTable!.entries.length).toBe(3);
    expect(encounter.boss.dropTable!.totalWeight).toBeCloseTo(1.0);
  });

  test('defeating boss gives extra gold reward', () => {
    const boss = new Monster({ name: 'Goblin King', hp: 50, defense: 5, level: 5 });
    const encounter = new BossEncounter({ boss, requiredLevel: 3, area: 'brave', goldReward: 500 });

    expect(encounter.goldReward).toBe(500);
  });

  test('boss special ability description', () => {
    const boss = new Monster({ name: 'Dragon', hp: 1000, defense: 50, level: 30 });
    const encounter = new BossEncounter({
      boss, requiredLevel: 20, area: 'dragon_valley',
      abilities: ['Fire Breath', 'Tail Swipe'],
    });

    expect(encounter.abilities).toContain('Fire Breath');
  });
});
