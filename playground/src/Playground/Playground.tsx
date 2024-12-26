import { App as AntdApp, Button, Layout, Splitter } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import ChartCodeEditor from "./components/ChartCodeEditor";
import ChartCodeViewer from "./components/ChartCodeViewer";
import ScriptsModal from "./components/ScriptsModal";
import HeaderConfig from "./components/HeaderConfig";
import usePlayground from "./usePlayground";

const { Header, Content } = Layout;

const Playground = () => {
  const {
    showModal,
    isModalOpen,
    scripts,
    chartName,
    chartVersion,
    code,
    compiledCode,
    renderType,
    codeEditorRef,
    handleCancel,
    handleOk,
    handleCodeEditorChange,
    handleRunFormatDocument,
    handleRunCode,
  } = usePlayground();

  return (
    <AntdApp component={false}>
      <Layout style={{ height: "100%" }}>
        <Header className="config-header">
          <HeaderConfig />
        </Header>
        <Content>
          <Splitter
            style={{
              height: "100%",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Splitter.Panel defaultSize="50%" min="40%" max="70%">
              <Layout style={{ height: "100%" }}>
                <Header className="code-header">
                  <Button
                    color="primary"
                    variant="outlined"
                    onClick={showModal}
                  >
                    <PlusOutlined />
                    第三方脚本
                  </Button>
                  {isModalOpen ? (
                    <ScriptsModal
                      open={isModalOpen}
                      scripts={scripts}
                      onOk={handleOk}
                      onCancel={handleCancel}
                    />
                  ) : null}
                  <div
                    className="right-actions"
                    style={{
                      display: "inline-block",
                      float: "right",
                    }}
                  >
                    <Button
                      color="primary"
                      variant="dashed"
                      onClick={handleRunFormatDocument}
                    >
                      格式化代码
                    </Button>
                    <Button type="primary" onClick={handleRunCode}>
                      运行
                    </Button>
                  </div>
                </Header>
                <Content className="code-content">
                  <ChartCodeEditor
                    ref={codeEditorRef}
                    value={code || ""}
                    onChange={handleCodeEditorChange}
                  />
                </Content>
              </Layout>
            </Splitter.Panel>
            <Splitter.Panel min="40%">
              <Layout className="run-layout">
                <Header className="run-header">
                  <span>
                    Tips：当前运行版本 {chartName}@{chartVersion}
                    ，若绘制失败，请尝试切换版本重试！
                  </span>
                </Header>
                <Content className="run-content">
                  <div style={{ height: "100%" }}>
                    <ChartCodeViewer
                      chartName={chartName}
                      chartVersion={chartVersion}
                      scripts={scripts}
                      compiledCode={compiledCode}
                      renderType={renderType}
                    />
                  </div>
                </Content>
              </Layout>
            </Splitter.Panel>
          </Splitter>
        </Content>
      </Layout>
    </AntdApp>
  );
};

export default Playground;
