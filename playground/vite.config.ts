import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import monacoEditorEsmPlugin from "vite-plugin-monaco-editor-esm";

// https://vite.dev/config/
export default defineConfig({
  base: "/fastx-charts-playground/",
  server: {
    proxy: {
      "/lib": {
        target: "http://localhost:8866",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/lib/, ""),
      },
    },
  },
  optimizeDeps: {
    include: ["monaco-editor"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "monaco-editor": ["monaco-editor"],
        },
      },
    },
  },
  plugins: [react(), monacoEditorEsmPlugin()],
});
