import { AssetManifest } from '../game/systems/assetManifest';
import { getPhaserPreloadConfig, getAnimationConfigs } from '../game/systems/assetLoader';

describe('AssetLoader', () => {
  test('getPhaserPreloadConfig returns preload list', () => {
    const manifest = new AssetManifest();

    const configs = getPhaserPreloadConfig(manifest);

    expect(configs.length).toBeGreaterThan(0);
    expect(configs[0].key).toBeDefined();
    expect(configs[0].path).toBeDefined();
    expect(configs[0].frameWidth).toBeDefined();
  });

  test('all preload configs have valid frame sizes', () => {
    const manifest = new AssetManifest();

    const configs = getPhaserPreloadConfig(manifest);

    for (const c of configs) {
      expect(c.frameWidth).toBeGreaterThan(0);
      expect(c.frameHeight).toBeGreaterThan(0);
    }
  });

  test('getAnimationConfigs returns animations per key', () => {
    const manifest = new AssetManifest();

    const anims = getAnimationConfigs(manifest);

    expect(anims.size).toBe(manifest.getAllKeys().length);
  });

  test('each key has at least idle animation', () => {
    const manifest = new AssetManifest();

    const anims = getAnimationConfigs(manifest);

    for (const [key, animList] of anims) {
      expect(animList.some(a => a.name === `${key}_idle`)).toBe(true);
    }
  });

  test('animation configs have correct frame references', () => {
    const manifest = new AssetManifest();
    const dk = manifest.getByKey('character_dk')!;

    const anims = getAnimationConfigs(manifest);
    const dkAnims = anims.get('character_dk')!;

    for (const anim of dkAnims) {
      expect(anim.frameRate).toBeGreaterThan(0);
    }
  });
});
