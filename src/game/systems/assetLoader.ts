import { AssetManifest, AssetDef } from './assetManifest';

export interface PhaserPreloadEntry {
  key: string;
  path: string;
  frameWidth: number;
  frameHeight: number;
}

export interface PhaserAnimConfig {
  name: string;
  key: string;
  frames: number[];
  frameRate: number;
  repeat: number;
}

export function getPhaserPreloadConfig(manifest: AssetManifest): PhaserPreloadEntry[] {
  return manifest.getAllKeys().map(key => {
    const def = manifest.getByKey(key)!;
    return { key, path: def.path, frameWidth: def.frameWidth, frameHeight: def.frameHeight };
  });
}

export function getAnimationConfigs(manifest: AssetManifest): Map<string, PhaserAnimConfig[]> {
  const result = new Map<string, PhaserAnimConfig[]>();

  for (const key of manifest.getAllKeys()) {
    const def = manifest.getByKey(key)!;
    const configs: PhaserAnimConfig[] = [];

    for (const [animName, animDef] of Object.entries(def.animations)) {
      const frames: number[] = [];
      for (let i = 0; i < animDef.frames; i++) {
        frames.push(i);
      }
      configs.push({
        name: `${key}_${animName}`,
        key,
        frames,
        frameRate: animDef.frameRate,
        repeat: animDef.repeat,
      });
    }

    result.set(key, configs);
  }

  return result;
}
