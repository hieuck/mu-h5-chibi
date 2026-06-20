import { CharacterClass } from '../game/entities/character';
import { getClassColor, getClassSymbol, getTierColor } from '../game/systems/spriteRenderer';

describe('SpriteRenderer', () => {
  test('each class has a distinct color', () => {
    const colors = Object.values(CharacterClass).map(c => getClassColor(c));

    const unique = new Set(colors);
    expect(unique.size).toBe(Object.values(CharacterClass).length);
  });

  test('dark knight color is red-ish', () => {
    const color = getClassColor(CharacterClass.DarkKnight);

    expect(color).toBe('#cc4444');
  });

  test('dark wizard color is blue-ish', () => {
    const color = getClassColor(CharacterClass.DarkWizard);

    expect(color).toBe('#4444cc');
  });

  test('elf color is green-ish', () => {
    const color = getClassColor(CharacterClass.Elf);

    expect(color).toBe('#44cc44');
  });

  test('each class has a symbol', () => {
    const symbol = getClassSymbol(CharacterClass.DarkKnight);

    expect(symbol).toBe('⚔');
  });

  test('getTierColor matches equipment tier colors', () => {
    expect(getTierColor('normal')).toBe('#cccccc');
    expect(getTierColor('rare')).toBe('#ffff00');
    expect(getTierColor('mythic')).toBe('#cc44ff');
  });
});
