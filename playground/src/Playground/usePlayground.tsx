import { useContext, useRef, useState } from "react";
import { CustomRef } from "./components/ChartCodeEditor";
import { FastXChartsPlaygroundContext } from "./context";
import { compileCode, formatCode } from "./utils";

const usePlayground = () => {
  const codeEditorRef = useRef<CustomRef["current"]>({
    editorRef: null,
    monacoInstanceRef: null,
  });

  const { state, setState } = useContext(FastXChartsPlaygroundContext);
  const {
    chartName,
    chartVersion,
    renderType,
    scripts,
    code,
    compiledCode,
    codeErrorInfo,
  } = state;

  console.log("====================================");
  console.log("state:", state);

  const handleCodeEditorChange = (newCode: string) => {
    setState({
      code: newCode,
      codeErrorInfo: "",
    });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = (newScripts: string[]) => {
    setState({
      ...state,
      scripts: newScripts,
    });
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
      console.error(error);
      setState({
        ...state,
        codeErrorInfo: error?.message || error,
      });
    }
  };

  const handleRunCode = async () => {
    try {
      await formatCode(code || "");
      const compiledCode = compileCode(code);
      setState({
        ...state,
        compiledCode,
      });
    } catch (error) {
      console.error(error);
      setState({
        ...state,
        codeErrorInfo: error?.message || error,
      });
    }
  };

  const handleCloseErrorInfo = () => {
    setState({
      ...state,
      codeErrorInfo: "",
    });
  };

  return {
    chartName,
    chartVersion,
    code,
    renderType,
    scripts,
    compiledCode,
    codeErrorInfo,
    codeEditorRef,
    isModalOpen,
    showModal,
    handleCancel,
    handleOk,
    handleCodeEditorChange,
    handleRunFormatDocument,
    handleRunCode,
    handleCloseErrorInfo,
  };
};

export default usePlayground;
