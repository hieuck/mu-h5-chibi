import { CharacterClass } from './character';
import { Equipment, EquipmentSlot, ItemTier } from './equipment';

export enum WingTier {
  Tier1 = 1,
  Tier2 = 2,
  Tier3 = 3,
}

const WING_TIER_COLORS: Record<WingTier, ItemTier> = {
  [WingTier.Tier1]: ItemTier.Rare,
  [WingTier.Tier2]: ItemTier.Ancient,
  [WingTier.Tier3]: ItemTier.Mythic,
};

interface WingDef {
  name: string;
  attackPowerPercent: number;
  defense: number;
  hpBonus: number;
}

const WING_DEFINITIONS: Record<CharacterClass, Record<WingTier, WingDef>> = {
  [CharacterClass.DarkKnight]: {
    [WingTier.Tier1]: { name: 'Wings of Dragon', attackPowerPercent: 12, defense: 20, hpBonus: 50 },
    [WingTier.Tier2]: { name: 'Wings of Dragon', attackPowerPercent: 40, defense: 70, hpBonus: 150 },
    [WingTier.Tier3]: { name: 'Wings of Dragon', attackPowerPercent: 65, defense: 120, hpBonus: 300 },
  },
  [CharacterClass.DarkWizard]: {
    [WingTier.Tier1]: { name: 'Wings of Heaven', attackPowerPercent: 12, defense: 15, hpBonus: 40 },
    [WingTier.Tier2]: { name: 'Wings of Heaven', attackPowerPercent: 40, defense: 60, hpBonus: 130 },
    [WingTier.Tier3]: { name: 'Wings of Heaven', attackPowerPercent: 65, defense: 110, hpBonus: 280 },
  },
  [CharacterClass.Elf]: {
    [WingTier.Tier1]: { name: 'Wings of Elf', attackPowerPercent: 12, defense: 18, hpBonus: 45 },
    [WingTier.Tier2]: { name: 'Wings of Elf', attackPowerPercent: 40, defense: 65, hpBonus: 140 },
    [WingTier.Tier3]: { name: 'Wings of Elf', attackPowerPercent: 65, defense: 115, hpBonus: 290 },
  },
  [CharacterClass.Summoner]: {
    [WingTier.Tier1]: { name: 'Wings of Summoner', attackPowerPercent: 12, defense: 15, hpBonus: 35 },
    [WingTier.Tier2]: { name: 'Wings of Summoner', attackPowerPercent: 40, defense: 60, hpBonus: 120 },
    [WingTier.Tier3]: { name: 'Wings of Summoner', attackPowerPercent: 65, defense: 110, hpBonus: 270 },
  },
  [CharacterClass.MagicGladiator]: {
    [WingTier.Tier1]: { name: 'Wings of Magician', attackPowerPercent: 12, defense: 18, hpBonus: 45 },
    [WingTier.Tier2]: { name: 'Wings of Magician', attackPowerPercent: 40, defense: 65, hpBonus: 140 },
    [WingTier.Tier3]: { name: 'Wings of Magician', attackPowerPercent: 65, defense: 115, hpBonus: 290 },
  },
};

export function createWings(options: {
  name: string;
  tier: WingTier;
  class: CharacterClass;
  attackPowerPercent: number;
  defense: number;
  hpBonus: number;
}): Equipment {
  return new Equipment(EquipmentSlot.Wings, {
    name: options.name,
    tier: WING_TIER_COLORS[options.tier],
    attackPower: 0,
    defense: options.defense,
    requiredClass: options.class,
    attackPowerPercent: options.attackPowerPercent,
    hpBonus: options.hpBonus,
  });
}

export function getWingForClass(charClass: CharacterClass, tier: WingTier): Equipment {
  const def = WING_DEFINITIONS[charClass][tier];
  return createWings({ ...def, class: charClass, tier });
}
