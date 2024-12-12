import code1 from "./code/code1.txt?raw";
import code2 from "./code/code2.txt?raw";
import code3 from "./code/code3.txt?raw";
import code4 from "./code/code4.txt?raw";
import code5 from "./code/code5.txt?raw";
import code6 from "./code/code6.txt?raw";
import code7 from "./code/code7.txt?raw";
import code8 from "./code/code8.txt?raw";
import code9 from "./code/code9.txt?raw";
import code10 from "./code/code10.txt?raw";
import code11 from "./code/code11.txt?raw";
import code12 from "./code/code12.txt?raw";

const list: {
  id: string;
  version: string;
  scripts?: string[];
  code: string;
}[] = [
  {
    id: "1",
    version: "5.5.0",
    code: code1,
  },
  {
    id: "2",
    version: "5.3.0",
    code: code2,
  },
  {
    id: "3",
    version: "4.7.0",
    code: code3,
  },
  {
    id: "4",
    version: "4.2.1",
    code: code4,
  },
  {
    id: "5",
    version: "3.3.1",
    code: code5,
  },
  {
    id: "6",
    version: "4.9.0",
    scripts: [
      "https://unpkg.com/echarts-liquidfill@2.0.6/dist/echarts-liquidfill.min.js",
    ],
    code: code6,
  },
  {
    id: "7",
    version: "3.8.0",
    code: code7,
  },
  {
    id: "8",
    version: "3.8.0",
    scripts: ["/dep/echarts/map/js/china.js"],
    code: code8,
  },
  {
    id: "9",
    version: "4.8.0",
    scripts: ["/dep/echarts-gl@1.1.2/echarts-gl.min.js"],
    code: code9,
  },
  {
    id: "9-error",
    version: "5.6.0",
    scripts: ["/dep/echarts-gl@1.1.2/echarts-gl.min.js"],
    code: code9,
  },
  {
    id: "10",
    version: "4.4.0",
    code: code10,
  },
  {
    id: "11",
    version: "5.6.0",
    code: code11,
  },
  {
    id: "12",
    version: "5.5.1",
    scripts: ["/echarts-gl/2.0.8/echarts-gl.min.js"],
    code: code12,
  },
];

export default list;
