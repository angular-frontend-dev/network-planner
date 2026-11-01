import { expect, Locator, Page } from "@playwright/test";
import { ColoringAlgorithm } from "../../../../src/app/features/network-planning/engines/algorithms/algorithm.types";
import {
  DEFAULT_ALGORITHM,
  DEFAULT_INTERFERENCE_RADIUS,
  DEFAULT_TRANSMITTERS,
} from "../../../../src/app/features/network-planning/pages/network-planner/components/network-configuration/planner-controls.constant";

export class NetworkPlannerPOM {
  constructor(private readonly page: Page) {}

  // Inputs
  readonly transmittersInput = this.page.getByLabel("Number of transmitters", {
    exact: true,
  });
  readonly interferenceRadiusInput = this.page.getByLabel(
    "Interference radius (m)",
    { exact: true },
  );
  readonly algorithmInput = this.page.getByLabel("Algorithm", { exact: true });

  // Buttons
  readonly generateNetworkButton = this.page.getByRole("button", {
    name: "Generate network",
    exact: true,
  });
  readonly runAllocationButton = this.page.getByRole("button", {
    name: "Run allocation",
    exact: true,
  });
  readonly resetButton = this.page.getByRole("button", {
    name: "Reset",
    exact: true,
  });
  readonly zoomInButton = this.page.getByRole("button", {
    name: "Zoom In",
    exact: true,
  });
  readonly zoomOutButton = this.page.getByRole("button", {
    name: "Zoom Out",
    exact: true,
  });
  readonly resetCameraButton = this.page.getByRole("button", {
    name: "Reset Camera",
    exact: true,
  });

  // Loaders
  readonly networkLoader = this.page.getByTestId("network-loader");
  readonly algorithmLoader = this.page.getByTestId("algorithm-loader");

  // Graph
  readonly networkGraph = this.page.getByTestId("network-graph");
  readonly graphTransmitters = this.page.getByTestId("graph-transmitters");
  readonly graphEdges = this.page.getByTestId("graph-edges");

  get title() {
    return this.page.getByRole("main");
  }

  async goto() {
    await this.page.goto("/network-planning/network-planner");
  }

  async fillNetworkParameters(
    transmitters: string,
    interferenceRadius: string,
    algorithm: string,
  ) {
    await this.transmittersInput.fill(transmitters);
    await this.interferenceRadiusInput.fill(interferenceRadius);
    await this.algorithmInput.selectOption(algorithm);

    await this.blurNetworkParameters();
  }

  async blurNetworkParameters() {
    await this.transmittersInput.blur();
    await this.interferenceRadiusInput.blur();
    await this.algorithmInput.blur();
  }

  async checkNetworkParameters(
    transmitters: number,
    interferenceRadius: number,
    coloringAlgorithm: ColoringAlgorithm,
  ) {
    await expect(this.transmittersInput).toHaveValue(transmitters.toString());
    await expect(this.interferenceRadiusInput).toHaveValue(
      interferenceRadius.toString(),
    );
    await expect(this.algorithmInput).toHaveValue(coloringAlgorithm);
  }

  async expectNetworkLoaderIsHidden() {
    await expect(this.networkLoader).toBeHidden();
  }

  async expectGraphChanges(
    buttonName: "Zoom In" | "Zoom Out" | "Reset Camera",
  ) {
    const before = await this.networkGraph.screenshot();

    switch (buttonName) {
      case "Zoom In":
        await this.zoomInButton.click();
        break;
      case "Zoom Out":
        await this.zoomOutButton.click();
        break;
      case "Reset Camera":
        await this.resetCameraButton.click();
        break;
    }

    await expect
      .poll(async () => {
        const after = await this.networkGraph.screenshot();
        return after.equals(before);
      })
      .toBe(false);
  }

  async expectShowGraphSize(transmitters: number) {
    await expect(this.graphTransmitters).toHaveText(transmitters.toString());
    await expect(this.graphEdges).not.toHaveText("0");
  }

  async expectSuccessfulExecution(
    defaultParameters: boolean = true,
    coloringAlgorithm: ColoringAlgorithm = DEFAULT_ALGORITHM,
    transmitters: number = DEFAULT_TRANSMITTERS,
    interferenceRadius: number = DEFAULT_INTERFERENCE_RADIUS,
  ) {
    if (!defaultParameters) {
      await this.fillNetworkParameters(
        transmitters.toString(),
        interferenceRadius.toString(),
        coloringAlgorithm,
      );
    }

    await this.checkNetworkParameters(
      transmitters,
      interferenceRadius,
      coloringAlgorithm,
    );

    await this.generateNetworkButton.click();

    await this.expectNetworkLoaderIsHidden();
    await this.expectGraphChanges("Zoom In");

    await this.runAllocationButton.click();

    await this.expectShowGraphSize(transmitters);
  }
}
