import { Equipment, EquipmentSlot, ItemTier } from '../entities/equipment';
import { CharacterClass } from '../entities/character';

interface ItemDef {
  id: string;
  name: string;
  slot: EquipmentSlot;
  tier: ItemTier;
  attackPower?: number;
  defense?: number;
  requiredLevel?: number;
  requiredClass?: CharacterClass;
  statBonuses?: Record<string, number>;
  set?: string;
  value?: number;
  mobDrops?: string[];
}

const ALL_ITEMS: ItemDef[] = [
  // ── Weapons (Level 1-10) ──
  { id: 'short_sword', name: 'Short Sword', slot: EquipmentSlot.Weapon, tier: ItemTier.Normal, attackPower: 12, requiredLevel: 1, value: 300, mobDrops: ['goblin'] },
  { id: 'hand_axe', name: 'Hand Axe', slot: EquipmentSlot.Weapon, tier: ItemTier.Normal, attackPower: 14, requiredLevel: 3, value: 400, mobDrops: ['goblin', 'skeleton'] },
  { id: 'rapier', name: 'Rapier', slot: EquipmentSlot.Weapon, tier: ItemTier.Magic, attackPower: 20, requiredLevel: 5, value: 800, mobDrops: ['skeleton'] },
  { id: 'battle_axe', name: 'Battle Axe', slot: EquipmentSlot.Weapon, tier: ItemTier.Rare, attackPower: 35, requiredLevel: 10, value: 2000, mobDrops: ['elite_skeleton'] },

  // ── Weapons (Level 15-30) ──
  { id: 'blade', name: 'Blade', slot: EquipmentSlot.Weapon, tier: ItemTier.Magic, attackPower: 40, requiredLevel: 15, value: 3500, mobDrops: ['giant'] },
  { id: 'doom_blade', name: 'Doom Blade', slot: EquipmentSlot.Weapon, tier: ItemTier.Rare, attackPower: 60, requiredLevel: 20, value: 6000, mobDrops: ['elite_giant'] },
  { id: 'legendary_sword', name: 'Legendary Sword', slot: EquipmentSlot.Weapon, tier: ItemTier.Rare, attackPower: 80, requiredLevel: 30, value: 10000 },

  // ── Wands (Dark Wizard) ──
  { id: 'skull_staff', name: 'Skull Staff', slot: EquipmentSlot.Weapon, tier: ItemTier.Normal, attackPower: 10, requiredLevel: 1, requiredClass: CharacterClass.DarkWizard, value: 250, mobDrops: ['goblin'] },
  { id: 'angel_staff', name: 'Angel Staff', slot: EquipmentSlot.Weapon, tier: ItemTier.Magic, attackPower: 25, requiredLevel: 8, requiredClass: CharacterClass.DarkWizard, value: 1500, mobDrops: ['skeleton'] },
  { id: 'devil_staff', name: 'Devil Staff', slot: EquipmentSlot.Weapon, tier: ItemTier.Rare, attackPower: 50, requiredLevel: 18, requiredClass: CharacterClass.DarkWizard, value: 5000, mobDrops: ['elite_skeleton'] },

  // ── Bows (Elf) ──
  { id: 'short_bow', name: 'Short Bow', slot: EquipmentSlot.Weapon, tier: ItemTier.Normal, attackPower: 11, requiredLevel: 1, requiredClass: CharacterClass.Elf, value: 280, mobDrops: ['goblin'] },
  { id: 'crossbow', name: 'Crossbow', slot: EquipmentSlot.Weapon, tier: ItemTier.Magic, attackPower: 28, requiredLevel: 10, requiredClass: CharacterClass.Elf, value: 1800, mobDrops: ['skeleton'] },
  { id: 'golden_crossbow', name: 'Golden Crossbow', slot: EquipmentSlot.Weapon, tier: ItemTier.Rare, attackPower: 55, requiredLevel: 22, requiredClass: CharacterClass.Elf, value: 7000 },

  // ── Armor Sets (All classes) ──
  { id: 'pad_helm', name: 'Pad Helm', slot: EquipmentSlot.Helm, tier: ItemTier.Normal, defense: 8, requiredLevel: 1, set: 'Pad', value: 200, mobDrops: ['goblin'] },
  { id: 'pad_armor', name: 'Pad Armor', slot: EquipmentSlot.Armor, tier: ItemTier.Normal, defense: 15, requiredLevel: 1, set: 'Pad', value: 300, mobDrops: ['goblin'] },
  { id: 'pad_pants', name: 'Pad Pants', slot: EquipmentSlot.Pants, tier: ItemTier.Normal, defense: 10, requiredLevel: 1, set: 'Pad', value: 250 },
  { id: 'pad_gloves', name: 'Pad Gloves', slot: EquipmentSlot.Gloves, tier: ItemTier.Normal, defense: 5, requiredLevel: 1, set: 'Pad', value: 150 },
  { id: 'pad_boots', name: 'Pad Boots', slot: EquipmentSlot.Boots, tier: ItemTier.Normal, defense: 5, requiredLevel: 1, set: 'Pad', value: 150, mobDrops: ['goblin'] },

  // ── Bone Set (Level 15+) ──
  { id: 'bone_helm', name: 'Bone Helm', slot: EquipmentSlot.Helm, tier: ItemTier.Magic, defense: 18, requiredLevel: 15, set: 'Bone', value: 800, mobDrops: ['skeleton'] },
  { id: 'bone_armor', name: 'Bone Armor', slot: EquipmentSlot.Armor, tier: ItemTier.Magic, defense: 35, requiredLevel: 15, set: 'Bone', value: 1500, mobDrops: ['skeleton'] },
  { id: 'bone_pants', name: 'Bone Pants', slot: EquipmentSlot.Pants, tier: ItemTier.Magic, defense: 22, requiredLevel: 15, set: 'Bone', value: 1000 },
  { id: 'bone_gloves', name: 'Bone Gloves', slot: EquipmentSlot.Gloves, tier: ItemTier.Magic, defense: 12, requiredLevel: 15, set: 'Bone', value: 600 },
  { id: 'bone_boots', name: 'Bone Boots', slot: EquipmentSlot.Boots, tier: ItemTier.Magic, defense: 10, requiredLevel: 15, set: 'Bone', value: 500 },

  // ── Adamantine Set (Level 25+) ──
  { id: 'adamantine_helm', name: 'Adamantine Helm', slot: EquipmentSlot.Helm, tier: ItemTier.Set, defense: 30, requiredLevel: 25, set: 'Adamantine', statBonuses: { stamina: 3 }, value: 3000, mobDrops: ['elite_skeleton'] },
  { id: 'adamantine_armor', name: 'Adamantine Armor', slot: EquipmentSlot.Armor, tier: ItemTier.Set, defense: 55, requiredLevel: 25, set: 'Adamantine', statBonuses: { stamina: 5 }, value: 5000, mobDrops: ['elite_giant'] },
  { id: 'adamantine_pants', name: 'Adamantine Pants', slot: EquipmentSlot.Pants, tier: ItemTier.Set, defense: 35, requiredLevel: 25, set: 'Adamantine', statBonuses: { stamina: 2 }, value: 3500 },
  { id: 'adamantine_gloves', name: 'Adamantine Gloves', slot: EquipmentSlot.Gloves, tier: ItemTier.Set, defense: 20, requiredLevel: 25, set: 'Adamantine', value: 2000 },
  { id: 'adamantine_boots', name: 'Adamantine Boots', slot: EquipmentSlot.Boots, tier: ItemTier.Set, defense: 18, requiredLevel: 25, set: 'Adamantine', value: 1800 },

  // ── Dragon Set (Level 40+) ──
  { id: 'dragon_helm', name: 'Dragon Helm', slot: EquipmentSlot.Helm, tier: ItemTier.Set, defense: 45, requiredLevel: 40, set: 'Dragon', statBonuses: { strength: 5 }, value: 6000 },
  { id: 'dragon_armor', name: 'Dragon Armor', slot: EquipmentSlot.Armor, tier: ItemTier.Set, defense: 80, requiredLevel: 40, set: 'Dragon', statBonuses: { strength: 10 }, value: 12000 },
  { id: 'dragon_pants', name: 'Dragon Pants', slot: EquipmentSlot.Pants, tier: ItemTier.Set, defense: 50, requiredLevel: 40, set: 'Dragon', statBonuses: { strength: 3 }, value: 8000 },
  { id: 'dragon_gloves', name: 'Dragon Gloves', slot: EquipmentSlot.Gloves, tier: ItemTier.Set, defense: 30, requiredLevel: 40, set: 'Dragon', value: 5000 },
  { id: 'dragon_boots', name: 'Dragon Boots', slot: EquipmentSlot.Boots, tier: ItemTier.Set, defense: 25, requiredLevel: 40, set: 'Dragon', value: 4000 },

  // ── Dark Knight Class Items ──
  { id: 'dk_helm', name: 'DK Helm', slot: EquipmentSlot.Helm, tier: ItemTier.Rare, defense: 35, requiredLevel: 20, requiredClass: CharacterClass.DarkKnight, statBonuses: { strength: 3, stamina: 2 }, value: 3000 },
  { id: 'dk_armor', name: 'DK Armor', slot: EquipmentSlot.Armor, tier: ItemTier.Rare, defense: 60, requiredLevel: 20, requiredClass: CharacterClass.DarkKnight, statBonuses: { strength: 5, stamina: 3 }, value: 5500 },

  // ── Dark Wizard Class Items ──
  { id: 'dw_helm', name: 'DW Helm', slot: EquipmentSlot.Helm, tier: ItemTier.Rare, defense: 25, requiredLevel: 20, requiredClass: CharacterClass.DarkWizard, statBonuses: { energy: 3, agility: 2 }, value: 2800 },
  { id: 'dw_armor', name: 'DW Armor', slot: EquipmentSlot.Armor, tier: ItemTier.Rare, defense: 45, requiredLevel: 20, requiredClass: CharacterClass.DarkWizard, statBonuses: { energy: 5, agility: 3 }, value: 5000 },

  // ── Shields ──
  { id: 'small_shield', name: 'Small Shield', slot: EquipmentSlot.Shield, tier: ItemTier.Normal, defense: 10, requiredLevel: 1, value: 200, mobDrops: ['goblin'] },
  { id: 'horn_shield', name: 'Horn Shield', slot: EquipmentSlot.Shield, tier: ItemTier.Magic, defense: 25, requiredLevel: 10, value: 1200, mobDrops: ['skeleton'] },
  { id: 'skull_shield', name: 'Skull Shield', slot: EquipmentSlot.Shield, tier: ItemTier.Rare, defense: 40, requiredLevel: 22, value: 4000 },

  // ── Wings (All tiers covered) ──
  { id: 'wings_dragon_t1', name: 'Wings of Dragon', slot: EquipmentSlot.Wings, tier: ItemTier.Rare, defense: 20, requiredLevel: 60, requiredClass: CharacterClass.DarkKnight, value: 15000 },
  { id: 'wings_heaven_t1', name: 'Wings of Heaven', slot: EquipmentSlot.Wings, tier: ItemTier.Rare, defense: 15, requiredLevel: 60, requiredClass: CharacterClass.DarkWizard, value: 15000 },

  // ── Accessories ──
  { id: 'ring_of_strength', name: 'Ring of Strength', slot: EquipmentSlot.Accessory, tier: ItemTier.Magic, attackPower: 5, requiredLevel: 10, statBonuses: { strength: 3 }, value: 2000 },
  { id: 'ring_of_energy', name: 'Ring of Energy', slot: EquipmentSlot.Accessory, tier: ItemTier.Magic, attackPower: 5, requiredLevel: 10, statBonuses: { energy: 3 }, value: 2000 },
  { id: 'pendant_of_life', name: 'Pendant of Life', slot: EquipmentSlot.Accessory, tier: ItemTier.Rare, requiredLevel: 20, statBonuses: { stamina: 5 }, value: 4000 },
];

