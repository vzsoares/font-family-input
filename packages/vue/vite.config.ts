import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
    },
    rollupOptions: {
      external: ["vue", "@tanstack/vue-virtual", "@font-family-input/core"],
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
