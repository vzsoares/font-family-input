import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "preact",
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
    },
    rollupOptions: {
      external: [
        "preact",
        "preact/hooks",
        "preact/jsx-runtime",
        "@font-family-input/core",
        "@tanstack/virtual-core",
      ],
    },
    sourcemap: true,
    target: "es2022",
  },
  plugins: [dts({ rollupTypes: true, tsconfigPath: "./tsconfig.json" })],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["../../test/setup.ts"],
  },
});
