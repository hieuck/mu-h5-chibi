import { Character, CharacterClass } from '../game/entities/character';
import { Monster } from '../game/entities/monster';
import { Skill, SkillDatabase, SkillTarget } from '../game/systems/skills';
import { combatTickWithSkills } from '../game/systems/combat';

describe('Mana and Skill Combat', () => {
  test('character has mana based on energy', () => {
    const dw = new Character({ name: 'DW', class: CharacterClass.DarkWizard });

    expect(dw.maxMp).toBeGreaterThan(0);
    expect(dw.mp).toBe(dw.maxMp);
  });

  test('dark wizard has more mana than dark knight', () => {
    const dk = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
    const dw = new Character({ name: 'DW', class: CharacterClass.DarkWizard });

    expect(dw.maxMp).toBeGreaterThan(dk.maxMp);
  });

  test('using skill consumes mana', () => {
    const dw = new Character({ name: 'DW', class: CharacterClass.DarkWizard });
    const skill = new Skill({ id: 'fireball', name: 'Fire Ball', class: CharacterClass.DarkWizard, damageMultiplier: 1.5, manaCost: 8, cooldownMs: 1500, unlockLevel: 1, target: SkillTarget.Single });

    const canCast = dw.canCast(skill);
    expect(canCast).toBe(true);

    dw.useMana(skill.manaCost);
    expect(dw.mp).toBe(dw.maxMp - 8);
  });

  test('cannot cast skill with insufficient mana', () => {
    const dk = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
    const skill = new Skill({ id: 'fireball', name: 'Fire Ball', class: CharacterClass.DarkWizard, damageMultiplier: 1.5, manaCost: 999, cooldownMs: 1500, unlockLevel: 1, target: SkillTarget.Single });

    expect(dk.canCast(skill)).toBe(false);
  });

  test('combatTickWithSkills uses skill if mana available', () => {
    const dw = new Character({ name: 'DW', class: CharacterClass.DarkWizard });
    const monster = new Monster({ name: 'Goblin', hp: 50, defense: 0, level: 1 });
    const fireball = new Skill({ id: 'fireball', name: 'Fire Ball', class: CharacterClass.DarkWizard, damageMultiplier: 2.0, manaCost: 8, cooldownMs: 1500, unlockLevel: 1, target: SkillTarget.Single });
    const db = new SkillDatabase();
    db.register(fireball);

    const result = combatTickWithSkills(dw, monster, db);

    expect(result.damage).toBeGreaterThan(8);
    expect(dw.mp).toBeLessThan(dw.maxMp);
  });

  test('falls back to basic attack when no mana', () => {
    const dw = new Character({ name: 'DW', class: CharacterClass.DarkWizard });
    dw.mp = 0;
    const monster = new Monster({ name: 'Goblin', hp: 50, defense: 0, level: 1 });
    const fireball = new Skill({ id: 'fireball', name: 'Fire Ball', class: CharacterClass.DarkWizard, damageMultiplier: 2.0, manaCost: 8, cooldownMs: 1500, unlockLevel: 1, target: SkillTarget.Single });
    const db = new SkillDatabase();
    db.register(fireball);

    const result = combatTickWithSkills(dw, monster, db);

    expect(result.skillUsed).toBe(false);
    expect(result.damage).toBe(9);
  });
});
