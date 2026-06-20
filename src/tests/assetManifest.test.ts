import { AssetManifest, AssetCategory } from '../game/systems/assetManifest';

describe('AssetManifest', () => {
  test('creates manifest with all character sprites', () => {
    const manifest = new AssetManifest();

    const chars = manifest.getByCategory(AssetCategory.Character);
    expect(chars.length).toBe(5);
    expect(chars.every(c => c.category === AssetCategory.Character)).toBe(true);
  });

    test('each character has idle animation defined', () => {
      const manifest = new AssetManifest();

      const chars = manifest.getByCategory(AssetCategory.Character);
      for (const char of chars) {
        expect(char.frameWidth).toBe(64);
        expect(char.frameHeight).toBe(64);
        expect(char.animations.idle.frames).toBeGreaterThanOrEqual(1);
      }
    });

  test('manifest has monster sprites', () => {
    const manifest = new AssetManifest();

    const monsters = manifest.getByCategory(AssetCategory.Monster);
    expect(monsters.length).toBeGreaterThanOrEqual(3);
  });

  test('manifest has UI elements', () => {
    const manifest = new AssetManifest();

    const ui = manifest.getByCategory(AssetCategory.UI);
    expect(ui.length).toBeGreaterThan(0);
  });

  test('getByKey returns specific asset', () => {
    const manifest = new AssetManifest();

    const dk = manifest.getByKey('character_dk');
    expect(dk?.name).toBe('Dark Knight');
  });

  test('getAllKeys returns all asset keys', () => {
    const manifest = new AssetManifest();

    const keys = manifest.getAllKeys();
    expect(keys.length).toBeGreaterThan(10);
  });
});
