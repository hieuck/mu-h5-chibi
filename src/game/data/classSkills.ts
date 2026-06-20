import { CharacterClass } from '../entities/character';
import { Skill, SkillDatabase, SkillTarget } from '../systems/skills';

const DK_SKILLS = [
  { id: 'dk_slash', name: 'Slash', multiplier: 1.5, mana: 8, cooldown: 2000, level: 1, target: SkillTarget.Single },
  { id: 'dk_power_slash', name: 'Power Slash', multiplier: 2.5, mana: 15, cooldown: 4000, level: 10, target: SkillTarget.Single },
  { id: 'dk_great_fortitude', name: 'Great Fortitude', multiplier: 0, mana: 20, cooldown: 30000, level: 15, target: SkillTarget.Self },
  { id: 'dk_rageful_blow', name: 'Rageful Blow', multiplier: 3.5, mana: 25, cooldown: 6000, level: 20, target: SkillTarget.Single },
  { id: 'dk_twisting_slash', name: 'Twisting Slash', multiplier: 2.0, mana: 18, cooldown: 3500, level: 25, target: SkillTarget.AoE },
  { id: 'dk_hell_buster', name: 'Hell Buster', multiplier: 4.5, mana: 40, cooldown: 10000, level: 40, target: SkillTarget.AoE },
  { id: 'dk_comet_fall', name: 'Comet Fall', multiplier: 5.5, mana: 60, cooldown: 15000, level: 60, target: SkillTarget.AoE },
];

const DW_SKILLS = [
  { id: 'dw_fire_ball', name: 'Fire Ball', multiplier: 1.5, mana: 6, cooldown: 1500, level: 1, target: SkillTarget.Single },
  { id: 'dw_poison', name: 'Poison', multiplier: 2.0, mana: 10, cooldown: 3000, level: 8, target: SkillTarget.Single },
  { id: 'dw_lightning', name: 'Lightning', multiplier: 2.5, mana: 15, cooldown: 4000, level: 15, target: SkillTarget.Single },
  { id: 'dw_meteor', name: 'Meteor', multiplier: 3.0, mana: 20, cooldown: 5000, level: 20, target: SkillTarget.AoE },
  { id: 'dw_blast', name: 'Blast', multiplier: 3.5, mana: 25, cooldown: 6000, level: 28, target: SkillTarget.AoE },
  { id: 'dw_inferno', name: 'Inferno', multiplier: 4.5, mana: 45, cooldown: 10000, level: 45, target: SkillTarget.AoE },
  { id: 'dw_soul_barrier', name: 'Soul Barrier', multiplier: 0, mana: 30, cooldown: 45000, level: 30, target: SkillTarget.Self },
  { id: 'dw_nova', name: 'Nova', multiplier: 6.0, mana: 70, cooldown: 20000, level: 70, target: SkillTarget.AoE },
];

const ELF_SKILLS = [
  { id: 'elf_arrow', name: 'Arrow', multiplier: 1.3, mana: 5, cooldown: 1200, level: 1, target: SkillTarget.Single },
  { id: 'elf_multiple_shot', name: 'Multiple Shot', multiplier: 1.8, mana: 12, cooldown: 3000, level: 10, target: SkillTarget.AoE },
  { id: 'elf_heal', name: 'Heal', multiplier: 0, mana: 15, cooldown: 10000, level: 12, target: SkillTarget.Self },
  { id: 'elf_defense', name: 'Defense Buff', multiplier: 0, mana: 20, cooldown: 30000, level: 18, target: SkillTarget.Self },
  { id: 'elf_penetration', name: 'Penetration', multiplier: 3.0, mana: 20, cooldown: 5000, level: 25, target: SkillTarget.Single },
  { id: 'elf_ice_arrow', name: 'Ice Arrow', multiplier: 2.5, mana: 18, cooldown: 4500, level: 22, target: SkillTarget.Single },
  { id: 'elf_triple_shot', name: 'Triple Shot', multiplier: 3.5, mana: 30, cooldown: 7000, level: 35, target: SkillTarget.AoE },
];

