import { useEffect, useMemo, useRef } from "react";

// @ts-ignore
import { transform } from "@babel/standalone";

import { getExternalScripts } from "../utils/getExternalScripts";
import Sandbox from "../utils/Sandbox";
import list from "./list";

/**
 * 编译代码为指定的目标版本
 * @param value - 需要编译的代码字符串
 * @param es5 - 是否将代码转换为 ES5，默认为 true
 * @returns 编译后的代码字符串
 */
function compile(value: string, es5 = true): string {
  const { code } = transform(value, {
    filename: "example.tsx", // 指定文件名（用于错误报告）
    presets: [
      "react", // 支持 JSX 和 React 相关语法
      "typescript", // 支持 TypeScript
      // es5 ? "es2015" : "es2016", // 根据 es5 参数选择目标版本
      es5 ? "env" : undefined, // 使用 env 预设代替 es2015/es2016
      ["stage-3", { decoratorsBeforeExport: true }], // 支持 stage-3 提案（如装饰器）
    ].filter(Boolean),
    plugins: ["transform-modules-umd", "proposal-class-properties"], // 将模块转换为 UMD 格式
  });

  if (!code) {
    throw new Error("Compilation failed: No code generated.");
  }

  return code;
}

// 示例输入代码
const inputCode = `
import React from "react";

interface Props {
  name: string;
}

const Greeting: React.FC<Props> = ({ name }) => {
  return <h1>Hello, {name}!</h1>;
};

export default Greeting;
`;

// 调用 compile 函数
try {
  const outputCode = compile(inputCode);
  console.log("Compiled Code:\n", outputCode);
} catch (error) {
  console.error("Error during compilation:", error);
}

console.log("====================================");
console.log("list:", list);

// function compile(value: string, es5 = true) {
//   const { code } = transform(value, {
//     filename: "example",
//     presets: [
//       "react",
//       "typescript",
//       es5 ? "es2015" : "es2016",
//       ["stage-3", { decoratorsBeforeExport: true }],
//     ],
//     plugins: ["transform-modules-umd"],
//   });
//   return code;
// }

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
      // `https://registry.npmmirror.com/@antv/g2/${item?.version}/files/dist/g2.min.js`,
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

    console.log(`========================== ${item.id} - ${item.version}`);

    const sandbox = new Sandbox({
      multiMode: true,
    });

    scriptsList.forEach((item) => {
      const { rowCode: scriptText } = item;
      sandbox.execScriptInSandbox(scriptText as string);
    });

    sandbox.execScriptInSandbox(`
      window.g2 = window.G2;
      console.log('sandbox window.G2:', window.G2);
      console.log('sandbox window.g2:', window.g2);
    `);

    const proxyWindow = sandbox.getSandbox();
    console.log("proxyWindow:", proxyWindow);
    // @ts-ignore
    console.log("proxyWindow.G2:", proxyWindow.G2);

    const container = domRef.current;
    console.log("container:", container);

    // @ts-ignore
    proxyWindow.container = container;
    sandbox.execScriptInSandbox(
      'console.log("sandbox container:", window.container);'
    );

    // @ts-ignore
    proxyWindow.chart = new proxyWindow.G2.Chart({
      container,
    });

    // console.log('proxyWindow.chart:', proxyWindow.chart);

    const myCode = `
       import { Chart } from '@antv/g2';

const data = [
  { letter: 'A', frequency: 0.08167 },
  { letter: 'B', frequency: 0.01492 },
  { letter: 'C', frequency: 0.02782 },
  { letter: 'D', frequency: 0.04253 },
  { letter: 'E', frequency: 0.12702 },
  { letter: 'F', frequency: 0.02288 },
  { letter: 'G', frequency: 0.02015 },
  { letter: 'H', frequency: 0.06094 },
  { letter: 'I', frequency: 0.06966 },
  { letter: 'J', frequency: 0.00153 },
  { letter: 'K', frequency: 0.00772 },
  { letter: 'L', frequency: 0.04025 },
  { letter: 'M', frequency: 0.02406 },
  { letter: 'N', frequency: 0.06749 },
  { letter: 'O', frequency: 0.07507 },
  { letter: 'P', frequency: 0.01929 },
  { letter: 'Q', frequency: 0.00095 },
  { letter: 'R', frequency: 0.05987 },
  { letter: 'S', frequency: 0.06327 },
  { letter: 'T', frequency: 0.09056 },
  { letter: 'U', frequency: 0.02758 },
  { letter: 'V', frequency: 0.00978 },
  { letter: 'W', frequency: 0.0236 },
  { letter: 'X', frequency: 0.0015 },
  { letter: 'Y', frequency: 0.01974 },
  { letter: 'Z', frequency: 0.00074 },
];
const chart = new Chart({
  container: container,
  autoFit: true,
});

chart.interval().data(data).encode('x', 'letter').encode('y', 'frequency');

chart.render();
      `;

    // 1. 先编译代码
    let compiled;
    try {
      compiled = compile(myCode, false);
    } catch (e) {
      console.log(e);
    }
    console.log("compiled:", compiled);

    sandbox.execScriptInSandbox(compiled);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <div>{item?.version}</div>
      <div style={{ width: "90%", height: 500 }} ref={domRef}></div>
    </div>
  );
};

export default Card;
