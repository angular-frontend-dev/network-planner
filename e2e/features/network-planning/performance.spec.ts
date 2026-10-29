import { test, expect } from "@playwright/test";

test("should display the header page content title", async ({ page }) => {
  await page.goto("/network-planning/performance");

  await expect(page.getByRole("main")).toContainText("Performance at scale");
});
