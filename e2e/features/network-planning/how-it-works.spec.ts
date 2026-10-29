import { test, expect } from "@playwright/test";

test("should display the header page content title", async ({ page }) => {
  await page.goto("/marketing/how-it-works");

  await expect(page.getByRole("main")).toContainText(
    "From a real problem to a graph solution",
  );
});
