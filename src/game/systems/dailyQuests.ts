export interface QuestReward {
  gold: number;
  exp: number;
}

export interface QuestOptions {
  id: string;
  name: string;
  desc: string;
  target: number;
  rewardGold: number;
  rewardExp: number;
}

export class DailyQuest {
  readonly id: string;
  readonly name: string;
  readonly desc: string;
  readonly target: number;
  readonly rewardGold: number;
  readonly rewardExp: number;
  progress: number = 0;
  claimed: boolean = false;

  constructor(options: QuestOptions) {
    this.id = options.id;
    this.name = options.name;
    this.desc = options.desc;
    this.target = options.target;
    this.rewardGold = options.rewardGold;
    this.rewardExp = options.rewardExp;
  }

  get isComplete(): boolean {
    return this.progress >= this.target;
  }

  get canClaim(): boolean {
    return this.isComplete && !this.claimed;
  }

  claim(): QuestReward {
    this.claimed = true;
    return { gold: this.rewardGold, exp: this.rewardExp };
  }
}

export class QuestDatabase {
  private quests: Map<string, DailyQuest> = new Map();

  addQuest(q: DailyQuest): void {
    this.quests.set(q.id, q);
  }

  get(id: string): DailyQuest | undefined {
    return this.quests.get(id);
  }

  all(): DailyQuest[] {
    return Array.from(this.quests.values());
  }

  getActive(): DailyQuest[] {
    return this.all().filter(q => !q.claimed);
  }

  resetQuests(): void {
    this.quests.forEach(q => { q.progress = 0; q.claimed = false; });
  }
}
