import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

// Used by Vitest only; the library itself is built with `svelte-package`.
// `resolve.conditions` ensures Vitest picks the Svelte source of dependencies.
export default defineConfig({
  plugins: [svelte()],
  resolve: { conditions: ["svelte", "browser"] },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["../../test/setup.ts"],
  },
});
