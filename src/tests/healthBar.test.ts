import { getHealthBarColor, getHealthPercent, formatHealthBar } from '../game/systems/healthBar';

describe('HealthBar', () => {
  test('getHealthPercent returns correct percentage', () => {
    expect(getHealthPercent(50, 100)).toBe(50);
    expect(getHealthPercent(0, 100)).toBe(0);
    expect(getHealthPercent(100, 100)).toBe(100);
  });

  test('getHealthBarColor returns green for high HP', () => {
    const color = getHealthBarColor(80, 100);
    expect(color).toBe('#44cc44');
  });

  test('getHealthBarColor returns yellow for medium HP', () => {
    const color = getHealthBarColor(50, 100);
    expect(color).toBe('#cccc44');
  });

  test('getHealthBarColor returns red for low HP', () => {
    const color = getHealthBarColor(20, 100);
    expect(color).toBe('#cc4444');
  });

  test('formatHealthBar creates visual bar', () => {
    const bar = formatHealthBar(75, 100, 10);

    expect(bar.length).toBe(10);
    expect(bar).toContain('█');
    expect(bar).toContain('░');
  });

  test('formatHealthBar full bar', () => {
    const bar = formatHealthBar(100, 100, 10);
    expect(bar).toBe('██████████');
  });

  test('formatHealthBar empty bar', () => {
    const bar = formatHealthBar(0, 100, 10);
    expect(bar).toBe('░░░░░░░░░░');
  });
});
