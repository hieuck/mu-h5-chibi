import { CharacterClass } from '../entities/character';
import { Character } from '../entities/character';

const CLASS_COLORS: Record<CharacterClass, number> = {
  [CharacterClass.DarkKnight]: 0xcc4444,
  [CharacterClass.DarkWizard]: 0x4444cc,
  [CharacterClass.Elf]: 0x44cc44,
  [CharacterClass.Summoner]: 0xcc44cc,
  [CharacterClass.MagicGladiator]: 0xcc8844,
};

export function getClassColor(classType: CharacterClass): number {
  return CLASS_COLORS[classType];
}

export interface RenderData {
  x: number;
  y: number;
  width: number;
  height: number;
  color: number;
  name: string;
  hp: number;
  maxHp: number;
  level: number;
  isAlive: boolean;
}

export function getCharacterRenderData(char: Character, x: number, y: number): RenderData {
  return {
    x, y,
    width: 48,
    height: 48,
    color: getClassColor(char.class),
    name: char.name,
    hp: char.hp,
    maxHp: char.maxHp,
    level: char.level,
    isAlive: char.hp > 0,
  };
}

export function getMonsterRenderData(name: string, x: number, y: number): RenderData {
  return {
    x, y,
    width: 32,
    height: 32,
    color: 0x66aa44,
    name,
    hp: 100,
    maxHp: 100,
    level: 1,
    isAlive: true,
  };
}
