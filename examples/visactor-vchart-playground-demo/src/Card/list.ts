import code1 from "./code/code1.txt?raw";
import code2 from "./code/code2.txt?raw";
import code3 from "./code/code3.txt?raw";
import code4 from "./code/code4.txt?raw";
import code5 from "./code/code5.txt?raw";
import code6 from "./code/code6.txt?raw";

const list: {
  id: string;
  version: string;
  scripts?: string[];
  code: string;
}[] = [
  {
    id: "1",
    version: "1.12.0",
    code: code1,
  },
  {
    id: "2",
    version: "1.13.7",
    code: code2,
  },
  {
    id: "3",
    version: "1.13.7",
    code: code3,
  },
  {
    id: "4",
    version: "1.13.7",
    code: code4,
  },
  {
    id: "5",
    version: "1.13.7",
    code: code5,
  },
  {
    id: "6",
    version: "1.13.0",
    code: code6,
  },
];

export default list;
