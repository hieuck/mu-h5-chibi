import { BaseStats } from '../types';

export enum EquipmentSlot {
  Weapon = 'weapon',
  Shield = 'shield',
  Helm = 'helm',
  Armor = 'armor',
  Pants = 'pants',
  Gloves = 'gloves',
  Boots = 'boots',
  Wings = 'wings',
  Accessory = 'accessory',
}

export enum ItemTier {
  Normal = 'normal',
  Magic = 'magic',
  Rare = 'rare',
  Set = 'set',
  Ancient = 'ancient',
  Mythic = 'mythic',
}

const TIER_COLORS: Record<ItemTier, string> = {
  [ItemTier.Normal]: '#ffffff',
  [ItemTier.Magic]: '#4488ff',
  [ItemTier.Rare]: '#ffff00',
  [ItemTier.Set]: '#00ff44',
  [ItemTier.Ancient]: '#ff4444',
  [ItemTier.Mythic]: '#cc44ff',
};

export interface RequiredStats {
  strength: number;
  agility: number;
}

export interface WeaponOptions {
  name: string;
  tier: ItemTier;
  attackPower?: number;
  defense?: number;
  requiredLevel?: number;
  requiredStrength?: number;
  requiredAgility?: number;
  statBonuses?: Partial<BaseStats>;
  set?: string;
  requiredClass?: string;
  attackPowerPercent?: number;
  hpBonus?: number;
  value?: number;
}

export class Equipment {
  readonly name: string;
  readonly slot: EquipmentSlot;
  readonly tier: ItemTier;
  attackPower: number;
  defense: number;
  requiredLevel: number;
  readonly requiredStats: RequiredStats;
  statBonuses: Partial<BaseStats> | undefined;
  readonly set: string | undefined;
  readonly requiredClass: string | undefined;
  readonly attackPowerPercent: number;
  readonly hpBonus: number;
  value: number;
  enhanceLevel: number = 0;

  constructor(
    slot: EquipmentSlot,
    options: WeaponOptions,
  ) {
    this.name = options.name;
    this.slot = slot;
    this.tier = options.tier;
    this.attackPower = options.attackPower ?? 0;
    this.defense = options.defense ?? 0;
    this.requiredLevel = options.requiredLevel ?? 1;
    this.requiredStats = {
      strength: options.requiredStrength ?? 0,
      agility: options.requiredAgility ?? 0,
    };
    this.statBonuses = options.statBonuses;
    this.set = options.set;
    this.requiredClass = options.requiredClass;
    this.attackPowerPercent = options.attackPowerPercent ?? 0;
    this.hpBonus = options.hpBonus ?? 0;
    this.value = options.value ?? 0;
  }

  get tierColor(): string {
    return TIER_COLORS[this.tier];
  }

  readonly sockets: string[] = [];

  get maxSockets(): number {
    if (this.tier === ItemTier.Ancient || this.tier === ItemTier.Mythic) return 3;
    if (this.tier === ItemTier.Set || this.tier === ItemTier.Rare) return 2;
    if (this.tier === ItemTier.Magic) return 1;
    return 0;
  }

  get socketCount(): number {
    return this.sockets.length;
  }

  addSocket(stat: string): void {
    if (this.sockets.length >= this.maxSockets) {
      throw new Error('No free sockets');
    }
    this.sockets.push(stat);
    const bonus = 4;
    if (!this.statBonuses) this.statBonuses = {};
    this.statBonuses[stat as keyof BaseStats] = (this.statBonuses[stat as keyof BaseStats] || 0) + bonus;
  }

  get enhanceDisplay(): string {
    return this.enhanceLevel > 0 ? `+${this.enhanceLevel}` : '';
  }

  enhance(): void {
    const MAX_ENHANCE = 15;
    if (this.enhanceLevel >= MAX_ENHANCE) {
      throw new Error('Max enhance level reached');
    }

    const atkBonus = this.enhanceLevel < 9 ? 3 : 6;
    const defBonus = this.enhanceLevel < 9 ? 6 : 12;

    this.attackPower += atkBonus;
    this.defense += defBonus;
    this.enhanceLevel++;
    this.value = Math.floor(this.value * 1.3);

    if (this.enhanceLevel % 3 === 0) {
      this.requiredLevel += 1;
    }
  }
}

export function createWeapon(options: WeaponOptions): Equipment {
  return new Equipment(EquipmentSlot.Weapon, options);
}

export function createArmor(options: WeaponOptions): Equipment {
  return new Equipment(EquipmentSlot.Armor, options);
}
