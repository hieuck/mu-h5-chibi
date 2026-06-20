export interface GuildMember {
  name: string;
  contribution: number;
  donations: number;
}

function expForLevel(level: number): number {
  return level * 200;
}

export class Guild {
  readonly name: string;
  readonly members: GuildMember[];
  exp: number = 0;
  level: number = 1;

  constructor(name: string, founderName: string) {
    this.name = name;
    this.members = [{ name: founderName, contribution: 0, donations: 0 }];
  }

  get maxMembers(): number {
    return 5 + (this.level - 1) * 2;
  }

  addExp(amount: number): void {
    this.exp += amount;
    while (this.exp >= expForLevel(this.level)) {
      this.exp -= expForLevel(this.level);
      this.level++;
    }
  }

  addMember(name: string): boolean {
    if (this.members.length >= this.maxMembers) return false;
    this.members.push({ name, contribution: 0, donations: 0 });
    return true;
  }
}
