import { Character } from '../entities/character';
import { Monster } from '../entities/monster';
import { calculateDamage } from './combat';

type Formation = 'line' | 'V' | 'circle';

const MAX_SQUAD_SIZE = 4;

export class Team {
  private _members: Character[] = [];
  private _formation: Formation = 'line';

  get members(): ReadonlyArray<Character> {
    return this._members;
  }

  get size(): number {
    return this._members.length;
  }

  get formation(): Formation {
    return this._formation;
  }

  set formation(f: Formation) {
    this._formation = f;
  }

  get totalAttackPower(): number {
    return this._members.reduce((sum, m) => sum + m.totalAttackPower, 0);
  }

  get isAlive(): boolean {
    return this._members.some(m => m.hp > 0);
  }

  add(character: Character): void {
    if (this._members.length >= MAX_SQUAD_SIZE) {
      throw new Error('Squad is full (max 4)');
    }
    this._members.push(character);
  }

  remove(index: number): Character | undefined {
    if (index < 0 || index >= this._members.length) return undefined;
    return this._members.splice(index, 1)[0];
  }

  allAttack(monster: Monster): number[] {
    const damages: number[] = [];
    for (const member of this._members) {
      if (!monster.isAlive) break;
      const damage = calculateDamage(member, monster);
      monster.takeDamage(damage);
      damages.push(damage);
    }
    return damages;
  }
}
