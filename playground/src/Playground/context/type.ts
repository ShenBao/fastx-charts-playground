export interface IFastXChartsPlaygroundContext {
  /**
   * charts 库名称
   */
  chartName?: string;
  /**
   * 版本
   */
  chartVersion?: string;
  /**
   * 三方 scripts
   */
  scripts?: string[];
  /**
   * 渲染方式
   */
  renderType?: "sandbox" | "iframe";

  /**
   * 原始代码
   */
  code: string | undefined;
  /**
   * 编译后的代码
   */
  compiledCode?: string;
}