const SUMMONER_SKILLS = [
  { id: 'sum_dark_ball', name: 'Dark Ball', multiplier: 1.5, mana: 7, cooldown: 1600, level: 1, target: SkillTarget.Single },
  { id: 'sum_curse', name: 'Curse', multiplier: 2.0, mana: 12, cooldown: 3500, level: 10, target: SkillTarget.Single },
  { id: 'sum_drain_life', name: 'Drain Life', multiplier: 2.5, mana: 18, cooldown: 5000, level: 18, target: SkillTarget.Single },
  { id: 'sum_dark_scream', name: 'Dark Scream', multiplier: 3.0, mana: 25, cooldown: 6000, level: 25, target: SkillTarget.AoE },
  { id: 'sum_chain_lightning', name: 'Chain Lightning', multiplier: 3.5, mana: 30, cooldown: 7000, level: 32, target: SkillTarget.AoE },
  { id: 'sum_death_beam', name: 'Death Beam', multiplier: 5.0, mana: 55, cooldown: 12000, level: 55, target: SkillTarget.Single },
];

const MG_SKILLS = [
  { id: 'mg_fire_slash', name: 'Fire Slash', multiplier: 1.8, mana: 10, cooldown: 2200, level: 1, target: SkillTarget.Single },
  { id: 'mg_lightning_slash', name: 'Lightning Slash', multiplier: 2.5, mana: 18, cooldown: 4000, level: 12, target: SkillTarget.Single },
  { id: 'mg_flame_strike', name: 'Flame Strike', multiplier: 3.0, mana: 22, cooldown: 5000, level: 20, target: SkillTarget.AoE },
  { id: 'mg_force_wave', name: 'Force Wave', multiplier: 2.0, mana: 15, cooldown: 3500, level: 8, target: SkillTarget.AoE },
  { id: 'mg_blade_blast', name: 'Blade Blast', multiplier: 4.0, mana: 35, cooldown: 8000, level: 35, target: SkillTarget.AoE },
  { id: 'mg_judgment', name: 'Judgment', multiplier: 5.5, mana: 65, cooldown: 18000, level: 65, target: SkillTarget.AoE },
];

const ALL_CLASS_SKILLS: Record<CharacterClass, typeof DK_SKILLS> = {
  [CharacterClass.DarkKnight]: DK_SKILLS,
  [CharacterClass.DarkWizard]: DW_SKILLS,
  [CharacterClass.Elf]: ELF_SKILLS,
  [CharacterClass.Summoner]: SUMMONER_SKILLS,
  [CharacterClass.MagicGladiator]: MG_SKILLS,
};

export class ClassSkillDatabase {
  private _db: SkillDatabase;

  constructor() {
    this._db = new SkillDatabase();
    for (const [charClass, skills] of Object.entries(ALL_CLASS_SKILLS)) {
      for (const s of skills) {
        const skill = new Skill({
          id: s.id,
          name: s.name,
          class: charClass as unknown as CharacterClass,
          damageMultiplier: s.multiplier,
          manaCost: s.mana,
          cooldownMs: s.cooldown,
          unlockLevel: s.level,
          target: s.target,
        });
        this._db.register(skill);
      }
    }
  }

  allSkills(): Skill[] {
    return this._db.getSkillsForClass(CharacterClass.DarkKnight)
      .concat(this._db.getSkillsForClass(CharacterClass.DarkWizard))
      .concat(this._db.getSkillsForClass(CharacterClass.Elf))
      .concat(this._db.getSkillsForClass(CharacterClass.Summoner))
      .concat(this._db.getSkillsForClass(CharacterClass.MagicGladiator));
  }

  getSkillsForClass(charClass: CharacterClass): Skill[] {
    return this._db.getSkillsForClass(charClass);
  }

  getUnlockedSkills(character: { level: number; class: CharacterClass }): Skill[] {
    return this._db.getUnlockedSkills(character);
  }

  resolveSkill(id: string): Skill | undefined {
    return this._db.get(id);
  }
}
