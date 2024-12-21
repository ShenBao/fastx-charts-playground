import fetch, { Response } from "node-fetch"; // 确保从 'node-fetch' 导入 Response 类型
import * as fs from "fs-extra";
import * as path from "path";

const chartOptions = [
  { name: "echarts", fileName: "/dist/echarts.min.js" },
  { name: "echarts-gl", fileName: "/dist/echarts-gl.min.js" },
  { name: "@antv/g2", fileName: "/dist/g2.min.js" },
  {
    name: "@ant-design/plots",
    fileName: "/dist/plots.min.js",
  },
  {
    name: "@ant-design/graphs",
    fileName: "/dist/graphs.min.js",
  },
  { name: "bizcharts", fileName: "/umd/BizCharts.min.js" },
  { name: "@visactor/vchart", fileName: "/build/index.min.js" },
];

var versionsMap: {
  [key: string]: string[];
} = {};

// https://cdn.jsdelivr.net/npm/@visactor/vchart@1.13.8/build/index.min.js

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function compareVersions(v1: string, v2: string): number {
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
}

function sortVersionsDescending(versions: string[], name: string): string[] {
  let list = [];
  if (name === "echarts") {
    list = versions.filter((version) => !version?.startsWith("2"));
  }

  list = versions.filter((version) => /^\d+\.\d+\.\d+$/.test(version));
  return list.sort(compareVersions);
}

const fetchVersionsData = async ({ name }: { name: string }) => {
  const url = `https://registry.npmmirror.com/-/v1/search?text=${name}&size=1`;

  console.log("fetchVersionsData url:", url);
  let list = [];
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // @ts-ignore
    list = data?.objects?.[0].package.versions;

    list = sortVersionsDescending(list, name);

    const versionFileName = name?.replace("@", "").replace("/", "-");
    const versionFilePath = path.join(
      __dirname,
      "..",
      `/lib/versions/${versionFileName}.json`
    );

    fs.outputFile(versionFilePath, JSON.stringify(list, null, 4), (err) => {
      if (err) return console.error(err);
      console.log("Data written successfully to specified path!");
    });
  } catch (error) {
    console.error("请求遇到问题:", error);
  }
  return list;
};

async function downloadFile(
  url: string,
  outputPath: string,
  outputLocationPath: string
): Promise<void> {
  const response: Response = await fetch(url); // 添加类型注解
  // 检查响应状态是否为 404 Not Found
  if (response.status === 404) {
    console.log("资源未找到，不生成任何内容。");
    return; // 直接返回，不做进一步处理
  }
  if (!response.ok) {
    throw new Error(`Unexpected response ${response.statusText}`);
  }
  await fs.ensureDir(outputPath);
  const fileStream = fs.createWriteStream(outputLocationPath);
  await new Promise((resolve, reject) => {
    response?.body?.pipe(fileStream);
    response?.body?.on("error", reject);
    fileStream.on("finish", () => {
      resolve(1);
    });
  });
}

const fetchPkg = async (index: number) => {
  const { name, fileName } = chartOptions[index];

  console.log("====================================");
  console.log("fetchPkg:", index, name);

  versionsMap[name] = [];
  const versions = await fetchVersionsData({ name });
  console.log(versions);

  for await (const version of versions) {
    // const url = `https://registry.npmmirror.com/echarts/${version}/files/dist/echarts.min.js`;
    // const url = `https://registry.npmmirror.com/${name}/${version}/files${fileName}`;

    // https://www.jsdelivr.com/?spm=5176.28103460.0.0.297c451eI86zQ6
    // https://unpkg.com/?spm=5176.28103460.0.0.297c451eI86zQ6
    // https://www.jsdelivr.com/?spm=5176.28103460.0.0.297c451eI86zQ6

    const url = `https://cdn.jsdelivr.net/npm/${name}@${version}${fileName}`;
    const outputPath = path.join(__dirname, "..", `lib/${name}`, version);

    console.log("====================================");
    console.log("url:", url);

    const filePath = path.join(
      outputPath,
      fileName?.split("/")?.reverse()?.[0]
    );
    try {
      console.log(`Downloading ${version} ...`);
      await downloadFile(url, outputPath, filePath);
      console.log(`Downloaded and saved to ${filePath}`);
      versionsMap[name].push(version);
    } catch (error: any) {
      console.error(`Failed to download ${version}:`, error.message);
    }
  }
};

const init = async () => {
  let i = 0;
  while (i < chartOptions.length) {
    await fetchPkg(i);
    i++;
  }
  const fileName = `index.json`;
  const versionsFilePath = path.join(
    __dirname,
    "..",
    `/lib/versions/${fileName}`
  );
  fs.outputFile(
    versionsFilePath,
    JSON.stringify(versionsMap, null, 4),
    (err) => {
      if (err) return console.error(err);
      console.log("versions file data written successfully to specified path!");
    }
  );
};

init();
