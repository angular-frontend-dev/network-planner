import { expect, Page } from "@playwright/test";
import { ColoringAlgorithm } from "../../../../src/app/features/network-planning/engines/algorithms/algorithm.types";
import {
  DEFAULT_APPROXIMATE_SIZE,
  DEFAULT_TRANSMITTERS,
} from "../../../../src/app/features/network-planning/pages/performance/components/benchmark-configuration/benchmark-configuration.constant";

const scanDsaturAlgorithm: ColoringAlgorithm = "DSATUR-NAIVE";
const heapDsaturAlgorithm: ColoringAlgorithm = "DSATUR-HEAP";

export class PerformancePOM {
  constructor(private readonly page: Page) {}

  // Inputs
  readonly transmittersInput = this.page.getByLabel("Number of transmitters", {
    exact: true,
  });
  readonly numberOfEdgesInput = this.page.getByLabel(
    "Approximate number of edges",
    { exact: true },
  );
  readonly algorithmInput = this.page.getByLabel("Algorithm", { exact: true });

  // Buttons
  readonly runBenchMarkButton = this.page.getByRole("button", {
    name: "Run benchmark",
    exact: true,
  });

  // Loaders
  readonly algorithmLoader = this.page.getByTestId("algorithm-loader");

  // Graph
  readonly graphTransmitters = this.page.getByTestId("number-transmitters");
  readonly graphEdges = this.page.getByTestId("number-edges");
  readonly graphAverageDegree = this.page.getByTestId("average-degree");

  get title() {
    return this.page.getByRole("main");
  }

  async goto() {
    await this.page.goto("/network-planning/performance");
  }

  async fillBenchmarkParameters(
    transmitters: number,
    approximateSize: number,
    algorithm: string,
  ) {
    await this.transmittersInput.fill(transmitters.toString());
    await this.numberOfEdgesInput.fill(approximateSize.toString());
    await this.algorithmInput.selectOption(algorithm);
  }

  async checkBenchMarkParameters(
    transmitters: number,
    approximateSize: number,
    algorithm: string,
  ) {
    await expect(this.transmittersInput).toHaveValue(transmitters.toString());
    await expect(this.numberOfEdgesInput).toHaveValue(
      approximateSize.toString(),
    );
    await expect(this.algorithmInput).toHaveValue(algorithm);
  }

  async expectBenchmarkResult() {
    await expect(this.graphTransmitters).not.toHaveText("0");
    await expect(this.graphEdges).not.toHaveText("0.00");

    await expect
      .poll(async () => {
        const edgesDisplayed = Number(await this.graphEdges.innerText());
        const averageDisplayed = (
          await this.graphAverageDegree.innerText()
        ).trim();

        const expectedAverageDegree =
          (2 * edgesDisplayed) /
          Number(await this.graphTransmitters.innerText());

        return averageDisplayed === expectedAverageDegree.toFixed(2);
      })
      .toBe(true);
  }

  async expectDisabledRunButton(transmitters: number, approximateSize: number) {
    await this.fillBenchmarkParameters(
      transmitters,
      approximateSize,
      scanDsaturAlgorithm,
    );
    await this.checkBenchMarkParameters(
      transmitters,
      approximateSize,
      scanDsaturAlgorithm,
    );

    await expect(this.runBenchMarkButton).toBeDisabled();
  }

  async expectEnabledRunButton(transmitters: number, approximateSize: number) {
    await this.fillBenchmarkParameters(
      transmitters,
      approximateSize,
      scanDsaturAlgorithm,
    );
    await this.checkBenchMarkParameters(
      transmitters,
      approximateSize,
      scanDsaturAlgorithm,
    );

    await expect(this.runBenchMarkButton).toBeEnabled();
  }

  async expectSuccessfulExecution(
    defaultParameters: boolean = true,
    coloringAlgorithm: ColoringAlgorithm = scanDsaturAlgorithm,
    transmitters: number = DEFAULT_TRANSMITTERS,
    approximateSize: number = DEFAULT_APPROXIMATE_SIZE,
  ) {
    if (!defaultParameters) {
      await this.fillBenchmarkParameters(
        transmitters,
        approximateSize,
        coloringAlgorithm,
      );
    }
    await this.checkBenchMarkParameters(
      transmitters,
      approximateSize,
      coloringAlgorithm,
    );

    await this.runBenchMarkButton.click();

    await expect(this.algorithmLoader).toBeHidden();

    await this.expectBenchmarkResult();
  }
}
