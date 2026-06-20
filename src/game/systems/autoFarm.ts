import { Team } from './team';
import { Monster } from '../entities/monster';
import { calculateDamage, combatTickWithSkills } from './combat';
import { Inventory } from './inventory';
import { Equipment } from '../entities/equipment';
import { Skill } from './skills';

export interface SkillProvider {
  getUnlockedSkills(character: { level: number; class: any }): Skill[];
}

export interface FarmAreaOptions {
  name: string;
  monsters: Monster[];
  recommendedLevel: number;
}

const EXP_PER_KILL = 50;

export class FarmArea {
  readonly name: string;
  private _monsters: Monster[];
  readonly recommendedLevel: number;
  private _monsterTemplates: Monster[];

  constructor(options: FarmAreaOptions) {
    this.name = options.name;
    this._monsters = options.monsters;
    this._monsterTemplates = options.monsters.map(m => {
      const template = new Monster({ name: m.name, hp: m.maxHp, defense: m.defense, level: m.level });
      template.dropTable = m.dropTable;
      return template;
    });
    this.recommendedLevel = options.recommendedLevel;
  }

  get monsters(): Monster[] {
    return this._monsters;
  }

  get isCleared(): boolean {
    return this._monsters.every(m => !m.isAlive);
  }

  respawn(): void {
    this._monsters = this._monsterTemplates.map(t => {
      const m = new Monster({ name: t.name, hp: t.maxHp, defense: t.defense, level: t.level });
      m.dropTable = t.dropTable;
      return m;
    });
  }
}

export function autoFarmTick(team: Team, area: FarmArea, skillProvider?: SkillProvider): number {
  let expGained = 0;

  for (const member of team.members) {
    if (!member.hp) continue;

    const aliveMonsters = area.monsters.filter(m => m.isAlive);
    if (aliveMonsters.length === 0) break;

    const target = aliveMonsters[0];

    if (skillProvider) {
      const result = combatTickWithSkills(member, target, skillProvider);
      if (!target.isAlive) {
        expGained += EXP_PER_KILL;
        member.addExp(EXP_PER_KILL);
        const goldShare = Math.floor(target.goldValue / team.members.filter(m => m.hp > 0).length);
        team.members.forEach(m => { if (m.hp > 0) m.gold += goldShare; });
      }
    } else {
      const damage = calculateDamage(member, target);
      target.takeDamage(damage);
      if (!target.isAlive) {
        expGained += EXP_PER_KILL;
        member.addExp(EXP_PER_KILL);
        const goldShare = Math.floor(target.goldValue / team.members.filter(m => m.hp > 0).length);
        team.members.forEach(m => { if (m.hp > 0) m.gold += goldShare; });
      }
    }
  }

  if (area.isCleared) {
    area.respawn();
  }

  return expGained;
}

export interface LootResult {
  loot: string[];
  expGained: number;
}

export function autoFarmTickWithLoot(
  team: Team,
  area: FarmArea,
  inventory: Inventory,
  itemResolver?: (itemId: string) => Equipment | undefined,
  skillProvider?: SkillProvider,
): LootResult {
  const loot: string[] = [];
  let expGained = 0;

  for (const member of team.members) {
    if (!member.hp) continue;
    const aliveMonsters = area.monsters.filter(m => m.isAlive);
    if (aliveMonsters.length === 0) break;
    const target = aliveMonsters[0];

    if (skillProvider) {
      const result = combatTickWithSkills(member, target, skillProvider);
      if (!target.isAlive) {
        expGained += EXP_PER_KILL;
        member.addExp(EXP_PER_KILL);
        const alive = team.members.filter(m => m.hp > 0);
        alive.forEach(m => m.gold += Math.floor(target.goldValue / alive.length));
        if (itemResolver && target.dropTable) {
          const drop = target.dropTable.roll(Math.random());
          if (drop && !inventory.isFull) {
            const item = itemResolver(drop);
            if (item) { inventory.add(item); loot.push(drop); }
          }
        }
      }
    } else {
      const damage = calculateDamage(member, target);
      target.takeDamage(damage);
      if (!target.isAlive) {
        expGained += EXP_PER_KILL;
        member.addExp(EXP_PER_KILL);
        const alive = team.members.filter(m => m.hp > 0);
        alive.forEach(m => m.gold += Math.floor(target.goldValue / alive.length));
        if (itemResolver && target.dropTable) {
          const drop = target.dropTable.roll(Math.random());
          if (drop && !inventory.isFull) {
            const item = itemResolver(drop);
            if (item) { inventory.add(item); loot.push(drop); }
          }
        }
      }
    }
  }

  if (area.isCleared) area.respawn();
  return { loot, expGained };
}
