import { test, expect } from "@playwright/test";

test("should display the deferred random graph", async ({ page }) => {
  await page.goto("/");

  const section = page.getByTestId("home-random-graph");

  await section.scrollIntoViewIfNeeded();

  await expect(section.locator("canvas")).toBeVisible({
    timeout: 10_000,
  });
});
