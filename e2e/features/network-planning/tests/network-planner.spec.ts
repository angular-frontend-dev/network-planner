import { test, expect } from "@playwright/test";
import { ColoringAlgorithm } from "../../../../src/app/features/network-planning/engines/algorithms/algorithm.types";
import { NetworkPlannerPOM } from "../pom/network-planner.pom";
import { TUTORIAL_STORAGE_KEY } from "../../../../src/app/features/network-planning/pages/network-planner/network-planner.constants";

const scanDsaturAlgorithm: ColoringAlgorithm = "DSATUR-NAIVE";
const heapDsaturAlgorithm: ColoringAlgorithm = "DSATUR-HEAP";

function getCommonTests() {
  test.describe("All tutorial scenarios", () => {
    test("should display the header page content title", async ({ page }) => {
      const networkPlannerPage = new NetworkPlannerPOM(page);

      await networkPlannerPage.goto();
      await expect(networkPlannerPage.main).toContainText(
        "Design and explore communication networks",
      );
    });

    test("should allocate frequencies successfully with changes", async ({
      page,
    }) => {
      const networkPlannerPage = new NetworkPlannerPOM(page);
      const errors: string[] = [];

      page.on("pageerror", (error) => {
        errors.push(error.message);
      });

      await networkPlannerPage.goto();

      // running with default inputs
      await networkPlannerPage.expectSuccessfulExecution();

      //second time, changing the parameters
      await networkPlannerPage.expectSuccessfulExecution(
        false,
        heapDsaturAlgorithm,
        600,
        180,
      );

      expect(errors).toEqual([]);
    });
  });
}

// First visit - dismiss tutorial
test.describe("First visit — dismiss tutorial", () => {
  test.beforeEach(async ({ page }) => {
    const networkPlannerPage = new NetworkPlannerPOM(page);
    await networkPlannerPage.goto();

    await networkPlannerPage.skipTutorial();
  });

  getCommonTests();
});

// Completed tutorial tests
test.describe("Completed tutorial", () => {
  test.beforeEach(async ({ page }) => {
    const networkPlannerPage = new NetworkPlannerPOM(page);
    await networkPlannerPage.goto();

    await networkPlannerPage.completeTutorial();

    await expect(page.locator(".driver-popover")).toBeHidden();
  });

  getCommonTests();
});

// Cached tutorial tests
test.describe("Returning user — cached tutorial", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((key) => {
      localStorage.setItem(key, "true");
    }, TUTORIAL_STORAGE_KEY);

    const networkPlannerPage = new NetworkPlannerPOM(page);
    await networkPlannerPage.goto();
  });

  test("should support graph camera controls", async ({ page }) => {
    const networkPlannerPage = new NetworkPlannerPOM(page);
    const errors: string[] = [];

    page.on("pageerror", (error) => {
      errors.push(error.message);
    });

    await networkPlannerPage.expectSuccessfulExecution();

    await networkPlannerPage.expectGraphChanges("Zoom In");
    await networkPlannerPage.expectGraphChanges("Zoom Out");

    await networkPlannerPage.expectGraphChanges("Zoom Out");
    await networkPlannerPage.expectGraphChanges("Reset Camera");

    expect(errors).toEqual([]);
  });

  test("should reset to default parameters", async ({ page }) => {
    const networkPlannerPage = new NetworkPlannerPOM(page);
    const errors: string[] = [];

    page.on("pageerror", (error) => {
      errors.push(error.message);
    });

    await networkPlannerPage.expectSuccessfulExecution(
      false,
      heapDsaturAlgorithm,
      4000,
      60,
    );
    await networkPlannerPage.resetButton.click();

    await networkPlannerPage.expectSuccessfulExecution();

    expect(errors).toEqual([]);
  });

  getCommonTests();
});
