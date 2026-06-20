import { DailyQuest, QuestDatabase } from '../game/systems/dailyQuests';

describe('DailyQuests', () => {
  test('quests have requirements and rewards', () => {
    const q = new DailyQuest({ id: 'kill_10', name: 'Kill 10 Monsters', desc: 'Defeat 10 enemies', target: 10, rewardGold: 500, rewardExp: 200 });

    expect(q.name).toBe('Kill 10 Monsters');
    expect(q.target).toBe(10);
    expect(q.rewardGold).toBe(500);
  });

  test('quest tracks progress', () => {
    const q = new DailyQuest({ id: 'kill', name: 'Kill', desc: '', target: 5, rewardGold: 100, rewardExp: 50 });
    expect(q.progress).toBe(0);
    expect(q.isComplete).toBe(false);

    q.progress = 3;
    expect(q.progress).toBe(3);
    expect(q.isComplete).toBe(false);

    q.progress = 5;
    expect(q.isComplete).toBe(true);
  });

  test('claiming reward gives gold and exp', () => {
    const q = new DailyQuest({ id: 'test', name: 'Test', desc: '', target: 1, rewardGold: 200, rewardExp: 100 });
    q.progress = 1;

    expect(q.canClaim).toBe(true);
    const result = q.claim();
    expect(result.gold).toBe(200);
    expect(result.exp).toBe(100);
    expect(q.claimed).toBe(true);
  });

  test('cannot claim incomplete quest', () => {
    const q = new DailyQuest({ id: 'test', name: 'Test', desc: '', target: 5, rewardGold: 100, rewardExp: 50 });

    expect(q.canClaim).toBe(false);
  });

  test('database manages multiple quests', () => {
    const db = new QuestDatabase();
    db.addQuest(new DailyQuest({ id: 'q1', name: 'Quest 1', desc: '', target: 10, rewardGold: 500, rewardExp: 200 }));
    db.addQuest(new DailyQuest({ id: 'q2', name: 'Quest 2', desc: '', target: 3, rewardGold: 1000, rewardExp: 500 }));

    expect(db.all().length).toBe(2);
    expect(db.get('q1')?.name).toBe('Quest 1');
  });

  test('daily quests reset', () => {
    const db = new QuestDatabase();
    const q = new DailyQuest({ id: 'daily', name: 'Daily', desc: '', target: 1, rewardGold: 100, rewardExp: 50 });
    db.addQuest(q);
    q.progress = 1;
    q.claim();
    expect(q.claimed).toBe(true);

    db.resetQuests();
    expect(q.progress).toBe(0);
    expect(q.claimed).toBe(false);
  });
});
