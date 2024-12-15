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
