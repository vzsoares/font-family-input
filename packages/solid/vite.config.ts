import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import solid from "vite-plugin-solid";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.tsx"),
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
    },
    rollupOptions: {
      external: ["solid-js", "solid-js/web", "@tanstack/solid-virtual", "@font-family-input/core"],
    },
    sourcemap: true,
    target: "es2022",
  },
  plugins: [solid(), dts({ rollupTypes: true, tsconfigPath: "./tsconfig.json" })],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["../../test/setup.ts"],
    server: { deps: { inline: [/solid-js/, /@solidjs\/testing-library/] } },
  },
});
