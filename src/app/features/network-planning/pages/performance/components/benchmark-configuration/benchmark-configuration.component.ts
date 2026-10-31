import { Component, signal } from "@angular/core";
import { output } from "@angular/core";
import { form, min, max } from "@angular/forms/signals";
import { FormField, FormRoot } from "@angular/forms/signals";
import { FieldErrorsComponent } from "../../../../../../shared/components/field-errors/field-errors.component";
import { ColoringAlgorithm } from "../../../../engines/algorithms/algorithm.types";
import { integer } from "../../../../../../shared/validators/integer.validator";
import {
  DEFAULT_TRANSMITTERS,
  DEFAULT_APPROXIMATE_SIZE,
  MAX_EDGES,
  MAX_NODES,
  MIN_EDGES,
  MIN_NODES,
} from "./benchmark-configuration.constant";

export interface ConfigurationOptions {
  algorithm: ColoringAlgorithm;
  transmitters: number;
  approximateSize: number;
}

const DEFAULT_CONFIGURATION: ConfigurationOptions = {
  algorithm: "DSATUR-NAIVE",
  transmitters: DEFAULT_TRANSMITTERS,
  approximateSize: DEFAULT_APPROXIMATE_SIZE,
};

@Component({
  imports: [FormField, FormRoot, FieldErrorsComponent],
  selector: "app-benchmark-configuration",
  styleUrls: [
    "./benchmark-configuration.component.scss",
    "../../styles/_dashboard.scss",
  ],
  templateUrl: "./benchmark-configuration.component.html",
})
export class BenchmarkConfigurationComponent {
  runBenchmark = output<ConfigurationOptions>();

  algorithmOptions: { id: ColoringAlgorithm; label: string }[] = [
    { id: "DSATUR-NAIVE", label: "DSATUR (naive)" },
    { id: "DSATUR-HEAP", label: "DSATUR (heap)" },
  ];

  readonly configurationModel = signal<ConfigurationOptions>({
    ...DEFAULT_CONFIGURATION,
  });

  readonly configurationForm = form(this.configurationModel, (path) => {
    integer(path.transmitters);
    integer(path.approximateSize);

    min(path.transmitters, MIN_NODES, {
      message: `The number of transmitters must be at least ${MIN_NODES}.`,
    });
    min(path.approximateSize, MIN_EDGES, {
      message: `The number of edges must be at least ${MIN_EDGES}.`,
    });

    max(path.transmitters, MAX_NODES, {
      message: `The number of transmitters exceeds the maximum allowed (${MAX_NODES}).`,
    });
    max(
      path.approximateSize,
      ({ valueOf }) => {
        const transmitters = valueOf(path.transmitters);

        return Math.min((transmitters * (transmitters - 1)) / 2, MAX_EDGES);
      },
      {
        message: "The number of edges exceeds the maximum.",
      },
    );
  });

  onClickRunBenchmark() {
    this.runBenchmark.emit(this.configurationModel());
  }
}
