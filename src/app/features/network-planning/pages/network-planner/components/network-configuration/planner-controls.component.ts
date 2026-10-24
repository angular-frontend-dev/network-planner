import { Component, output, signal } from "@angular/core";
import { FormField, FormRoot, form, min, max } from "@angular/forms/signals";
import { ColoringAlgorithm } from "../../../../engines/algorithms/algorithm.types";

export type Distribution = "uniform" | "grid";

export interface ConfigurationOptions {
  transmitters: number;
  interferenceRadius: number;
  distribution: Distribution;
}

export interface AllocationOptions {
  algorithm: ColoringAlgorithm;
}

const DEFAULT_CONFIGURATION: ConfigurationOptions = {
  transmitters: 2500,
  interferenceRadius: 60,
  distribution: "uniform",
};

const DEFAULT_ALLOCATION: AllocationOptions = {
  algorithm: "DSATUR-NAIVE",
};

@Component({
  imports: [FormField, FormRoot],
  selector: "app-planner-controls",
  styleUrl: "./planner-controls.component.scss",
  templateUrl: "./planner-controls.component.html",
})
export class PlannerControlsComponent {
  generateNetwork = output<ConfigurationOptions>();
  runAllocation = output<AllocationOptions>();

  algorithmOptions: { id: ColoringAlgorithm; label: string }[] = [
    { id: "DSATUR-NAIVE", label: "DSATUR (naive)" },
    { id: "DSATUR-HEAP", label: "DSATUR (heap)" },
  ];

  readonly configurationModel = signal<ConfigurationOptions>({
    ...DEFAULT_CONFIGURATION,
  });

  readonly allocationModel = signal<AllocationOptions>({
    ...DEFAULT_ALLOCATION,
  });

  readonly configurationForm = form(this.configurationModel, (path) => {
    min(path.transmitters, 100);
    max(path.transmitters, 5000);

    min(path.interferenceRadius, 10);
    max(path.interferenceRadius, 200);
  });

  readonly allocationForm = form(this.allocationModel, (path) => {});

  onClickGenerateNetwork() {
    this.generateNetwork.emit(this.configurationModel());
  }

  onClickRunAllocation() {
    this.runAllocation.emit(this.allocationModel());
  }

  onClickReset() {
    this.configurationModel.set({ ...DEFAULT_CONFIGURATION });
    this.allocationModel.set({ ...DEFAULT_ALLOCATION });
  }
}
