import { Button, Layout } from "antd";
import Playground from "./Playground";

const { Header, Footer, Content } = Layout;

function App() {
  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <h1>FastX Charts Playground</h1>
      </Header>
      <Content className="app-content">
        <Playground />
      </Content>
      <Footer className="app-footer">
        <Button
          type="link"
          size="small"
          href="https://github.com/ShenBao/fastx-charts-playground"
          target="_blank"
          rel="noreferrer"
        >
          FastX Charts Playground
        </Button>
        , Made with ❤ by
        <Button
          type="link"
          size="small"
          href="https://github.com/ShenBao"
          target="_blank"
          rel="noreferrer"
        >
          ShenBao
        </Button>
        .
      </Footer>
    </Layout>
  );
}

export default App;
