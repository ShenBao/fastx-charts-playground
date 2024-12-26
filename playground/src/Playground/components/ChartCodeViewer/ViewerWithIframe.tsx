import { useEffect, useState } from "react";
import getIframeSrcDoc from "./getIframeSrcDoc";

const ViewerWithIframe = (props: {
  chartName: string;
  scripts: string[];
  compiledCode: string;
}) => {
  const { chartName, scripts, compiledCode } = props;
  const [iframeCode, setIframeCode] = useState(``);

  useEffect(() => {
    const viewIframeCode = getIframeSrcDoc({
      chartName,
      scripts,
      compiledCode,
    });

    console.log("viewIframeCode:", viewIframeCode);

    setIframeCode(viewIframeCode);
  }, [chartName, scripts, compiledCode]);

  return <iframe className="view-iframe" srcDoc={iframeCode}></iframe>;
};

export default ViewerWithIframe;
