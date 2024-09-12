/// <reference types="vitest" />
import { defineConfig } from "vite";
import dtsPlugin from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

import react from "@vitejs/plugin-react-swc";

import { serverOnlyPlugin } from "./vite/plugins/vite-plugin-server-only/main";

export default defineConfig({
  plugins: [tsconfigPaths(), react(), dtsPlugin({ rollupTypes: true }), serverOnlyPlugin()],
  build: {
    outDir: "build",
    ssr: true,
    sourcemap: true,
    lib: {
      entry: { "server-context": "src/main.ts" },
      name: "Server Context",
      formats: ["es"]
    },
    rollupOptions: {
      output: {
        chunkFileNames: "chunks/[name].[hash].js"
      }
    }
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/vitest.setup.js"]
  }
});
