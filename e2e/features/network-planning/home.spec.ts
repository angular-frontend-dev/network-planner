import { test, expect } from "@playwright/test";
import { HomePOM } from "./pom/home.pom";

test("should display the deferred random graph", async ({ page }) => {
  const home = new HomePOM(page);

  await home.goto();
  await home.randomGraphSection.scrollIntoViewIfNeeded();

  await expect(home.randomGraphCanvas).toBeVisible();
});
