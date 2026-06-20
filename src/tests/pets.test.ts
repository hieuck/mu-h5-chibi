import { Pet, PetRarity } from '../game/entities/pet';
import { Character, CharacterClass } from '../game/entities/character';
import { Monster } from '../game/entities/monster';
import { calculateDamage } from '../game/systems/combat';

describe('Pets', () => {
  test('pet has stats based on rarity', () => {
    const common = new Pet({ name: 'Poring', rarity: PetRarity.Common, attackBonus: 5, defenseBonus: 2, hpBonus: 50 });
    const legendary = new Pet({ name: 'Golden Poring', rarity: PetRarity.Legendary, attackBonus: 30, defenseBonus: 15, hpBonus: 500 });

    expect(legendary.attackBonus).toBeGreaterThan(common.attackBonus);
    expect(legendary.defenseBonus).toBeGreaterThan(common.defenseBonus);
  });

  test('pet equips on character and adds stats', () => {
    const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
    const pet = new Pet({ name: 'Poring', rarity: PetRarity.Common, attackBonus: 10, defenseBonus: 5, hpBonus: 100 });

    char.equipPet(pet);

    expect(char.pet?.name).toBe('Poring');
  });

  test('pet attacks monsters for bonus damage', () => {
    const char = new Character({ name: 'DK', class: CharacterClass.DarkKnight });
    const monster = new Monster({ name: 'Goblin', hp: 50, defense: 0, level: 1 });
    const pet = new Pet({ name: 'Poring', rarity: PetRarity.Common, attackBonus: 15, defenseBonus: 5, hpBonus: 100 });
    char.equipPet(pet);

    const petDamage = pet.getAttackDamage();
    monster.takeDamage(petDamage);

    expect(petDamage).toBeGreaterThan(0);
    expect(monster.hp).toBeLessThan(50);
  });

  test('pet level increases with owner', () => {
    const pet = new Pet({ name: 'Poring', rarity: PetRarity.Common, attackBonus: 5, defenseBonus: 2, hpBonus: 50 });
    pet.level = 10;

    expect(pet.level).toBe(10);
    expect(pet.getAttackDamage()).toBeGreaterThan(5);
  });
});