// ── Set Bonus Definitions ──
const SET_BONUSES: Record<string, Record<number, Record<string, number>>> = {
  Pad: { 2: { defense: 10 }, 3: { defense: 20, stamina: 2 }, 5: { defense: 40, stamina: 5 } },
  Bone: { 2: { defense: 20 }, 3: { defense: 40, stamina: 3 }, 5: { defense: 70, stamina: 8 } },
  Adamantine: { 2: { defense: 40, stamina: 5 }, 3: { defense: 70, stamina: 10 }, 5: { defense: 120, stamina: 20, strength: 10 } },
  Dragon: { 2: { defense: 60, strength: 10 }, 3: { defense: 100, strength: 15 }, 5: { defense: 180, strength: 30, stamina: 15 } },
};

// ── Shop Items ──
const SHOP_ITEMS = [
  { id: 'short_sword', price: 500 },
  { id: 'hand_axe', price: 800 },
  { id: 'pad_helm', price: 300 },
  { id: 'pad_armor', price: 500 },
  { id: 'small_shield', price: 400 },
  { id: 'ring_of_strength', price: 3000 },
];

// ── Mob Drop Table Definitions ──
const MOB_DROPS: Record<string, string[]> = {
  goblin: ['short_sword', 'hand_axe', 'pad_helm', 'pad_boots', 'small_shield', 'skull_staff', 'short_bow'],
  skeleton: ['hand_axe', 'rapier', 'angel_staff', 'crossbow', 'bone_helm', 'bone_armor', 'horn_shield'],
  elite_skeleton: ['battle_axe', 'devil_staff', 'adamantine_helm', 'adamantine_armor'],
  giant: ['blade'],
  elite_giant: ['doom_blade', 'adamantine_armor'],
};

