import { test, expect } from "@playwright/test";

test("should display the header page content title", async ({ page }) => {
  await page.goto("/marketing/engineering");

  await expect(page.getByRole("main")).toContainText(
    "Engineering the application",
  );
});
