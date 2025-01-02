import defaultCode_echarts from "../chartDefaultCode/echarts.txt?raw";
import defaultCode_antv_g2 from "../chartDefaultCode/antv-g2.txt?raw";
import defaultCode_antv_g2plot from "../chartDefaultCode/antv-g2plot.txt?raw";
import defaultCode_ant_design_plots from "../chartDefaultCode/ant-design-plots.txt?raw";
import defaultCode_ant_design_graphs from "../chartDefaultCode/ant-design-graphs.txt?raw";
import defaultCode_bizcharts from "../chartDefaultCode/bizcharts.txt?raw";
import defaultCode_visactor_vchart from "../chartDefaultCode/visactor_vchart.txt?raw";
import defaultCode_custom_echarts from "../chartDefaultCode/custom_echarts.txt?raw";

const isDev = process.env.NODE_ENV === "development";

export const chartOptions = [
  {
    value: "echarts",
    label: "Echarts",
    scriptUrl: "/lib/echarts/${version}/echarts.min.js",
    defaultCode: defaultCode_echarts,
    defaultCodeVersion: "5.6.0",
  },
  {
    value: "@antv/g2",
    label: "AntV G2",
    scriptUrl: "/lib/@antv/g2/${version}/g2.min.js",
    defaultCode: defaultCode_antv_g2,
    defaultCodeVersion: "5.2.12",
  },
  {
    value: "@antv/g2plot",
    label: "AntV G2Plot",
    scriptUrl: "/lib/@antv/g2plot/${version}/g2plot.min.js",
    defaultCode: defaultCode_antv_g2plot,
    defaultCodeVersion: "2.4.33",
  },
  {
    value: "@ant-design/plots",
    label: "Ant Design Plots(@ant-design/plots)",
    scriptUrl: "/lib/@ant-design/plots/${version}/plots.min.js",
    defaultCode: defaultCode_ant_design_plots,
    defaultCodeVersion: "2.3.3",
  },
  {
    value: "@ant-design/graphs",
    label: "Ant Design Graphs(@ant-design/graphs)",
    scriptUrl: "/lib/@ant-design/graphs/${version}/graphs.min.js",
    defaultCode: defaultCode_ant_design_graphs,
    defaultCodeVersion: "2.0.5",
  },
  {
    value: "bizcharts",
    label: "BizCharts",
    scriptUrl: "/lib/bizcharts/${version}/BizCharts.min.js",
    defaultCode: defaultCode_bizcharts,
    defaultCodeVersion: "4.1.23",
  },
  {
    value: "@visactor/vchart",
    label: "VisActor VChart",
    scriptUrl: "/lib/@visactor/vchart/${version}/index.min.js",
    defaultCode: defaultCode_visactor_vchart,
    defaultCodeVersion: "1.13.8",
  },
  {
    value: "user_custom",
    label: "自定义",
    scripts: [
      "/lib/echarts/5.5.0/echarts.min.js",
      "/lib/echarts/5.5.1/echarts.min.js",
    ],
    defaultCode: defaultCode_custom_echarts,
  },
];

console.log("isDev:", isDev);

// if (isDev) {
  chartOptions.forEach((option) => {
    option.scriptUrl = "." + option.scriptUrl;
    if (option.scripts) {
      option.scripts = option.scripts.map((url) => "." + url);
    }
  });
// }
