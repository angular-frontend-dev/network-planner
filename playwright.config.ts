import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env["CI"];

const baseURL = isCI ? "http://localhost:4000" : "http://localhost:4200";

export default defineConfig({
  testDir: "./e2e",

  use: {
    baseURL,
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: isCI
      ? "npm run preview"
      : "npx ng serve network-planner --port 4200",

    url: baseURL,
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
});
