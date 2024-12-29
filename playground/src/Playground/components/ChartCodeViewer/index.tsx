import { FC } from "react";
import ViewerWithIframe from "./ViewerWithIframe";
import ViewerWithSandbox from "./ViewerWithSandbox";
import { getChartLibUrl, getPreDependencyScriptUrls } from "./utils";

interface IChartCodeViewerProps {
  chartName?: string;
  chartVersion?: string;
  scripts?: string[];
  renderType?: "sandbox" | "iframe";
  compiledCode?: string;
}

const ChartCodeViewer: FC<IChartCodeViewerProps> = (props) => {
  const { chartName, chartVersion, scripts, renderType, compiledCode } = props;

  if (renderType === "iframe") {
    const viewScripts = [
      ...getPreDependencyScriptUrls(chartName),
      getChartLibUrl(chartName, chartVersion),
      ...scripts,
    ]?.filter(Boolean);

    return (
      <ViewerWithIframe
        chartName={chartName}
        scripts={viewScripts}
        compiledCode={compiledCode}
      />
    );
  }

  if (renderType === "sandbox") {
    const viewScripts = [
      ...getPreDependencyScriptUrls(chartName),
      getChartLibUrl(chartName, chartVersion),
      ...scripts,
    ]?.filter(Boolean);

    return (
      <ViewerWithSandbox
        key={chartName}
        chartName={chartName}
        scripts={viewScripts}
        compiledCode={compiledCode}
      />
    );
  }

  return (
    <div>
      <h3>ChartCodeViewer (Unknown rendering method)</h3>
    </div>
  );
};

export default ChartCodeViewer;
