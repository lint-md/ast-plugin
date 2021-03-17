import { PluginConfig } from './type';

export abstract class Plugin {
  cfg: PluginConfig;
  type: string;

  constructor(cfg: PluginConfig) {
    this.cfg = cfg;
  }

  abstract pre(): void;

  abstract visitor(): any;

  abstract post(): void;
}
