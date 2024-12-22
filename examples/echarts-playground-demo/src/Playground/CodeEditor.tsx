import { useCallback, useEffect, useImperativeHandle, useRef } from "react";
import * as monaco from "monaco-editor";
import Editor, { loader } from "@monaco-editor/react";

function CodeEditor({
  ref,
  value,
  onChange,
}: {
  ref: any;
  value: string;
  onChange: (v: string | undefined) => void;
}) {
  const handleEditorChange = (value: string | undefined) => {
    onChange?.(value);
  };

  // useEffect(() => {
  // monaco.editor.defineTheme("myCustomTheme", {
  //   base: "vs-dark",
  //   inherit: true,
  //   rules: [
  //     { token: "comment", foreground: "ffa500", fontStyle: "italic" },
  //     { token: "keyword", foreground: "00ff00" },
  //   ],
  //   colors: {},
  // });
  // }, []);

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoInstanceRef = useRef<typeof monaco | null>(null);

  useImperativeHandle(ref, () => {
    return {
      editorRef,
      monacoInstanceRef,
    };
  }, []);

  useEffect(() => {
    // 设置语言环境为中文
    loader.config({
      "vs/nls": {
        availableLanguages: {
          "*": "zh-cn",
        },
      },
    });
  }, []);

  // 编辑器挂载时触发
  const handleEditorDidMount = useCallback(
    (
      editor: monaco.editor.IStandaloneCodeEditor,
      monacoInstance: typeof monaco
    ) => {
      // console.log("Monaco instance:", monacoInstance);
      // console.log("Editor instance:", editor);
      editorRef.current = editor;
      monacoInstanceRef.current = monacoInstance;
    },
    []
  );

  return (
    <Editor
      height="100%" // 编辑器高度
      defaultLanguage="javascript" // 默认语言
      value={value}
      onChange={handleEditorChange} // 内容变化回调
      theme="vs" // 主题（可选：'vs', 'vs-dark', 'hc-black'）
      options={{
        // lineNumbers: 'off', // 关闭行号
        lineDecorationsWidth: 0, // 减少装饰列宽度
        scrollBeyondLastLine: false, // 禁止滚动到最后一行之后
        // minimap: { enabled: false }, // 禁用小地图
        detectIndentation: false,
        tabSize: 2,
        automaticLayout: true,
        // scrollBeyondMaxLine: false,
        // theme: 'vs-dark',
        fontSize: 14,
        // 基础换行配置
        // wordWrap: 'on',
        // indentSize: 2,
        // tabSize: 2,
        theme: "vs", // 主题
        language: "javascript",
        folding: true, // 是否折叠
        foldingHighlight: true, // 折叠等高线
        foldingStrategy: "indentation", // 折叠方式  auto | indentation
        showFoldingControls: "always", // 是否一直显示折叠 always | mouseover
        disableLayerHinting: true, // 等宽优化
        emptySelectionClipboard: false, // 空选择剪切板
        selectionClipboard: false, // 选择剪切板
        codeLens: false, // 代码镜头
        colorDecorators: true, // 颜色装饰器
        accessibilitySupport: "off", // 辅助功能支持  "auto" | "off" | "on"
        lineNumbers: "on", // 行号 取值： "on" | "off" | "relative" | "interval" | function
        lineNumbersMinChars: 5, // 行号最小字符   number
        readOnly: false, // 是否只读  取值 true | false
        minimap: {
          enabled: true, // 是否启用预览图
        }, // 预览图设置
      }}
      onMount={handleEditorDidMount} // 获取编辑器实例
    />
  );
}

export default CodeEditor;
