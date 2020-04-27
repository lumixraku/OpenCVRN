export class PIPI {
  constructor(config?: string)

  // properties
  readonly activedTab: string
  readonly tabList: string[]
  readonly $dom: HTMLDivElement

  // methods
  destroy(): void
  removePlugin(pluginId: string): boolean
  showTab(pluginId: string): void
  show(): void
  hide(): void
  showSwitch(): void
  hideSwitch(): void
}
declare module "pipi.js" {
  export = PIPI;
}