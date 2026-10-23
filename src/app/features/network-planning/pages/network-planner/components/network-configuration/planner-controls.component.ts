import { Component, output, signal } from "@angular/core";
import { FormField, FormRoot, form, min, max } from "@angular/forms/signals";

export type Distribution = "uniform" | "clustered" | "grid";

export type AlgorithmOption = "DSATUR-NAIVE" | "DSATUR-HEAP";

export interface ConfigurationOptions {
  transmitters: number;
  interferenceRadius: number;
  distribution: Distribution;
}

export interface AllocationOptions {
  algorithm: AlgorithmOption;
  animationSpeed: number;
  showEdges: boolean;
  showCoverageArea: boolean;
  showFrequencyColors: boolean;
}

const DEFAULT_CONFIGURATION: ConfigurationOptions = {
  transmitters: 2500,
  interferenceRadius: 60,
  distribution: "uniform",
};

const DEFAULT_ALLOCATION: AllocationOptions = {
  algorithm: "DSATUR-NAIVE",
  animationSpeed: 45,
  showEdges: true,
  showCoverageArea: true,
  showFrequencyColors: true,
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

  algorithmOptions: { id: AlgorithmOption; label: string }[] = [
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

  readonly allocationForm = form(this.allocationModel, (path) => {
    min(path.animationSpeed, 1);
    max(path.animationSpeed, 100);
  });

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
