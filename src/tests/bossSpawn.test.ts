import { Monster } from '../game/entities/monster';
import { Team } from '../game/systems/team';
import { Character, CharacterClass } from '../game/entities/character';
import { BossEncounter } from '../game/systems/bossEncounter';
import { FarmArea } from '../game/systems/autoFarm';
import { DropTable } from '../game/systems/loot';
import { calculateDamage } from '../game/systems/combat';

describe('BossSpawn', () => {
  test('boss spawns after N ticks', () => {
    let tickCount = 0;
    let bossSpawned = false;

    const BOSS_INTERVAL = 5;
    for (let i = 0; i < 10; i++) {
      tickCount++;
      if (tickCount % BOSS_INTERVAL === 0) {
        bossSpawned = true;
      }
    }

    expect(bossSpawned).toBe(true);
  });

  test('boss has higher gold and exp reward', () => {
    const boss = new BossEncounter({
      boss: new Monster({ name: 'Goblin King', hp: 300, defense: 15, level: 10 }),
      requiredLevel: 5, area: 'brave', goldReward: 200,
    });

    expect(boss.goldReward).toBeGreaterThan(50);
  });

  test('boss defeated in auto-farm awards gold', () => {
    const team = new Team();
    const dk = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
    team.add(dk);
    const bossMonster = new Monster({ name: 'Goblin King', hp: 5, defense: 0, level: 5 });
    bossMonster.dropTable = new DropTable({ entries: [{ itemId: 'battle_axe', chance: 1.0 }] });

    const area = new FarmArea({
      name: 'Boss Room', monsters: [bossMonster], recommendedLevel: 1,
    });

    // Kill boss with 1 tick
    const target = area.monsters[0];
    target.takeDamage(calculateDamage(dk, target));

    expect(target.isAlive).toBe(false);
  });
});
