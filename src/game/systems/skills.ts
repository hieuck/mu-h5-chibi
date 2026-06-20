import { CharacterClass } from '../entities/character';

export enum SkillTarget {
  Single = 'single',
  AoE = 'aoe',
  Self = 'self',
}

export interface SkillOptions {
  id: string;
  name: string;
  class: CharacterClass;
  damageMultiplier: number;
  manaCost: number;
  cooldownMs: number;
  unlockLevel: number;
  target: SkillTarget;
}

export class Skill {
  readonly id: string;
  readonly name: string;
  readonly class: CharacterClass;
  readonly damageMultiplier: number;
  readonly manaCost: number;
  readonly cooldownMs: number;
  readonly unlockLevel: number;
  readonly target: SkillTarget;

  constructor(options: SkillOptions) {
    this.id = options.id;
    this.name = options.name;
    this.class = options.class;
    this.damageMultiplier = options.damageMultiplier;
    this.manaCost = options.manaCost;
    this.cooldownMs = options.cooldownMs;
    this.unlockLevel = options.unlockLevel;
    this.target = options.target;
  }
}

export class SkillDatabase {
  private _skills: Map<string, Skill> = new Map();

  register(...skills: Skill[]): void {
    for (const skill of skills) {
      this._skills.set(skill.id, skill);
    }
  }

  get(id: string): Skill | undefined {
    return this._skills.get(id);
  }

  getUnlockedSkills(character: { level: number; class: CharacterClass }): Skill[] {
    return this.getSkillsForClass(character.class).filter(s => character.level >= s.unlockLevel);
  }

  getSkillsForClass(charClass: CharacterClass): Skill[] {
    return Array.from(this._skills.values()).filter(s => s.class === charClass);
  }
}
