export enum PetRarity {
  Common = 'common',
  Rare = 'rare',
  Legendary = 'legendary',
}

export interface PetOptions {
  name: string;
  rarity: PetRarity;
  attackBonus: number;
  defenseBonus: number;
  hpBonus: number;
}

export class Pet {
  readonly name: string;
  readonly rarity: PetRarity;
  readonly attackBonus: number;
  readonly defenseBonus: number;
  readonly hpBonus: number;
  level: number = 1;

  constructor(options: PetOptions) {
    this.name = options.name;
    this.rarity = options.rarity;
    this.attackBonus = options.attackBonus;
    this.defenseBonus = options.defenseBonus;
    this.hpBonus = options.hpBonus;
  }

  getAttackDamage(): number {
    return Math.floor((this.attackBonus + this.level * 2) * (this.rarity === PetRarity.Legendary ? 1.5 : this.rarity === PetRarity.Rare ? 1.2 : 1));
  }
}
