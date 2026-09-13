import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      // import { Button } from "@/components/Buttons.jsx"
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  css: {
    // 研究项目：浏览器 DevTools 里能定位到源码行，方便对照 tokens.css
    devSourcemap: true,
  },

  server: {
    host: "127.0.0.1",
    port: 5179,
    strictPort: true, // 端口被占直接报错，避免开到另一个端口上看错页面
    open: false,
    clearScreen: false,
    watch: {
      // 忽略上游解包产物（几十万个文件，防 inotify 耗尽）
      ignored: ["**/node_modules/**", "**/dist/**", "../upstream-ui/**"],
    },
  },

  preview: {
    host: "127.0.0.1",
    port: 4180,
    strictPort: true,
  },

  build: {
    // 研究项目：保留 sourcemap 便于在构建产物里回溯源码
    sourcemap: true,
    chunkSizeWarningLimit: 600,
  },
});
