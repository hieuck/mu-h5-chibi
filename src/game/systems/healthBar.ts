export function getHealthPercent(hp: number, maxHp: number): number {
  return maxHp > 0 ? Math.round((hp / maxHp) * 100) : 0;
}

export function getHealthBarColor(hp: number, maxHp: number): string {
  const pct = getHealthPercent(hp, maxHp);
  if (pct > 60) return '#44cc44';
  if (pct > 30) return '#cccc44';
  return '#cc4444';
}

export function formatHealthBar(hp: number, maxHp: number, length: number = 10): string {
  const pct = getHealthPercent(hp, maxHp);
  const filled = Math.round((pct / 100) * length);
  const empty = length - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}
