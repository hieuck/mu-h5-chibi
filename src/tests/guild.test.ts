import { Guild, GuildMember } from '../game/systems/guild';

describe('Guild', () => {
  test('create guild with name', () => {
    const g = new Guild('ChibiForce', 'DK');
    expect(g.name).toBe('ChibiForce');
    expect(g.members.length).toBe(1);
    expect(g.members[0].name).toBe('DK');
  });

  test('guild gains exp from member activity', () => {
    const g = new Guild('Test', 'Leader');
    g.addExp(100);
    expect(g.exp).toBe(100);
    expect(g.level).toBe(1);

    g.addExp(100);
    expect(g.level).toBe(2);
  });

  test('guild level increases member capacity', () => {
    const g = new Guild('Test', 'Leader');
    expect(g.maxMembers).toBe(5);
    g.addExp(1500);
    expect(g.level).toBeGreaterThanOrEqual(3);
    expect(g.maxMembers).toBeGreaterThan(5);
  });

  test('guild contribution tracks member activity', () => {
    const g = new Guild('Test', 'Leader');
    const leader = g.members[0];
    leader.contribution = 150;
    leader.donations = 5;

    expect(leader.contribution).toBe(150);
    expect(leader.donations).toBe(5);
  });
});
