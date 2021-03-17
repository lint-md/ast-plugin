import { PluginConfig } from './type';

export abstract class Plugin {
  public cfg: PluginConfig;

  constructor(cfg: PluginConfig) {
    this.cfg = cfg;
  }

  abstract pre(): void;

  abstract visitor(): any;

  abstract post(): void;
}
