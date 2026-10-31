import { test, expect } from "@playwright/test";
import { HowItWorksPOM } from "./pom/how-it-works.pom";

test("should display the header page content title", async ({ page }) => {
  const howItWorksPage = new HowItWorksPOM(page);

  await howItWorksPage.goto();

  await expect(howItWorksPage.title).toContainText(
    "From a real problem to a graph solution",
  );
});
