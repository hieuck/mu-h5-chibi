import { Character } from '../entities/character';

export interface SetBonusStats {
  strength?: number;
  agility?: number;
  stamina?: number;
  energy?: number;
  defense?: number;
  attackPower?: number;
}

type PieceCount = 2 | 3 | 4 | 5;

export class SetBonusDatabase {
  private _sets: Map<string, Map<PieceCount, SetBonusStats>> = new Map();

  defineSet(setName: string, bonuses: Record<number, SetBonusStats>): void {
    const map = new Map<PieceCount, SetBonusStats>();
    for (const [pieces, stats] of Object.entries(bonuses)) {
      map.set(Number(pieces) as PieceCount, stats);
    }
    this._sets.set(setName, map);
  }

  getSetBonuses(setName: string, piecesEquipped: number): SetBonusStats | undefined {
    const set = this._sets.get(setName);
    if (!set) return undefined;
    for (const threshold of [5, 4, 3, 2] as PieceCount[]) {
      if (piecesEquipped >= threshold && set.has(threshold)) {
        return set.get(threshold);
      }
    }
    return undefined;
  }
}

export function countSetPieces(character: Character, setName: string): number {
  let count = 0;
  for (const slot of ['weapon', 'armor', 'helm', 'pants', 'gloves', 'boots', 'shield', 'wings'] as const) {
    const item = character.getEquippedItem(slot as any);
    if (item?.set === setName) count++;
  }
  return count;
}

export function getActiveBonuses(character: Character, db: SetBonusDatabase): SetBonusStats {
  const result: SetBonusStats = {};
  const processedSets = new Set<string>();

  for (const slot of ['weapon', 'armor', 'helm', 'pants', 'gloves', 'boots', 'shield', 'wings'] as const) {
    const item = character.getEquippedItem(slot as any);
    if (!item?.set || processedSets.has(item.set)) continue;
    processedSets.add(item.set);
    const count = countSetPieces(character, item.set);
    const bonus = db.getSetBonuses(item.set, count);
    if (!bonus) continue;
    for (const [stat, value] of Object.entries(bonus)) {
      if (value) {
        result[stat as keyof SetBonusStats] = (result[stat as keyof SetBonusStats] ?? 0) + value;
      }
    }
  }

  return result;
}
