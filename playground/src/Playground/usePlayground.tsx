import { useContext, useRef, useState } from "react";
import { CustomRef } from "./components/ChartCodeEditor";
import { compileCode, formatCode } from "./utils";
import { FastXChartsPlaygroundContext } from "./context";

const usePlayground = () => {
  const codeEditorRef = useRef<CustomRef["current"]>({
    editorRef: null,
    monacoInstanceRef: null,
  });

  const { state, setState } = useContext(FastXChartsPlaygroundContext);
  const { chartName, chartVersion, code, compiledCode, renderType } = state;

  console.log("====================================");
  console.log("state:", state);

  const handleCodeEditorChange = (newCode: string) => {
    setState({
      code: newCode,
    });
  };

  // const [versionOptions, setVersionOptions] = useState<SelectProps["options"]>(
  //   []
  // );
  const [scripts, setScripts] = useState<string[]>([
    // "https://unpkg.com/echarts-liquidfill@2.0.6/dist/echarts-liquidfill.min.js",
  ]);

  // const [iframeCode, setIframeCode] = useState(``);

  // const getVersionOption = () => {
  //   return getEchartsLibraries().then((res) => {
  //     const data = res.data.objects[0].package;
  //     const versionList = sortVersionsDescending(data?.versions || [])?.map(
  //       (it) => {
  //         return {
  //           value: it,
  //           label: it,
  //         };
  //       }
  //     );
  //     setVersionOptions(versionList);
  //   });
  // };

  // useEffect(() => {
  //   getVersionOption();
  // }, []);

  // useEffect(() => {
  //   const viewIframeCode = compoutedSrcDoc(chartVersion, scripts, code);
  //   setIframeCode(viewIframeCode);
  // }, [version]);

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

  const handleRunFormatDocument = async () => {
    try {
      const formattedCode = await formatCode(code || "");
      handleCodeEditorChange(formattedCode);
      if (codeEditorRef?.current?.editorRef?.current) {
        const editor = codeEditorRef?.current?.editorRef?.current;
        // 设置光标位置到首行开始
        editor.setPosition({ lineNumber: 1, column: 1 });
        // 滚动到顶部（确保首行可见）
        editor.revealLine(1);
        // 滚动条移动到最左侧
        editor.setScrollPosition({
          scrollLeft: 0, // 水平滚动条位置
          scrollTop: 0, // 垂直滚动条位置
        });

        setTimeout(() => {
          // 让编辑器获得焦点
          editor.focus();
        }, 200);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRunCode = () => {
    try {
      const compiledCode = compileCode(code);
      setState({
        ...state,
        compiledCode,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return {
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
  };
};

export default usePlayground;
