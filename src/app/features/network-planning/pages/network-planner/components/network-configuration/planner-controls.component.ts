import { Component, output, signal } from "@angular/core";
import { FormField, FormRoot, form, min, max } from "@angular/forms/signals";
import { ColoringAlgorithm } from "../../../../engines/algorithms/algorithm.types";
import {
  DEFAULT_TRANSMITTERS,
  DEFAULT_INTERFERENCE_RADIUS,
  DEFAULT_DISTRIBUTION,
  DEFAULT_ALGORITHM,
  MAX_INTERFERENCE_RADIUS,
  MIN_INTERFERENCE_RADIUS,
  MAX_TRANSMITTERS,
  MIN_TRANSMITTERS,
} from "./planner-controls.constant";

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
  transmitters: DEFAULT_TRANSMITTERS,
  interferenceRadius: DEFAULT_INTERFERENCE_RADIUS,
  distribution: DEFAULT_DISTRIBUTION,
};

const DEFAULT_ALLOCATION: AllocationOptions = {
  algorithm: DEFAULT_ALGORITHM,
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
    min(path.transmitters, MIN_TRANSMITTERS);
    max(path.transmitters, MAX_TRANSMITTERS);

    min(path.interferenceRadius, MIN_INTERFERENCE_RADIUS);
    max(path.interferenceRadius, MAX_INTERFERENCE_RADIUS);
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
