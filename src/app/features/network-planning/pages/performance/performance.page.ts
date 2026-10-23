import { Component } from "@angular/core";
import { BenchmarkConfigurationComponent } from "./components/benchmark-configuration/benchmark-configuration.component";
import { BenchmarkResultComponent } from "./components/benchmark-result/benchmark-result.component";
import { RuntimeComponent } from "./components/runtime/runtime.component";
import { ReferenceBenchmarkComponent } from "./components/reference-benchmark/reference-benchmark.component";

@Component({
  imports: [
    BenchmarkConfigurationComponent,
    BenchmarkResultComponent,
    RuntimeComponent,
    ReferenceBenchmarkComponent,
  ],
  selector: "app-performance",
  styleUrl: "./performance.page.scss",
  templateUrl: "./performance.page.html",
})
export class PerformancePage {}
