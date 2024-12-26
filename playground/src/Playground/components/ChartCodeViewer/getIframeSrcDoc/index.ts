import styles from "./styles";
const getIframeSrcDoc = (options: {
  chartName: string;
  scripts: string[];
  compiledCode: string | undefined;
}): string => {
  const { chartName, scripts, compiledCode } = options;

  if (!compiledCode) {
    return "";
  }

  let chartCode = `
      var container = document.querySelector('.container');
      ${compiledCode}
  `;

  if (chartName === "echarts") {
    chartCode = `
      var container = document.querySelector('.container');
      myChart = echarts.init(container);
      myChart.clear();
      var option = {};
      ${compiledCode}
      myChart.setOption(option);
      myChart.resize();
      window.onresize = () => {
        myChart.resize();
      };
    `;
  }

  if (chartName === "bizcharts") {
    chartCode = `
      var mountNode = document.querySelector('.container');
      ${compiledCode}
    `;
  }
  if (chartName === "@visactor/vchart") {
    chartCode = `
      window.VCHART_MODULE = window.VChart;
      var CONTAINER_ID = document.querySelector('.container');
      ${compiledCode.replace(` VChart(`, ` window.VChart.VChart(`)}
    `;
  }

  const inlineCode = `
    try {
      ${chartCode}
    } catch (error) {
      console.error(error);
      document.getElementById("error-wrapper").style.display = "block";
      document.getElementById("error-info").innerHTML = String(error);
    }
  `;

  return `
<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FastX Charts(${chartName}) Playground Preview</title>
    <style>
      ${styles}
    </style>
  </head>
  <body>
    <div id="container" class="container"></div>
    <div id="error-wrapper" class="error-wrapper">
      <div class="error-content">
        <div class="icon-wrapper"><svg fill-rule="evenodd" viewBox="64 64 896 896" focusable="false" data-icon="close-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M512 64c247.4 0 448 200.6 448 448S759.4 960 512 960 64 759.4 64 512 264.6 64 512 64zm127.98 274.82h-.04l-.08.06L512 466.75 384.14 338.88c-.04-.05-.06-.06-.08-.06a.12.12 0 00-.07 0c-.03 0-.05.01-.09.05l-45.02 45.02a.2.2 0 00-.05.09.12.12 0 000 .07v.02a.27.27 0 00.06.06L466.75 512 338.88 639.86c-.05.04-.06.06-.06.08a.12.12 0 000 .07c0 .03.01.05.05.09l45.02 45.02a.2.2 0 00.09.05.12.12 0 00.07 0c.02 0 .04-.01.08-.05L512 557.25l127.86 127.87c.04.04.06.05.08.05a.12.12 0 00.07 0c.03 0 .05-.01.09-.05l45.02-45.02a.2.2 0 00.05-.09.12.12 0 000-.07v-.02a.27.27 0 00-.05-.06L557.25 512l127.87-127.86c.04-.04.05-.06.05-.08a.12.12 0 000-.07c0-.03-.01-.05-.05-.09l-45.02-45.02a.2.2 0 00-.09-.05.12.12 0 00-.07 0z"></path></svg></div>
        <div class="error-text">绘制失败，请检查JS代码！</div>
        <div id="error-info" class="error-info"></div>
      </div>
    </div>
  </body>
    ${scripts?.map((url, index) => {
      return `<script id="script-${index}" src="${url}"></script>`;
    })}
  <script id="codes">
    // 此处代码为编译过后的可运行代码，如渲染失败，请自行对比排查 
    ${inlineCode}
  </script>
</html>
`;
};

export default getIframeSrcDoc;
