import { Character, CharacterClass } from '../game/entities/character';
import { Team } from '../game/systems/team';
import { FarmArea, autoFarmTick } from '../game/systems/autoFarm';
import { Monster } from '../game/entities/monster';
import { SkillDatabase } from '../game/systems/skills';
import { Skill, SkillTarget } from '../game/systems/skills';
import { combatTickWithSkills } from '../game/systems/combat';

describe('AutoFarm with Skills', () => {
  test('combatTickWithSkills uses skill when available', () => {
    const dw = new Character({ name: 'DW', class: CharacterClass.DarkWizard });
    const goblin = new Monster({ name: 'Goblin', hp: 50, defense: 0, level: 1 });
    const db = new SkillDatabase();
    db.register(new Skill({
      id: 'fireball', name: 'Fire Ball', class: CharacterClass.DarkWizard,
      damageMultiplier: 2.0, manaCost: 8, cooldownMs: 1500, unlockLevel: 1,
      target: SkillTarget.Single,
    }));

    const result = combatTickWithSkills(dw, goblin, db);

    expect(result.skillUsed).toBe(true);
    expect(result.damage).toBeGreaterThan(5);
    expect(dw.mp).toBeLessThan(dw.maxMp);
  });

  test('falls back to basic attack when no mana', () => {
    const dw = new Character({ name: 'DW', class: CharacterClass.DarkWizard });
    dw.mp = 0;
    const goblin = new Monster({ name: 'Goblin', hp: 50, defense: 0, level: 1 });
    const db = new SkillDatabase();
    db.register(new Skill({
      id: 'fireball', name: 'Fire Ball', class: CharacterClass.DarkWizard,
      damageMultiplier: 2.0, manaCost: 8, cooldownMs: 1500, unlockLevel: 1,
      target: SkillTarget.Single,
    }));

    const result = combatTickWithSkills(dw, goblin, db);

    expect(result.skillUsed).toBe(false);
  });

  test('skill combat integrated into farm tick', () => {
    const team = new Team();
    const dw = new Character({ name: 'DW', class: CharacterClass.DarkWizard });
    team.add(dw);
    const db = new SkillDatabase();
    db.register(new Skill({
      id: 'fireball', name: 'Fire Ball', class: CharacterClass.DarkWizard,
      damageMultiplier: 3.0, manaCost: 8, cooldownMs: 1500, unlockLevel: 1,
      target: SkillTarget.Single,
    }));

    const area = new FarmArea({
      name: 'Test', monsters: [new Monster({ name: 'Goblin', hp: 5, defense: 0, level: 1 })],
      recommendedLevel: 1,
    });

    const exp = autoFarmTick(team, area, db);

    expect(exp).toBeGreaterThan(0);
    expect(dw.mp).toBeLessThan(dw.maxMp);
  });
});
