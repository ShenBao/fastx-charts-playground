import { chartOptions } from "../../constants";

export const getChartLibUrl = (chartName: string, chartVersion: string) => {
  const item = chartOptions?.find((it) => it.value === chartName);
  return item?.scriptUrl?.replace("${version}", chartVersion);
};

const list = ["echarts", "@antv/g2", "@antv/g2plot"];
export const getPreDependencyScriptUrls = (chartName: string) => {
  if (list?.includes(chartName)) {
    return [];
  }

  //   依赖 React 环境
  return [
    `https://registry.npmmirror.com/react/18.3.1/files/umd/react.production.min.js`,
    `https://registry.npmmirror.com/react-dom/18.3.1/files/umd/react-dom.production.min.js`,
    `https://registry.npmmirror.com/lodash/4.17.21/files/lodash.min.js`,
  ];
};
