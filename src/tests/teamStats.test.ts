import { Character, CharacterClass } from '../game/entities/character';

describe('TeamStats', () => {
  test('each team member has independent stats', () => {
    const dk = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
    const dw = new Character({ name: 'DW', class: CharacterClass.DarkWizard });

    dk.addExp(200);
    dw.addExp(200);

    dk.allocateStat('strength', 3);
    dw.allocateStat('energy', 3);

    expect(dk.stats.strength).toBe(31);
    expect(dk.stats.energy).toBe(10);
    expect(dw.stats.strength).toBe(18);
    expect(dw.stats.energy).toBe(33);
  });

  test('total team attack power sums all members', () => {
    const dk = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
    const dw = new Character({ name: 'DW', class: CharacterClass.DarkWizard });

    const totalAtk = (dk.totalAttackPower + dw.totalAttackPower);
    expect(totalAtk).toBe(0);
  });

  test('all characters can level up independently', () => {
    const dk = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
    const dw = new Character({ name: 'DW', class: CharacterClass.DarkWizard });

    dk.addExp(500);

    expect(dk.level).toBeGreaterThan(dw.level);
  });
});
