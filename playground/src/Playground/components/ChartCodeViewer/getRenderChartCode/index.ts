const getRenderChartCode = (chartName: string, compiledCode: string) => {
  if (!compiledCode) {
    return "";
  }

  let chartCode = `
      //  挂载节点为 container、mountNode、CONTAINER_ID
      ${compiledCode}
  `;

  if (chartName === "echarts") {
    chartCode = `
        window.myChart = echarts.init(container)
        var option = {};
        ${compiledCode}
        if (typeof window.myChart.clear === 'function') {
        window.myChart.clear();
        }
        window.myChart.setOption(option);
        window.myChart.resize();
        window.onresize = () => {
        window.myChart.resize();
        };
    `;
  }

  if (chartName === "@antv/g2" || chartName === "@antv/g2plot") {
    const newCode = compiledCode.replace(
      /'container'|"container"/,
      `container`
    );

    chartCode = `
        ${newCode}
    `;
  }

  if (chartName === "@ant-design/plots" || chartName === "@ant-design/graphs") {
    const newCode = compiledCode
      .replace(`document.getElementById('container')`, `window.container`)
      .replace(`document.getElementById("container")`, `window.container`);

    chartCode = `
        ${newCode}
    `;
  }

  if (chartName === "@visactor/vchart") {
    const newCode = compiledCode.replace(` VChart(`, ` window.VChart.VChart(`);

    chartCode = `
        ${newCode}
    `;
  }

  const inlineCode = `
    //   挂载节点为 container、mountNode、CONTAINER_ID ，为同一个元素，为兼容不同 chart 库，做以兼容
    try {
        ${chartCode}
        showErrorInfo(null);
    } catch (error) {
        console.error(error);
        var msg = error && error.message ? error.message : error;
        showErrorInfo(String(msg));
    }
    `;

  return inlineCode;
};

export default getRenderChartCode;
