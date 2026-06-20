import { Character, CharacterClass } from '../entities/character';
import { Monster } from '../entities/monster';

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

export function attack(attacker: Character, defender: Monster): number {
  const damage = calculateDamage(attacker, defender);
  defender.takeDamage(damage);
  return damage;
}
