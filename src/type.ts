export interface LooseObject {
  [key: string]: any;
}

// plugin constructor 参数
export interface PluginConfig {
  throwError: (error: any) => void
  config?: LooseObject
}