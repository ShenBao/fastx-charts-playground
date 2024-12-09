import { Flex } from "antd";
import Card from "./Card";
import list from "./Card/list";

const baseStyle: React.CSSProperties = {
  width: "48%",
  height: "100%",
};

function App() {
  return (
    <>
    <h1>支持不同版本的 Echarts 、在 Sandbox 中执行，支持自定义扩展脚本</h1>
    <Flex wrap gap="small">
    {
      list.map((it, index) => (
        <div key={index} style={{ ...baseStyle, display: "inline-block"  }}>
          <Card index={index} />
        </div>
      ))
    }
  </Flex>
    </>
  );
}

export default App;
