import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// The Web Component is a drop-in for plain HTML, so it must work straight from a
// CDN (unpkg / jsdelivr). We therefore BUNDLE `@font-family-input/core` (no
// externals) and emit a UMD build alongside ESM/CJS — a single <script> tag has
// no bare imports to resolve.
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "FontFamilyInput",
      formats: ["es", "cjs", "umd"],
      fileName: (format) => {
        if (format === "es") return "index.js";
        if (format === "umd") return "index.umd.cjs";
        return "index.cjs";
      },
    },
    sourcemap: true,
    target: "es2020",
  },
  plugins: [dts({ rollupTypes: true, tsconfigPath: "./tsconfig.json" })],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["../../test/setup.ts"],
  },
});
