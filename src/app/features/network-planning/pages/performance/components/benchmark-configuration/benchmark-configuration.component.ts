import { Component, signal } from "@angular/core";
import { output } from "@angular/core";
import { form, min, max } from "@angular/forms/signals";
import { FormField, FormRoot } from "@angular/forms/signals";
import { FieldErrorsComponent } from "../../../../../../shared/components/field-errors/field-errors.component";
export type AlgorithmOption = "DSATUR-NAIVE" | "DSATUR-HEAP";

export interface ConfigurationOptions {
  algorithm: AlgorithmOption;
  transmitters: number;
  approximateSize: number;
}

const DEFAULT_CONFIGURATION: ConfigurationOptions = {
  algorithm: "DSATUR-NAIVE",
  transmitters: 10000,
  approximateSize: 500,
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

  algorithmOptions: { id: AlgorithmOption; label: string }[] = [
    { id: "DSATUR-NAIVE", label: "DSATUR (naive)" },
    { id: "DSATUR-HEAP", label: "DSATUR (heap)" },
  ];

  readonly configurationModel = signal<ConfigurationOptions>({
    ...DEFAULT_CONFIGURATION,
  });

  readonly configurationForm = form(this.configurationModel, (path) => {
    min(path.transmitters, 5000);

    min(path.approximateSize, 500, {
      message: "The number of edges must be at least 500.",
    });
    max(
      path.approximateSize,
      ({ valueOf }) => {
        const transmitters = valueOf(path.transmitters);

        return (transmitters * (transmitters - 1)) / 2;
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
