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

export function calculateCritDamage(attacker: Character, defender: Monster): { damage: number; isCrit: boolean } {
  const base = calculateDamage(attacker, defender);
  const critChance = attacker.stats.agility * 0.002;
  const isCrit = Math.random() < critChance;
  return { damage: isCrit ? Math.floor(base * 1.5) : base, isCrit };
}

export function calculateSkillDamage(attacker: Character, defender: Monster, skill: Skill): number {
  return Math.floor(calculateDamage(attacker, defender) * skill.damageMultiplier);
}

export interface CombatTickResult {
  damage: number;
  skillUsed: boolean;
  isCrit: boolean;
}

export function combatTickWithSkills(attacker: Character, defender: Monster, skillDb: { getUnlockedSkills: (char: Character) => Skill[] }): CombatTickResult {
  const availableSkills = skillDb.getUnlockedSkills(attacker).filter(s => attacker.canCast(s));
  const bestSkill = availableSkills.length > 0 ? availableSkills[0] : undefined;

  if (bestSkill) {
    const base = calculateSkillDamage(attacker, defender, bestSkill);
    const { damage, isCrit } = applyCrit(attacker, base);
    defender.takeDamage(damage);
    attacker.useMana(bestSkill.manaCost);
    return { damage, skillUsed: true, isCrit };
  }

  return { damage: attack(attacker, defender), skillUsed: false, isCrit: false };
}

function applyCrit(attacker: Character, damage: number): { damage: number; isCrit: boolean } {
  const critChance = attacker.stats.agility * 0.002;
  if (Math.random() < critChance) {
    return { damage: Math.floor(damage * 1.5), isCrit: true };
  }
  return { damage, isCrit: false };
}

export function attack(attacker: Character, defender: Monster): number {
  const { damage } = calculateCritDamage(attacker, defender);
  defender.takeDamage(damage);
  return damage;
}
