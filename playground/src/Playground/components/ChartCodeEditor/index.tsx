import { useCallback, useEffect, useImperativeHandle, useRef } from "react";
import * as monaco from "monaco-editor";
import Editor, { loader } from "@monaco-editor/react";

// 设置 loader 配置使用本地的 monaco-editor 模块
loader.config({
  monaco,
});

export type CustomRef = {
  current: {
    editorRef?: {
      current?: monaco.editor.IStandaloneCodeEditor | null;
    };
    monacoInstanceRef?: {
      current?: typeof monaco | null;
    };
  };
};
const ChartCodeEditor = ({
  ref,
  value,
  onChange,
}: {
  ref: CustomRef;
  value: string;
  onChange: (v: string | undefined) => void;
}) => {
  const handleEditorChange = (value: string | undefined) => {
    onChange?.(value);
  };

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoInstanceRef = useRef<typeof monaco | null>(null);

  useImperativeHandle(ref, () => {
    return {
      editorRef: editorRef,
      monacoInstanceRef: monacoInstanceRef,
    };
  }, []);

  useEffect(() => {
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
      const editorContainer = editor.getDomNode();
      if (editorContainer) {
        editorContainer.addEventListener("contextmenu", (e) => {
          e.preventDefault(); // 阻止默认行为
        });
      }
    },
    []
  );

  return (
    <Editor
      height="100%" // 编辑器高度
      defaultLanguage="javascript" // 默认语言
      value={value}
      onChange={handleEditorChange} // 内容变化回调
      // theme="vs" // 主题（可选：'vs', 'vs-dark', 'hc-black'）
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
        contextmenu: false, // 禁用右键菜单
        // theme: "vs", // 主题
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
        wordWrap: "on", // 启用自动换行
      }}
      onMount={handleEditorDidMount} // 获取编辑器实例
    />
  );
};

export default ChartCodeEditor;
