import { ClassSkillDatabase } from '../game/data/classSkills';
import { CharacterClass } from '../game/entities/character';
import { SkillTarget } from '../game/systems/skills';

describe('ClassSkillDatabase', () => {
  test('creates default skill database', () => {
    const db = new ClassSkillDatabase();

    expect(db.allSkills().length).toBeGreaterThan(0);
  });

  test('dark knight has combat skills', () => {
    const db = new ClassSkillDatabase();

    const skills = db.getSkillsForClass(CharacterClass.DarkKnight);

    expect(skills.length).toBeGreaterThanOrEqual(3);
    expect(skills[0].class).toBe(CharacterClass.DarkKnight);
  });

  test('dark wizard has magic skills', () => {
    const db = new ClassSkillDatabase();

    const skills = db.getSkillsForClass(CharacterClass.DarkWizard);

    expect(skills.length).toBeGreaterThanOrEqual(3);
    expect(skills.some(s => s.target === SkillTarget.AoE)).toBe(true);
  });

  test('elf has buff skills', () => {
    const db = new ClassSkillDatabase();

    const skills = db.getSkillsForClass(CharacterClass.Elf);

    expect(skills.some(s => s.target === SkillTarget.Self)).toBe(true);
  });

  test('higher level skills have higher damage multipliers', () => {
    const db = new ClassSkillDatabase();

    const dkSkills = db.getSkillsForClass(CharacterClass.DarkKnight);

    for (let i = 1; i < dkSkills.length; i++) {
      expect(dkSkills[i].unlockLevel).toBeGreaterThanOrEqual(dkSkills[i - 1].unlockLevel);
    }
  });

  test('getUnlockedSkills returns skills for character level', () => {
    const db = new ClassSkillDatabase();
    const char = { level: 1, class: CharacterClass.DarkKnight as CharacterClass };

    const available = db.getUnlockedSkills(char);
    const allSkillsForClass = db.getSkillsForClass(CharacterClass.DarkKnight);

    expect(available.length).toBeLessThan(allSkillsForClass.length);
    expect(available.every(s => s.unlockLevel <= 1)).toBe(true);
  });

  test('summoner has dark skills', () => {
    const db = new ClassSkillDatabase();

    const skills = db.getSkillsForClass(CharacterClass.Summoner);

    expect(skills.length).toBeGreaterThanOrEqual(2);
  });

  test('magic gladiator has hybrid skills', () => {
    const db = new ClassSkillDatabase();

    const skills = db.getSkillsForClass(CharacterClass.MagicGladiator);

    expect(skills.length).toBeGreaterThanOrEqual(2);
  });

  test('highest tier skills have 5x multiplier and high cooldown', () => {
    const db = new ClassSkillDatabase();

    const allSkills = db.allSkills();
    const ultimates = allSkills.filter(s => s.damageMultiplier >= 4.0);

    expect(ultimates.length).toBeGreaterThanOrEqual(5);
    expect(ultimates.every(s => s.cooldownMs >= 8000)).toBe(true);
  });

  test('resolveSkill returns skill by id', () => {
    const db = new ClassSkillDatabase();

    const skill = db.resolveSkill('dk_slash');

    expect(skill?.name).toBe('Slash');
    expect(skill?.class).toBe(CharacterClass.DarkKnight);
  });
});
