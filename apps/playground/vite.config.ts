import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Served on GitHub Pages under /font-family-input/preview/
export default defineConfig({
  base: "/font-family-input/preview/",
  plugins: [react()],
  build: { outDir: "dist" },
});
