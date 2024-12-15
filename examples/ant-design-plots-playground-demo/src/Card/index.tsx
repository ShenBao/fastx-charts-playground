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
    plugins: ["transform-modules-umd", "proposal-class-properties"],
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
      `https://registry.npmmirror.com/react/18.3.1/files/umd/react.production.min.js`,
      `https://registry.npmmirror.com/react-dom/18.3.1/files/umd/react-dom.production.min.js`,
      `https://registry.npmmirror.com/lodash/4.17.21/files/lodash.min.js`,
      `https://registry.npmmirror.com/@ant-design/plots/2.3.3/files/dist/plots.min.js`,
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
    } & Window;

    const container = domRef.current;
    proxyWindow.container = container;

    /**
     * 增加自己的全局变量，用于 代码 中的依赖，以下为示例
     */
    sandbox.execScriptInSandbox(`
      window.g2 = window.G2;
      window.plots = window.Plots;
      window.react = window.React;
      window.reactDom = window.ReactDOM;
    `);

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
        .replace(`document.getElementById('container')`, `window.container`)
        .replace(`document.getElementById("container")`, `window.container`);

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
