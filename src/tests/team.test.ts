import { Character, CharacterClass } from '../game/entities/character';
import { Team } from '../game/systems/team';
import { ItemTier, createWeapon } from '../game/entities/equipment';
import { Monster } from '../game/entities/monster';
import { calculateDamage } from '../game/systems/combat';

describe('Team', () => {
  describe('squad management', () => {
    test('starts empty', () => {
      const team = new Team();

      expect(team.size).toBe(0);
      expect(team.members).toEqual([]);
    });

    test('adds character to squad', () => {
      const team = new Team();
      const dk = new Character({ name: 'DK', class: CharacterClass.DarkKnight });

      team.add(dk);

      expect(team.size).toBe(1);
      expect(team.members[0].name).toBe('DK');
    });

    test('max 4 characters in squad', () => {
      const team = new Team();
      for (let i = 0; i < 4; i++) {
        team.add(new Character({ name: `Char${i}`, class: CharacterClass.DarkKnight }));
      }

      expect(() => {
        team.add(new Character({ name: 'Extra', class: CharacterClass.DarkKnight }));
      }).toThrow('Squad is full (max 4)');
    });

    test('removes character from squad', () => {
      const team = new Team();
      const dk = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
      team.add(dk);

      const removed = team.remove(0);

      expect(removed?.name).toBe('DK');
      expect(team.size).toBe(0);
    });
  });

  describe('formation', () => {
    test('sets and gets formation', () => {
      const team = new Team();

      team.formation = 'V';

      expect(team.formation).toBe('V');
    });

    test('default formation is line', () => {
      const team = new Team();

      expect(team.formation).toBe('line');
    });
  });

  describe('team combat', () => {
    test('all members attack a monster', () => {
      const team = new Team();
      team.add(new Character({ name: 'DK', class: CharacterClass.DarkKnight }));
      team.add(new Character({ name: 'DW', class: CharacterClass.DarkWizard }));
      const goblin = new Monster({ name: 'Goblin', hp: 100, defense: 0, level: 1 });

      team.allAttack(goblin);

      expect(goblin.hp).toBeLessThan(100);
    });

    test('team total attack power sums all members', () => {
      const team = new Team();
      team.add(new Character({ name: 'DK', class: CharacterClass.DarkKnight }));
      team.add(new Character({ name: 'DW', class: CharacterClass.DarkWizard }));
      const sword = createWeapon({ name: 'Sword', tier: ItemTier.Normal, attackPower: 30 });
      team.members[0].equip(sword);

      expect(team.totalAttackPower).toBe(30);
    });

    test('isAlive returns false when all members dead', () => {
      const team = new Team();
      const dk = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
      dk.hp = 0;
      team.add(dk);

      expect(team.isAlive).toBe(false);
    });

    test('isAlive returns true when at least one member alive', () => {
      const team = new Team();
      const dk = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
      dk.hp = 0;
      team.add(dk);
      team.add(new Character({ name: 'DW', class: CharacterClass.DarkWizard }));

      expect(team.isAlive).toBe(true);
    });
  });
});
