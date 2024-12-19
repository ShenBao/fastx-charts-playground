import { useEffect, useMemo, useRef } from "react";

import { transform } from "@babel/standalone";

import { getExternalScripts } from "../utils/getExternalScripts";
import Sandbox from "../utils/Sandbox";
import list from "./list";

/**
 * 编译代码为指定的目标版本
 * @param value - 需要编译的代码字符串
 * @returns 编译后的代码字符串
 */
function compile(value: string): string {
  const { code } = transform(value, {
    filename: "example.tsx",
    presets: [
      "react",
      "typescript",
      // es5 ? "es2015" : "es2016", // 根据 es5 参数选择目标版本
      "env",
      ["stage-3", { decoratorsBeforeExport: true }],
    ].filter(Boolean),
    // plugins: ["transform-modules-umd",],
    plugins: [
      [
        "transform-modules-umd",
        {
          globals: {
            // react: "React", // 映射 React 到全局变量 React
            // "react-dom": "ReactDOM",
            // "@visactor/vchart": "VChart.VChart", // 映射 bizcharts 到全局变量 BizCharts
          },
          exactGlobals: true, // 确保插件严格使用指定的全局变量名称
        },
      ],
    ],
  });

  if (!code) {
    throw new Error("Compilation failed: No code generated.");
  }

  return code;
}

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
      // `https://registry.npmmirror.com/react/18.3.1/files/umd/react.production.min.js`,
      // `https://registry.npmmirror.com/react-dom/18.3.1/files/umd/react-dom.production.min.js`,
      // `https://registry.npmmirror.com/@visactor/vchart/${item.version}/files/build/index.min.js`,
      `https://cdn.jsdelivr.net/npm/@visactor/vchart@${item.version}/build/index.min.js`,
      // `https://unpkg.com/@visactor/vchart/build/index.min.js`,
      // `/@visactor/vchart/build/index.min.js`,
      ...(item?.scripts || []),
    ];
    const res = await getExternalScripts(list);

    const scriptsList = list.map((path, index) => {
      return {
        path,
        rowCode: res?.[index],
      };
    });

    const sandbox = new Sandbox({
      multiMode: true,
    });

    scriptsList.forEach((item) => {
      const { rowCode: scriptText } = item;
      sandbox.execScriptInSandbox(scriptText as string);
    });

    const proxyWindow = sandbox.getSandbox() as {
      container: HTMLDivElement | null;
      mountNode: HTMLDivElement | null;
      CONTAINER_ID: HTMLDivElement | null;
    } & Window;

    const container = domRef.current;
    proxyWindow.container = container;
    proxyWindow.mountNode = container;
    proxyWindow.CONTAINER_ID = container;
    // @ts-ignore
    proxyWindow.VCHART_MODULE = proxyWindow.VChart;

    /**
     * 增加自己的全局变量，用于 代码 中的依赖，以下为示例
     */
    // sandbox.execScriptInSandbox(`
    //   window.g2 = window.G2;
    //   window.plots = window.Plots;
    //   window.react = window.React;
    //   window.reactDom = window.ReactDOM;
    // `);

    console.log("====================================");
    console.log("proxyWindow:", proxyWindow);

    let compiled;
    try {
      compiled = compile(item.code);
    } catch (e) {
      console.log("compile error:", e);
    }

    if (compiled) {
      const newCode = compiled
        // .replace(`CONTAINER_ID`, `window.container`)
        .replace(`VChart`, `window.VChart.VChart`);

      sandbox.execScriptInSandbox(newCode);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <div>{item?.id}</div>
      <div
        style={{ width: "90%", height: 500 }}
        ref={domRef}
        id="container-x"
      ></div>
    </div>
  );
};

export default Card;