export class ItemDatabase {
  private _items: Map<string, Equipment> = new Map();
  private _mobDrops: Map<string, string[]> = new Map();

  constructor() {
    for (const def of ALL_ITEMS) {
      const equip = new Equipment(def.slot, {
        name: def.name,
        tier: def.tier,
        attackPower: def.attackPower,
        defense: def.defense,
        requiredLevel: def.requiredLevel,
        requiredClass: def.requiredClass,
        statBonuses: def.statBonuses as any,
        set: def.set,
        value: def.value,
      });
      this._items.set(def.id, equip);
    }
    for (const [mobId, itemIds] of Object.entries(MOB_DROPS)) {
      this._mobDrops.set(mobId, itemIds);
    }
  }

  allItems(): Equipment[] {
    return Array.from(this._items.values());
  }

  getItem(id: string): Equipment | undefined {
    return this._items.get(id);
  }

  getItemsByLevel(minLevel: number, maxLevel: number): Equipment[] {
    return this.allItems().filter(i => i.requiredLevel >= minLevel && i.requiredLevel <= maxLevel);
  }

  getItemsBySlot(slot: EquipmentSlot): Equipment[] {
    return this.allItems().filter(i => i.slot === slot);
  }

  getSetItems(setName: string): Equipment[] {
    return this.allItems().filter(i => i.set === setName);
  }

  getItemsByClass(charClass: CharacterClass): Equipment[] {
    return this.allItems().filter(i => i.requiredClass === charClass);
  }

  getMobDrops(mobId: string): string[] {
    return this._mobDrops.get(mobId) ?? [];
  }

  resolveItem(id: string): Equipment | undefined {
    const def = this._items.get(id);
    if (!def) return undefined;
    return new Equipment(def.slot, {
      name: def.name,
      tier: def.tier,
      attackPower: def.attackPower,
      defense: def.defense,
      requiredLevel: def.requiredLevel,
      requiredClass: def.requiredClass,
      statBonuses: def.statBonuses,
      set: def.set,
      value: def.value,
    });
  }

  getShopItems(): { id: string; price: number }[] {
    return [...SHOP_ITEMS];
  }

  getSetBonuses(setName: string): Record<number, Record<string, number>> | undefined {
    return SET_BONUSES[setName];
  }
}
