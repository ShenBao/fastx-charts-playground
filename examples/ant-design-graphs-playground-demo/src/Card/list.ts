import code7 from "./code/code7.txt?raw";
import code8 from "./code/code8.txt?raw";
import code9 from "./code/code9.txt?raw";
import code10 from "./code/code10.txt?raw";

const list: {
  id: string;
  scripts?: string[];
  code: string;
}[] = [
  {
    id: "7",
    code: code7,
  },
  {
    id: "8",
    code: code8,
  },
  {
    id: "9",
    code: code9,
  },
  {
    id: "10",
    code: code10,
  },
];

export default list;
