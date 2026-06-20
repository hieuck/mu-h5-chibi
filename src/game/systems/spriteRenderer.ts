import { CharacterClass } from '../entities/character';

const CLASS_COLORS: Record<CharacterClass, string> = {
  [CharacterClass.DarkKnight]: '#cc4444',
  [CharacterClass.DarkWizard]: '#4444cc',
  [CharacterClass.Elf]: '#44cc44',
  [CharacterClass.Summoner]: '#cc44cc',
  [CharacterClass.MagicGladiator]: '#cc8844',
};

const CLASS_SYMBOLS: Record<CharacterClass, string> = {
  [CharacterClass.DarkKnight]: '⚔',
  [CharacterClass.DarkWizard]: '✦',
  [CharacterClass.Elf]: '🏹',
  [CharacterClass.Summoner]: '◆',
  [CharacterClass.MagicGladiator]: '⚡',
};

const TIER_COLORS: Record<string, string> = {
  normal: '#cccccc',
  magic: '#4488ff',
  rare: '#ffff00',
  set: '#00ff44',
  ancient: '#ff4444',
  mythic: '#cc44ff',
};

export function getClassColor(charClass: CharacterClass): string {
  return CLASS_COLORS[charClass];
}

export function getClassSymbol(charClass: CharacterClass): string {
  return CLASS_SYMBOLS[charClass];
}

export function getTierColor(tier: string): string {
  return TIER_COLORS[tier] ?? '#ffffff';
}
