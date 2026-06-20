import { GameStateManager, formatTeamStatus, formatCombatLog } from '../game/systems/gameRenderer';
import { Character, CharacterClass } from '../game/entities/character';
import { Team } from '../game/systems/team';
import { Monster } from '../game/entities/monster';

describe('GameRenderer', () => {
  test('formatTeamStatus returns correct string', () => {
    const team = new Team();
    team.add(new Character({ name: 'DK', class: CharacterClass.DarkKnight }));
    team.add(new Character({ name: 'DW', class: CharacterClass.DarkWizard }));

    const status = formatTeamStatus(team);

    expect(status).toContain('DK');
    expect(status).toContain('DW');
    expect(status).toContain('Lv.1');
  });

  test('formatTeamStatus shows HP', () => {
    const team = new Team();
    team.add(new Character({ name: 'DK', class: CharacterClass.DarkKnight }));

    const status = formatTeamStatus(team);

    expect(status).toContain('HP');
  });

  test('formatCombatLog shows damage dealt', () => {
    const log = formatCombatLog('DK', 25, 'Goblin');

    expect(log).toContain('DK');
    expect(log).toContain('25');
    expect(log).toContain('Goblin');
  });

  test('formatCombatLog shows skill use', () => {
    const log = formatCombatLog('DW', 50, 'Skeleton', 'Fire Ball');

    expect(log).toContain('Fire Ball');
    expect(log).toContain('DW');
  });

  test('GameStateManager tracks game state', () => {
    const manager = new GameStateManager();

    expect(manager.isRunning).toBe(false);
    expect(manager.tickCount).toBe(0);
  });

  test('GameStateManager starts and stops', () => {
    const manager = new GameStateManager();

    manager.start();
    expect(manager.isRunning).toBe(true);

    manager.stop();
    expect(manager.isRunning).toBe(false);
  });

  test('GameStateManager increments tick count', () => {
    const manager = new GameStateManager();

    manager.start();
    manager.tick();
    manager.tick();

    expect(manager.tickCount).toBe(2);
  });

  test('GameStateManager does not tick when stopped', () => {
    const manager = new GameStateManager();

    manager.tick();
    expect(manager.tickCount).toBe(0);
  });
});
