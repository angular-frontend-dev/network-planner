import { test, expect } from "@playwright/test";
import { EngineeringPOM } from "./pom/engineering.pom";

test("should display the header page content title", async ({ page }) => {
  const engineeringPage = new EngineeringPOM(page);

  await engineeringPage.goto();

  await expect(engineeringPage.title).toContainText(
    "Engineering the application",
  );
});
