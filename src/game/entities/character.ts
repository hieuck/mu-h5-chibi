import { BaseStats, StatName } from '../types';
import { Equipment, EquipmentSlot } from './equipment';

export enum CharacterClass {
  DarkKnight = 'darkKnight',
  DarkWizard = 'darkWizard',
  Elf = 'elf',
  Summoner = 'summoner',
  MagicGladiator = 'magicGladiator',
}

export interface CharacterOptions {
  name: string;
  class: CharacterClass;
}

const BASE_STATS: Record<CharacterClass, BaseStats> = {
  [CharacterClass.DarkKnight]: { strength: 28, agility: 20, stamina: 25, energy: 10 },
  [CharacterClass.DarkWizard]: { strength: 18, agility: 18, stamina: 15, energy: 30 },
  [CharacterClass.Elf]:        { strength: 22, agility: 25, stamina: 20, energy: 14 },
  [CharacterClass.Summoner]:   { strength: 15, agility: 20, stamina: 15, energy: 32 },
  [CharacterClass.MagicGladiator]: { strength: 26, agility: 20, stamina: 20, energy: 16 },
};

function expForLevel(level: number): number {
  return level * 100;
}

export class Character {
  readonly name: string;
  readonly class: CharacterClass;
  level: number = 1;
  experience: number = 0;
  stats: BaseStats;
  hp: number;
  gold: number = 0;
  private _unspentStatPoints: number = 0;
  private _equipment: Map<string, Equipment> = new Map();
  private _resetCount: number = 0;

  constructor(options: CharacterOptions) {
    this.name = options.name;
    this.class = options.class;
    this.stats = { ...BASE_STATS[options.class] };
    this.hp = this.maxHp;
  }

  get maxHp(): number {
    let bonus = 0;
    for (const item of this._equipment.values()) {
      bonus += item.hpBonus;
    }
    return this.stats.stamina * 10 + this.level * 5 + bonus;
  }

  get resetCount(): number {
    return this._resetCount;
  }

  get availableStatPoints(): number {
    return this._unspentStatPoints;
  }

  addExp(amount: number): void {
    this.experience += amount;
    while (this.experience >= expForLevel(this.level)) {
      this.experience -= expForLevel(this.level);
      this.level++;
      this._unspentStatPoints += 5;
    }
  }

  allocateStat(stat: StatName, amount: number): void {
    if (amount <= 0) {
      throw new Error('Invalid stat point allocation');
    }
    if (amount > this._unspentStatPoints) {
      throw new Error('Not enough stat points');
    }
    this.stats[stat] += amount;
    this._unspentStatPoints -= amount;
  }

  get totalAttackPower(): number {
    let total = 0;
    let wingPercentBonus = 0;
    for (const item of this._equipment.values()) {
      total += item.attackPower;
      wingPercentBonus += item.attackPowerPercent;
    }
    return total + Math.floor(total * wingPercentBonus / 100);
  }

  get totalDefense(): number {
    let total = 0;
    for (const item of this._equipment.values()) {
      total += item.defense;
    }
    return total;
  }

  getEquippedItem(slot: EquipmentSlot): Equipment | undefined {
    return this._equipment.get(slot);
  }

  equip(item: Equipment): Equipment | undefined {
    if (item.requiredLevel > this.level) {
      throw new Error('Level requirement not met');
    }
    if (item.requiredClass && item.requiredClass !== this.class) {
      throw new Error('Wrong class for this equipment');
    }
    const old = this.unequip(item.slot);
    this._applyStatBonuses(item, true);
    this._equipment.set(item.slot, item);
    return old;
  }

  unequip(slot: EquipmentSlot): Equipment | undefined {
    const item = this._equipment.get(slot);
    if (item) {
      this._applyStatBonuses(item, false);
      this._equipment.delete(slot);
    }
    return item;
  }

  reset(): void {
    const MIN_RESET_LEVEL = 10;
    if (this.level < MIN_RESET_LEVEL) {
      throw new Error(`Minimum level ${MIN_RESET_LEVEL} required to reset`);
    }
    this.level = 1;
    this.experience = 0;
    this._unspentStatPoints = 0;
    this.hp = this.maxHp;
    this._resetCount++;
    this.stats.strength += 5;
    this.stats.agility += 5;
    this.stats.stamina += 5;
    this.stats.energy += 5;
  }

  private _applyStatBonuses(item: Equipment, adding: boolean): void {
    if (!item.statBonuses) return;
    const sign = adding ? 1 : -1;
    for (const [stat, value] of Object.entries(item.statBonuses)) {
      if (value) {
        this.stats[stat as StatName] += value * sign;
      }
    }
  }
}
