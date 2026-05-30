import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Served on GitHub Pages under /font-family-input/preview/
export default defineConfig({
  base: "/font-family-input/preview/",
  plugins: [react()],
  build: { outDir: "dist" },
  // Alias @font-family-input/html to its TypeScript source so Vite resolves it
  // without needing a pre-built dist/ (workspace:* + dist-based exports maps
  // cause resolution failures during dep scanning in CI).
  resolve: {
    alias: {
      "@font-family-input/html": resolve(__dirname, "../../packages/html/src/index.ts"),
    },
  },
});
