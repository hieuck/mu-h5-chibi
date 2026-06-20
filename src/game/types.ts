export interface BaseStats {
  strength: number;
  agility: number;
  stamina: number;
  energy: number;
}

export type StatName = keyof BaseStats;
