import { Character, CharacterClass } from '../game/entities/character';
import { Team } from '../game/systems/team';
import { FarmArea, autoFarmTick } from '../game/systems/autoFarm';
import { Monster } from '../game/entities/monster';

describe('AutoFarm', () => {
  describe('farm area', () => {
    test('creates area with monsters', () => {
      const area = new FarmArea({
        name: 'Brave Grounds',
        monsters: [
          new Monster({ name: 'Goblin', hp: 50, defense: 5, level: 1 }),
          new Monster({ name: 'Goblin', hp: 50, defense: 5, level: 1 }),
        ],
        recommendedLevel: 1,
      });

      expect(area.name).toBe('Brave Grounds');
      expect(area.monsters.length).toBe(2);
      expect(area.recommendedLevel).toBe(1);
    });

    test('area with all dead monsters is cleared', () => {
      const area = new FarmArea({
        name: 'Test',
        monsters: [new Monster({ name: 'Goblin', hp: 1, defense: 0, level: 1 })],
        recommendedLevel: 1,
      });

      area.monsters[0].takeDamage(1);

      expect(area.isCleared).toBe(true);
    });

    test('respawns monsters', () => {
      const area = new FarmArea({
        name: 'Test',
        monsters: [new Monster({ name: 'Goblin', hp: 50, defense: 5, level: 1 })],
        recommendedLevel: 1,
      });
      area.monsters[0].takeDamage(50);

      area.respawn();

      expect(area.isCleared).toBe(false);
      expect(area.monsters[0].hp).toBe(50);
    });
  });

  describe('auto-farm tick', () => {
    test('tick deals damage to monsters', () => {
      const team = new Team();
      team.add(new Character({ name: 'DK', class: CharacterClass.DarkKnight }));
      const area = new FarmArea({
        name: 'Test',
        monsters: [new Monster({ name: 'Goblin', hp: 100, defense: 0, level: 1 })],
        recommendedLevel: 1,
      });

      autoFarmTick(team, area);

      expect(area.monsters[0].hp).toBeLessThan(100);
    });

    test('tick grants exp to team when monster dies', () => {
      const team = new Team();
      const dk = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
      team.add(dk);
      const area = new FarmArea({
        name: 'Test',
        monsters: [new Monster({ name: 'Weak Goblin', hp: 5, defense: 0, level: 1 })],
        recommendedLevel: 1,
      });

      const expGained = autoFarmTick(team, area);

      expect(expGained).toBeGreaterThan(0);
      expect(dk.experience).toBeGreaterThan(0);
    });

    test('tick returns 0 exp if monster not killed', () => {
      const team = new Team();
      team.add(new Character({ name: 'DK', class: CharacterClass.DarkKnight }));
      const area = new FarmArea({
        name: 'Test',
        monsters: [new Monster({ name: 'Tank', hp: 999, defense: 50, level: 1 })],
        recommendedLevel: 1,
      });

      const expGained = autoFarmTick(team, area);

      expect(expGained).toBe(0);
    });

    test('respawns monsters when area cleared', () => {
      const team = new Team();
      const dk = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
      team.add(dk);
      const area = new FarmArea({
        name: 'Test',
        monsters: [new Monster({ name: 'Weak Goblin', hp: 10, defense: 0, level: 1 })],
        recommendedLevel: 1,
      });

      autoFarmTick(team, area);

      expect(area.isCleared).toBe(false);
    });
  });
});
