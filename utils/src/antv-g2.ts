import fetch, { Response } from "node-fetch"; // 确保从 'node-fetch' 导入 Response 类型
import * as fs from "fs-extra";
import * as path from "path";

function compareVersions(v1: string, v2: string): number {
  const v1Parts = v1.split("-");
  const v2Parts = v2.split("-");
  const mainVersion1 = v1Parts[0].split(".").map(Number);
  const mainVersion2 = v2Parts[0].split(".").map(Number);

  for (let i = 0; i < Math.max(mainVersion1.length, mainVersion2.length); i++) {
    if ((mainVersion1[i] || 0) > (mainVersion2[i] || 0)) return -1;
    if ((mainVersion1[i] || 0) < (mainVersion2[i] || 0)) return 1;
  }

  if (v1Parts.length === 1 && v2Parts.length === 1) return 0; // both have no pre-release tag
  if (v1Parts.length === 1) return -1;
  if (v2Parts.length === 1) return 1; // only v1 has a pre-release tag

  const preReleaseCompare = v1Parts[1].localeCompare(v2Parts[1]);
  if (preReleaseCompare !== 0) return preReleaseCompare;

  return 0;
}

function sortVersionsDescending(versions: string[]): string[] {
  // 使用正则表达式匹配包含 alpha、beta 或 rc 的版本号
  const unstablePattern = /-?(alpha|beta|rc)\.?\d*/i;

  // 过滤掉所有包含不稳定标识的版本号
  const list = versions.filter((version) => !unstablePattern.test(version));
  return list.sort(compareVersions);
}

const fetchVersionsData = async () => {
  const url = "https://registry.npmmirror.com/-/v1/search?text=@antv/g2&size=1";

  let list = [];
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // @ts-ignore
    list = data?.objects?.[0].package.versions;

    list = sortVersionsDescending(list);

    fs.outputFile(
      "lib/antv-g2.versions.json",
      JSON.stringify(list, null, 4),
      (err) => {
        if (err) return console.error(err);
        console.log("Data written successfully to specified path!");
      }
    );
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

const init = async () => {
  const versions = await fetchVersionsData();
  console.log(versions);

  (async () => {
    for await (const version of versions) {
      setTimeout(async () => {
        // const url = `https://registry.npmmirror.com/echarts/${version}/files/dist/echarts.min.js`;
        const url = `https://registry.npmmirror.com/@antv/g2/${version}/files/dist/g2.min.js`;
        const outputPath = path.join(__dirname, "..", "lib/@antv/g2", version);

        console.log("====================================");
        console.log(url);

        const filePath = path.join(outputPath, "g2.min.js");
        try {
          console.log(`Downloading ${version}...`);
          await downloadFile(url, outputPath, filePath);
          console.log(`Downloaded and saved to ${filePath}`);
        } catch (error: any) {
          console.error(`Failed to download ${version}:`, error.message);
        }
      }, 200);
    }
  })();
};

init();
