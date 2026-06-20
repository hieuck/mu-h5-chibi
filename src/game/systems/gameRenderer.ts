import { Team } from './team';
import { Character } from '../entities/character';

export function formatTeamStatus(team: Team): string {
  return team.members.map(m => {
    return `${m.name} Lv.${m.level} HP:${m.hp}/${m.maxHp}`;
  }).join(' | ');
}

export function formatCombatLog(attacker: string, damage: number, target: string, skillName?: string): string {
  const skill = skillName ? ` [${skillName}]` : '';
  return `${attacker}${skill} → ${target}: -${damage}`;
}

export function formatCharacterStats(char: Character): string {
  return `STR:${char.stats.strength} AGI:${char.stats.agility} STA:${char.stats.stamina} ENE:${char.stats.energy}`
    + ` | ATK:${char.totalAttackPower} DEF:${char.totalDefense}`;
}

export class GameStateManager {
  private _isRunning: boolean = false;
  private _tickCount: number = 0;

  get isRunning(): boolean { return this._isRunning; }
  get tickCount(): number { return this._tickCount; }

  start(): void { this._isRunning = true; }
  stop(): void { this._isRunning = false; }

  tick(): void {
    if (!this._isRunning) return;
    this._tickCount++;
  }
}
