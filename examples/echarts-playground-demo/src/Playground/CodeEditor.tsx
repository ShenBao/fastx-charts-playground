import { useEffect } from "react";
import * as monaco from "monaco-editor";
import Editor from "@monaco-editor/react";

function CodeEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string | undefined) => void;
}) {
  const handleEditorChange = (value: string | undefined) => {
    onChange?.(value);
  };

  useEffect(() => {
    monaco.editor.defineTheme("myCustomTheme", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "ffa500", fontStyle: "italic" },
        { token: "keyword", foreground: "00ff00" },
      ],
      colors: {},
    });
  }, []);

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
      }}
    />
  );
}

export default CodeEditor;
