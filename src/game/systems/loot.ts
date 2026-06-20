export interface DropEntry {
  itemId: string;
  chance: number;
}

export interface DropTableOptions {
  entries: DropEntry[];
}

export class DropTable {
  readonly entries: DropEntry[];

  constructor(options: DropTableOptions) {
    this.entries = options.entries;
  }

  get totalWeight(): number {
    return this.entries.reduce((sum, e) => sum + e.chance, 0);
  }

  roll(randomValue: number): string | null {
    let cumulative = 0;
    for (const entry of this.entries) {
      cumulative += entry.chance;
      if (randomValue <= cumulative) {
        return entry.itemId;
      }
    }
    return null;
  }
}
