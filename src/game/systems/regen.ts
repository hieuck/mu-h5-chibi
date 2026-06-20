import { Character } from '../entities/character';
import { Team } from './team';

const HP_REGEN_BASE = 5;
const MP_REGEN_BASE = 3;
const HP_REGEN_PER_STA = 0.5;
const MP_REGEN_PER_ENE = 0.5;

export interface RegenResult {
  hpRestored: number;
  mpRestored: number;
}

export function applyRegen(target: Character | Team): RegenResult {
  if (target instanceof Team) {
    let totalHp = 0;
    let totalMp = 0;
    for (const member of target.members) {
      const result = applyRegenToChar(member);
      totalHp += result.hpRestored;
      totalMp += result.mpRestored;
    }
    return { hpRestored: totalHp, mpRestored: totalMp };
  }
  return applyRegenToChar(target);
}

function applyRegenToChar(char: Character): RegenResult {
  if (char.hp <= 0) return { hpRestored: 0, mpRestored: 0 };

  const hpRegen = Math.floor(HP_REGEN_BASE + char.stats.stamina * HP_REGEN_PER_STA);
  const mpRegen = Math.floor(MP_REGEN_BASE + char.stats.energy * MP_REGEN_PER_ENE);

  const hpBefore = char.hp;
  const mpBefore = char.mp;

  char.hp = Math.min(char.maxHp, char.hp + hpRegen);
  char.mp = Math.min(char.maxMp, char.mp + mpRegen);

  return {
    hpRestored: char.hp - hpBefore,
    mpRestored: char.mp - mpBefore,
  };
}
