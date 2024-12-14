import code1 from "./code/code1.txt?raw";
import code2 from "./code/code2.txt?raw";
import code3 from "./code/code3.txt?raw";
import code4 from "./code/code4.txt?raw";

const list: {
  id: string;
  version: string;
  scripts?: string[];
  code: string;
}[] = [
  {
    id: "1",
    version: "5.2.12",
    code: code1,
  },
  {
    id: "2",
    version: "5.2.12",
    code: code2,
  },
  {
    id: "3",
    version: "5.2.12",
    code: code3,
  },
  {
    id: "4",
    version: "5.2.12",
    code: code4,
  },
];

export default list;
