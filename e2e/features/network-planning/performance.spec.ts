import { test, expect, Page } from "@playwright/test";
import { ColoringAlgorithm } from "../../../src/app/features/network-planning/engines/algorithms/algorithm.types";
import {
  MIN_NODES,
  MAX_NODES,
  MIN_EDGES,
  MAX_EDGES,
} from "../../../src/app/features/network-planning/pages/performance/components/benchmark-configuration/benchmark-configuration.constant";
import { PerformancePOM } from "./pom/performance.pom";

const scanDsaturAlgorithm: ColoringAlgorithm = "DSATUR-NAIVE";
const heapDsaturAlgorithm: ColoringAlgorithm = "DSATUR-HEAP";

function getMaximumNumberOfEdges(transmitters: number) {
  return Math.floor((transmitters * (transmitters - 1)) / 2);
}

test("should display the header page content title", async ({ page }) => {
  const performancePage = new PerformancePOM(page);

  await performancePage.goto();

  await expect(performancePage.title).toContainText("Performance at scale");
});

test("should run the algorithms successfully", async ({ page }) => {
  const errors: string[] = [];

  page.on("pageerror", (error) => {
    errors.push(error.message);
  });

  const performancePage = new PerformancePOM(page);
  await performancePage.goto();

  // running with default inputs
  await performancePage.expectSuccessfulExecution();

  //second time, changing the parameters
  await performancePage.expectSuccessfulExecution(
    false,
    heapDsaturAlgorithm,
    60_000,
    120_000,
  );

  expect(errors).toEqual([]);
});

test("should disable the run benchmark button", async ({ page }) => {
  const performancePage = new PerformancePOM(page);
  await performancePage.goto();

  // testing with out-of-bound values for transmitters
  await performancePage.expectDisabledRunButton(MIN_NODES - 1, MIN_EDGES);
  await performancePage.expectEnabledRunButton(MIN_NODES, MIN_EDGES);

  await performancePage.expectDisabledRunButton(MAX_NODES + 1, MAX_EDGES);
  await performancePage.expectEnabledRunButton(MAX_NODES, MAX_EDGES);

  // testing with out-of-bound values for edges
  await performancePage.expectDisabledRunButton(MIN_NODES, MIN_EDGES - 1);
  await performancePage.expectEnabledRunButton(MIN_NODES, MIN_EDGES);

  await performancePage.expectDisabledRunButton(MAX_NODES, MAX_EDGES + 1);
  await performancePage.expectEnabledRunButton(MAX_NODES, MAX_EDGES);

  // testing with edges exceeding the maximum possible for the given number of transmitters
  await performancePage.expectDisabledRunButton(
    MIN_NODES,
    getMaximumNumberOfEdges(MIN_NODES) + 1,
  );
  await performancePage.expectEnabledRunButton(
    MIN_NODES,
    getMaximumNumberOfEdges(MIN_NODES),
  );

  // testing with non-integer values
  await performancePage.expectDisabledRunButton(MIN_NODES + 45.32, MIN_EDGES);
  await performancePage.expectEnabledRunButton(
    MIN_NODES,
    Math.min(MAX_EDGES, getMaximumNumberOfEdges(MIN_NODES)),
  );

  await performancePage.expectDisabledRunButton(MIN_NODES, MIN_EDGES + 145.24);
  await performancePage.expectEnabledRunButton(
    MAX_NODES,
    Math.min(MAX_EDGES, getMaximumNumberOfEdges(MAX_NODES)),
  );
});
