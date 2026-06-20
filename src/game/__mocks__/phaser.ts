const AUTO = 'AUTO';
const FIT = 'FIT';
const CENTER_BOTH = 'CENTER_BOTH';

const Scale = { FIT, CENTER_BOTH };

class Scene {
  readonly scene: { key: string };
  constructor(config: { key: string }) {
    this.scene = { key: config.key };
  }
}

export default { AUTO, Scale, Scene };
export { AUTO, Scale, Scene };
