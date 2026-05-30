import { defineConfig, devices } from "@playwright/test";

const PREVIEW_URL = "http://localhost:4173/font-family-input/preview/";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  use: { baseURL: PREVIEW_URL, trace: "on-first-retry" },
  webServer: {
    command:
      "bun run --filter '@font-family-input/playground' build && bun run --filter '@font-family-input/playground' preview --port 4173 --strictPort",
    url: PREVIEW_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
