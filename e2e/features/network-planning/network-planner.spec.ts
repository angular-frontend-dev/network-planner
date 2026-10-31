import { test, expect, Page, Locator } from "@playwright/test";
import { ColoringAlgorithm } from "../../../src/app/features/network-planning/engines/algorithms/algorithm.types";
import { NetworkPlannerPOM } from "./pom/network-planner.pom";

const scanDsaturAlgorithm: ColoringAlgorithm = "DSATUR-NAIVE";
const heapDsaturAlgorithm: ColoringAlgorithm = "DSATUR-HEAP";

test("should display the header page content title", async ({ page }) => {
  const networkPlannerPage = new NetworkPlannerPOM(page);

  await networkPlannerPage.goto();

  await expect(networkPlannerPage.title).toContainText(
    "Design and explore communication networks",
  );
});

test("should allocate frequencies successfully", async ({ page }) => {
  const errors: string[] = [];

  page.on("pageerror", (error) => {
    errors.push(error.message);
  });

  const networkPlannerPage = new NetworkPlannerPOM(page);

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

test("should support graph camera controls", async ({ page }) => {
  const errors: string[] = [];

  page.on("pageerror", (error) => {
    errors.push(error.message);
  });

  await page.goto("/network-planning/network-planner");

  const networkPlannerPage = new NetworkPlannerPOM(page);

  await networkPlannerPage.expectSuccessfulExecution();

  await networkPlannerPage.expectGraphChanges("Zoom In");
  await networkPlannerPage.expectGraphChanges("Zoom Out");

  await networkPlannerPage.expectGraphChanges("Zoom Out");
  await networkPlannerPage.expectGraphChanges("Reset Camera");

  expect(errors).toEqual([]);
});

test("should reset to default parameters", async ({ page }) => {
  const errors: string[] = [];

  page.on("pageerror", (error) => {
    errors.push(error.message);
  });

  await page.goto("/network-planning/network-planner");

  const networkPlannerPage = new NetworkPlannerPOM(page);

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
