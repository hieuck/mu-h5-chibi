import { Character, CharacterClass } from '../game/entities/character';
import { Monster } from '../game/entities/monster';
import { Skill, SkillDatabase, SkillTarget } from '../game/systems/skills';
import { calculateDamage, calculateSkillDamage } from '../game/systems/combat';

describe('Skills', () => {
  describe('skill definition', () => {
    test('creates skill with correct properties', () => {
      const skill = new Skill({
        id: 'slash',
        name: 'Slash',
        class: CharacterClass.DarkKnight,
        damageMultiplier: 1.5,
        manaCost: 10,
        cooldownMs: 2000,
        unlockLevel: 1,
        target: SkillTarget.Single,
      });

      expect(skill.id).toBe('slash');
      expect(skill.name).toBe('Slash');
      expect(skill.damageMultiplier).toBe(1.5);
      expect(skill.manaCost).toBe(10);
    });

    test('higher level skills have bigger multipliers', () => {
      const basic = new Skill({ id: 'a', name: 'A', class: CharacterClass.DarkKnight, damageMultiplier: 1.0, manaCost: 5, cooldownMs: 1000, unlockLevel: 1, target: SkillTarget.Single });
      const ultimate = new Skill({ id: 'b', name: 'B', class: CharacterClass.DarkKnight, damageMultiplier: 5.0, manaCost: 50, cooldownMs: 10000, unlockLevel: 50, target: SkillTarget.AoE });

      expect(ultimate.damageMultiplier).toBeGreaterThan(basic.damageMultiplier);
      expect(ultimate.manaCost).toBeGreaterThan(basic.manaCost);
      expect(ultimate.cooldownMs).toBeGreaterThan(basic.cooldownMs);
    });
  });

  describe('skill database', () => {
    test('registers and retrieves skills', () => {
      const db = new SkillDatabase();
      db.register(new Skill({ id: 'slash', name: 'Slash', class: CharacterClass.DarkKnight, damageMultiplier: 1.5, manaCost: 10, cooldownMs: 2000, unlockLevel: 1, target: SkillTarget.Single }));

      const skill = db.get('slash');
      expect(skill?.name).toBe('Slash');
    });

    test('getUnlockedSkills returns only level-appropriate skills', () => {
      const db = new SkillDatabase();
      db.register(
        new Skill({ id: 'slash', name: 'Slash', class: CharacterClass.DarkKnight, damageMultiplier: 1.5, manaCost: 10, cooldownMs: 2000, unlockLevel: 1, target: SkillTarget.Single }),
        new Skill({ id: 'rageful', name: 'Rageful Blow', class: CharacterClass.DarkKnight, damageMultiplier: 3.0, manaCost: 30, cooldownMs: 8000, unlockLevel: 20, target: SkillTarget.Single }),
      );
      const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });

      const available = db.getUnlockedSkills(char);
      expect(available.length).toBe(1);
      expect(available[0].id).toBe('slash');
    });

    test('getSkillsForClass filters by class', () => {
      const db = new SkillDatabase();
      db.register(
        new Skill({ id: 'slash', name: 'Slash', class: CharacterClass.DarkKnight, damageMultiplier: 1.5, manaCost: 10, cooldownMs: 2000, unlockLevel: 1, target: SkillTarget.Single }),
        new Skill({ id: 'fireball', name: 'Fire Ball', class: CharacterClass.DarkWizard, damageMultiplier: 1.5, manaCost: 8, cooldownMs: 1500, unlockLevel: 1, target: SkillTarget.Single }),
      );

      expect(db.getSkillsForClass(CharacterClass.DarkKnight).length).toBe(1);
      expect(db.getSkillsForClass(CharacterClass.DarkWizard).length).toBe(1);
    });
  });

  describe('skill damage', () => {
    test('skill damage = base damage * multiplier', () => {
      const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
      const monster = new Monster({ name: 'Goblin', hp: 100, defense: 0, level: 1 });
      const skill = new Skill({ id: 'slash', name: 'Slash', class: CharacterClass.DarkKnight, damageMultiplier: 2.0, manaCost: 10, cooldownMs: 2000, unlockLevel: 1, target: SkillTarget.Single });

      const damage = calculateSkillDamage(char, monster, skill);

      expect(damage).toBe(16);
    });

    test('skill damage is higher than basic attack', () => {
      const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
      const monster = new Monster({ name: 'Goblin', hp: 100, defense: 0, level: 1 });
      const skill = new Skill({ id: 'power_strike', name: 'Power Strike', class: CharacterClass.DarkKnight, damageMultiplier: 3.0, manaCost: 20, cooldownMs: 5000, unlockLevel: 5, target: SkillTarget.Single });
      const basicDmg = calculateDamage(char, monster);
      const skillDmg = calculateSkillDamage(char, monster, skill);

      expect(skillDmg).toBeGreaterThan(basicDmg);
    });
  });
});
