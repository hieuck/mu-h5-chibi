import { Character, CharacterClass } from '../entities/character';
import { Monster } from '../entities/monster';
import { Skill } from './skills';

function getPrimaryStat(char: Character): number {
  switch (char.class) {
    case CharacterClass.DarkKnight:
    case CharacterClass.MagicGladiator:
      return char.stats.strength;
    case CharacterClass.DarkWizard:
    case CharacterClass.Summoner:
      return char.stats.energy;
    case CharacterClass.Elf:
      return char.stats.agility;
  }
}

export function calculateDamage(attacker: Character, defender: Monster): number {
  const weaponDamage = attacker.totalAttackPower;
  const statDamage = getPrimaryStat(attacker) * 0.3;
  const baseDamage = Math.floor(weaponDamage + statDamage);
  const reduction = 100 / (100 + defender.defense);
  return Math.max(1, Math.floor(baseDamage * reduction));
}

export function calculateSkillDamage(attacker: Character, defender: Monster, skill: Skill): number {
  return Math.floor(calculateDamage(attacker, defender) * skill.damageMultiplier);
}

export interface CombatTickResult {
  damage: number;
  skillUsed: boolean;
}

export function combatTickWithSkills(attacker: Character, defender: Monster, skillDb: { getUnlockedSkills: (char: Character) => Skill[] }): CombatTickResult {
  const availableSkills = skillDb.getUnlockedSkills(attacker).filter(s => attacker.canCast(s));
  const bestSkill = availableSkills.length > 0 ? availableSkills[0] : undefined;

  if (bestSkill) {
    const damage = calculateSkillDamage(attacker, defender, bestSkill);
    defender.takeDamage(damage);
    attacker.useMana(bestSkill.manaCost);
    return { damage, skillUsed: true };
  }

  return { damage: attack(attacker, defender), skillUsed: false };
}

export function attack(attacker: Character, defender: Monster): number {
  const damage = calculateDamage(attacker, defender);
  defender.takeDamage(damage);
  return damage;
}
