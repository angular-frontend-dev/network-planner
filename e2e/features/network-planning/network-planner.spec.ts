import { test, expect, Page, Locator } from "@playwright/test";
import { ColoringAlgorithm } from "../../../src/app/features/network-planning/engines/algorithms/algorithm.types";

const nameGenerateNetworkButton = "Generate network";
const nameRunAllocationButton = "Run allocation";
const nameResetButton = "Reset";
const scanDsaturAlgorithm: ColoringAlgorithm = "DSATUR-NAIVE";
const heapDsaturAlgorithm: ColoringAlgorithm = "DSATUR-HEAP";

async function expectGraphChanges(page: Page, buttonName: string) {
  const graph = page.getByTestId("network-graph");

  const before = await graph.screenshot();

  await page.getByRole("button", { name: buttonName, exact: true }).click();

  await expect
    .poll(async () => {
      const after = await graph.screenshot();
      return after.equals(before);
    })
    .toBe(false);
}

async function expectShowGraphSize(page: Page, transmittersCount: number) {
  const transmitters = page.getByTestId("graph-transmitters");
  const edges = page.getByTestId("graph-edges");

  await expect(transmitters).toHaveText(transmittersCount.toString());
  await expect(edges).not.toHaveText("0");
}

async function expectLoadingHidden(spinner: Locator) {
  await expect(spinner).toBeHidden();
}

async function expectSuccessfulExecution(
  page: Page,
  defaultParameters: boolean = true,
  coloringAlgorithm: ColoringAlgorithm = scanDsaturAlgorithm,
  transmitters: number = 2500,
  interferenceRadius: number = 60,
) {
  const errors: string[] = [];
  const generateButton = page.getByRole("button", {
    name: nameGenerateNetworkButton,
  });
  const allocateButton = page.getByRole("button", {
    name: nameRunAllocationButton,
  });
  const networkSpinner = page.getByTestId("network-loading");

  page.on("pageerror", (error) => {
    errors.push(error.message);
  });

  if (!defaultParameters) {
    await page.getByLabel("Transmitters").fill(transmitters.toString());
    await page
      .getByLabel("Interference Radius")
      .fill(interferenceRadius.toString());
    await page.getByLabel("Algorithm").selectOption(coloringAlgorithm);
  }

  await expect(page.getByLabel("Transmitters")).toHaveValue(
    transmitters.toString(),
  );
  await expect(page.getByLabel("Interference Radius")).toHaveValue(
    interferenceRadius.toString(),
  );
  await expect(page.getByLabel("Algorithm")).toHaveValue(coloringAlgorithm);

  await generateButton.click();

  await expectLoadingHidden(networkSpinner);
  await expectGraphChanges(page, "Zoom In");

  await allocateButton.click();

  await expectShowGraphSize(page, transmitters);

  expect(errors).toEqual([]);
}

test("should display the header page content title", async ({ page }) => {
  await page.goto("/network-planning/network-planner");

  await expect(page.getByRole("main")).toContainText(
    "Design and explore communication networks",
  );
});

test("should allocate frequencies successfully", async ({ page }) => {
  await page.goto("/network-planning/network-planner");

  // running with default inputs
  await expectSuccessfulExecution(page);

  //second time, changing the parameters
  await expectSuccessfulExecution(page, false, heapDsaturAlgorithm, 600, 180);
});

test("should support graph camera controls", async ({ page }) => {
  await page.goto("/network-planning/network-planner");

  await expectSuccessfulExecution(page);

  await expectGraphChanges(page, "Zoom In");
  await expectGraphChanges(page, "Zoom Out");

  await expectGraphChanges(page, "Zoom Out");
  await expectGraphChanges(page, "Reset Camera");
});

test("should reset to default parameters", async ({ page }) => {
  await page.goto("/network-planning/network-planner");

  const resetButton = page.getByRole("button", {
    name: nameResetButton,
    exact: true,
  });

  await expectSuccessfulExecution(page, false, heapDsaturAlgorithm, 4000, 60);
  await resetButton.click();

  await expectSuccessfulExecution(page);
});
