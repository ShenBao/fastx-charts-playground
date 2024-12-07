import { useEffect, useState } from "react";
import { Button, Layout, Select, SelectProps, Splitter } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import CodeEditor from "./CodeEditor";
import { getEchartsLibraries } from "./api";
import { sortVersionsDescending } from "./utils";
import { compoutedSrcDoc } from "./srcDoc";
import ScriptsModal from "./ScriptsModal";
import defaultCode from "./defaultCode.txt?raw";

const { Header, Content } = Layout;

function Playground() {
  const [code, setCode] = useState<string | undefined>(defaultCode);
  const [version, setVersion] = useState("5.6.0");
  const [versionOptions, setVersionOptions] = useState<SelectProps["options"]>(
    []
  );
  const [scripts, setScripts] = useState<string[]>([
    "https://unpkg.com/echarts-liquidfill@2.0.6/dist/echarts-liquidfill.min.js",
  ]);

  const [iframeCode, setIframeCode] = useState(``);

  const handleChange = (value: string) => {
    setVersion(value);
  };

  const getVersionOption = () => {
    return getEchartsLibraries().then((res) => {
      const data = res.data.objects[0].package;
      const versionList = sortVersionsDescending(data?.versions || [])?.map(
        (it) => {
          return {
            value: it,
            label: it,
          };
        }
      );
      setVersionOptions(versionList);
    });
  };

  useEffect(() => {
    getVersionOption();
  }, []);

  useEffect(() => {
    const viewIframeCode = compoutedSrcDoc(version, scripts, code);
    setIframeCode(viewIframeCode);
  }, [version]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = (newScripts: string[]) => {
    setScripts(newScripts);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleRunCode = () => {
    const viewIframeCode = compoutedSrcDoc(version, scripts, code);
    setIframeCode(viewIframeCode);
  };

  return (
    <Splitter
      style={{ height: "100%", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}
    >
      <Splitter.Panel defaultSize="50%" min="40%" max="70%">
        <Layout style={{ height: "100%" }}>
          <Header className="code-header">
            <Button color="primary" variant="outlined" onClick={showModal}>
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
            <Button
              className="run-code-btn"
              type="primary"
              onClick={handleRunCode}
            >
              运行
            </Button>
          </Header>
          <Content className="code-content">
            <CodeEditor value={code || ""} onChange={setCode} />
          </Content>
        </Layout>
      </Splitter.Panel>
      <Splitter.Panel min="40%">
        <Layout className="run-layout">
          <Header className="run-header">
            <Select
              value={version}
              style={{ width: 120 }}
              showSearch
              onChange={handleChange}
              options={versionOptions}
            />
            <span>运行版本：{version} </span>
            <span>Tips：如不显示可切换版本试试</span>
          </Header>
          <Content className="run-content">
            <div style={{ height: "100%" }}>
              <iframe className="view-iframe" srcDoc={iframeCode}></iframe>
            </div>
          </Content>
        </Layout>
      </Splitter.Panel>
    </Splitter>
  );
}

export default Playground;
