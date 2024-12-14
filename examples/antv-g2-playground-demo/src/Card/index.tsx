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
      `https://registry.npmmirror.com/@antv/g2/5.2.12/files/dist/g2.min.js`,
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

    // 将 G2 转换为 为 g2，供 编译后的代码使用
    sandbox.execScriptInSandbox(`
      window.g2 = window.G2;
    `);

    const proxyWindow  = sandbox.getSandbox() as {
      G2: any,
      container: HTMLDivElement | null,
      chart: unknown
    } & Window;

    const container = domRef.current;
    proxyWindow.container = container;
    
    proxyWindow.chart = new proxyWindow.G2.Chart({
      container,
    });

    let compiled;
    try {
      compiled = compile(item.code);
    } catch (e) {
      console.log(e);
    }
    if (compiled) {
      const newCode = compiled.replace(/'container'|"container"/, `container`);
      sandbox.execScriptInSandbox(newCode);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <div>{item?.id}</div>
      <div style={{ width: "90%", height: 500 }} ref={domRef}></div>
    </div>
  );
};

export default Card;
