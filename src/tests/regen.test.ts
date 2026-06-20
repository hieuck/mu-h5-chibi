import { Character, CharacterClass } from '../game/entities/character';
import { Team } from '../game/systems/team';
import { applyRegen } from '../game/systems/regen';

describe('Passive Regen', () => {
  test('regen restores HP each tick', () => {
    const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
    char.hp = 50;

    applyRegen(char);

    expect(char.hp).toBeGreaterThan(50);
  });

  test('regen restores MP each tick', () => {
    const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
    char.mp = 10;

    applyRegen(char);

    expect(char.mp).toBeGreaterThan(10);
  });

  test('regen does not exceed max HP', () => {
    const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
    char.hp = char.maxHp - 1;

    applyRegen(char);

    expect(char.hp).toBe(char.maxHp);
  });

  test('regen does not exceed max MP', () => {
    const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
    char.mp = char.maxMp - 1;

    applyRegen(char);

    expect(char.mp).toBe(char.maxMp);
  });

  test('regen scales with stamina for HP', () => {
    const lowSta = new Character({ name: 'Low', class: CharacterClass.DarkWizard });
    const highSta = new Character({ name: 'High', class: CharacterClass.DarkKnight });
    lowSta.hp = 1;
    highSta.hp = 1;
    const beforeLow = lowSta.hp;

    applyRegen(lowSta);
    applyRegen(highSta);

    expect(highSta.hp - 1).toBeGreaterThanOrEqual(lowSta.hp - beforeLow);
  });

  test('regen scales with energy for MP', () => {
    const lowEne = new Character({ name: 'Low', class: CharacterClass.DarkKnight });
    const highEne = new Character({ name: 'High', class: CharacterClass.DarkWizard });
    lowEne.mp = 1;
    highEne.mp = 1;

    applyRegen(lowEne);
    applyRegen(highEne);

    expect(highEne.mp - 1).toBeGreaterThanOrEqual(lowEne.mp - 1);
  });

  test('dead characters do not regen', () => {
    const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
    char.hp = 0;

    applyRegen(char);

    expect(char.hp).toBe(0);
  });

  test('applyTeamRegen restores all team members', () => {
    const team = new Team();
    const dk = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
    const dw = new Character({ name: 'DW', class: CharacterClass.DarkWizard });
    dk.hp = 10;
    dw.hp = 10;
    dk.mp = 5;
    dw.mp = 5;
    team.add(dk);
    team.add(dw);

    const { hpRestored, mpRestored } = applyRegen(team);

    expect(hpRestored).toBeGreaterThan(0);
    expect(mpRestored).toBeGreaterThan(0);
    expect(dk.hp).toBeGreaterThan(10);
    expect(dw.hp).toBeGreaterThan(10);
  });
});
