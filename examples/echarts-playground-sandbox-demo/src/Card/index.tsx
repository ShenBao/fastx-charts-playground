import { useEffect, useMemo, useRef } from "react";

import { getExternalScripts } from "../EchartsSandboxPreview/getExternalScripts";
import Sandbox from "../EchartsSandboxPreview/Sandbox";
import list from "./list";

console.log("====================================");
console.log("list:", list);

const Card = ({ index }: { index: number }) => {
  const domRef = useRef<HTMLDivElement>(null);

  const item = useMemo(() => {
    return list?.find((it, subIndex) => subIndex == index);
  }, []);

  const init = async () => {
    if (!item) {
      return;
    }
    const list = [
      `https://registry.npmmirror.com/echarts/${item?.version}/files/dist/echarts.min.js`,
      ...(item?.scripts || []),
    ];
    const res = await getExternalScripts(list);

    const scriptsList = list.map((path, index) => {
      return {
        path,
        rowCode: res?.[index],
      };
    });

    console.log(`========================== ${item.id} - ${item.version}`);

    const sandbox = new Sandbox({
      multiMode: true,
    });

    scriptsList.forEach((item) => {
      const { rowCode: scriptText } = item;
      sandbox.execScriptInSandbox(scriptText as string);
    });

    sandbox.execScriptInSandbox(
      "console.log('version:', window.echarts?.version);"
    );

    const proxyWindow = sandbox.getSandbox();
    console.log("proxyWindow:", proxyWindow);

    const container = domRef.current;
    console.log("container:", container);

    // @ts-ignore
    proxyWindow.container = container;
    // sandbox.execScriptInSandbox('console.log(window.container);');
    // @ts-ignore
    proxyWindow.myChart = proxyWindow?.echarts.init(container);

    const myCode = `
        var option = {};
        ${item?.code}
        window.myChart.setOption(option);
        window.myChart.resize();
        window.onresize = () => {
          window.myChart.resize();
        };
      `;
    sandbox.execScriptInSandbox(myCode);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <div>Echarts {item?.version}</div>
      scripts:
      {item?.scripts?.map((scriptPath) => {
        return <div>{scriptPath}</div>;
      })}
      <div style={{ width: "90%", height: 500 }} ref={domRef}></div>
    </div>
  );
};

export default Card;
