import { Monster } from '../entities/monster';
import { DropTable } from './loot';

export interface BossEncounterOptions {
  boss: Monster;
  requiredLevel: number;
  area: string;
  goldReward?: number;
  abilities?: string[];
}

export class BossEncounter {
  readonly boss: Monster;
  readonly requiredLevel: number;
  readonly area: string;
  readonly goldReward: number;
  readonly abilities: string[];

  constructor(options: BossEncounterOptions) {
    this.boss = options.boss;
    this.requiredLevel = options.requiredLevel;
    this.area = options.area;
    this.goldReward = options.goldReward ?? 0;
    this.abilities = options.abilities ?? [];
  }

  canAttempt(characterLevel: number): boolean {
    return characterLevel >= this.requiredLevel;
  }
}
