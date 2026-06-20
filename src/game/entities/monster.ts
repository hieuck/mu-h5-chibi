import { DropTable } from '../systems/loot';

export interface MonsterOptions {
  name: string;
  hp: number;
  defense: number;
  level: number;
}

export class Monster {
  readonly name: string;
  readonly maxHp: number;
  readonly defense: number;
  readonly level: number;
  hp: number;
  dropTable?: DropTable;

  constructor(options: MonsterOptions) {
    this.name = options.name;
    this.maxHp = options.hp;
    this.hp = options.hp;
    this.defense = options.defense;
    this.level = options.level;
  }

  get isAlive(): boolean {
    return this.hp > 0;
  }

  takeDamage(amount: number): void {
    this.hp = Math.max(0, this.hp - amount);
  }
}
