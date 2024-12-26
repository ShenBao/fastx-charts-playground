import prettier from "prettier/standalone";
import parserBabel from "prettier/plugins/babel";
import parserEstree from "prettier/plugins/estree";
import { transform } from "@babel/standalone";

const compareVersions = (v1: string, v2: string): number => {
  const v1Parts = v1.split("-");
  const v2Parts = v2.split("-");
  const mainVersion1 = v1Parts[0].split(".").map(Number);
  const mainVersion2 = v2Parts[0].split(".").map(Number);

  for (let i = 0; i < Math.max(mainVersion1.length, mainVersion2.length); i++) {
    if ((mainVersion1[i] || 0) > (mainVersion2[i] || 0)) return -1;
    if ((mainVersion1[i] || 0) < (mainVersion2[i] || 0)) return 1;
  }

  if (v1Parts.length === 1 && v2Parts.length === 1) return 0;
  if (v1Parts.length === 1) return -1;
  if (v2Parts.length === 1) return 1;

  const preReleaseCompare = v1Parts[1].localeCompare(v2Parts[1]);
  if (preReleaseCompare !== 0) return preReleaseCompare;

  return 0;
};

/**
 * 版本排序
 * @param versions
 * @returns
 */
export const sortVersionsDescending = (versions: string[]): string[] => {
  return versions.sort(compareVersions);
};

/**
 * 格式化代码
 * @param code
 * @returns
 */
export const formatCode = async (code: string): Promise<string> => {
  const formattedCode = await prettier.format(code || "", {
    parser: "babel",
    plugins: [parserBabel, parserEstree],
    printWidth: 80, // 每行最大宽度
    tabWidth: 2, // 缩进宽度
    useTabs: false, // 使用空格代替 Tab
    semi: true, // 添加分号
    singleQuote: true, // 使用单引号，
    trailingComma: "none",
    quoteProps: "as-needed",
    bracketSameLine: false, // 确保大括号不在同一行
    bracketSpacing: true,
  });

  return formattedCode;
};

/**
 * 编译代码为指定的目标版本
 * @param value - 需要编译的代码字符串
 * @returns 编译后的代码字符串
 */
export const compileCode = (value: string): string => {
  const { code } = transform(value || "", {
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
            react: "React",
            "react-dom": "ReactDOM",
            "@antv/g2": "G2",
            "@antv/g6": "G6",
            "@antv/g2plot": "G2Plot",
            "@antv/data-set": "DataSet",
            "@ant-design/plots": "Plots",
            "@ant-design/graphs": "Graphs",
            bizcharts: "BizCharts",
            "@visactor/vchart": "VChart",
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
};
