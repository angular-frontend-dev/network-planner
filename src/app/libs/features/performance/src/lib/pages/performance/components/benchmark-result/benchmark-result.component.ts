import { Component, input } from "@angular/core";

export interface PerformanceMetrics {
  graphConstruction: number;
  algorithm: number;
  totalRuntime: number;
}

export interface GraphInformations {
  transmitters: number;
  edges: number;
  averageDegree: number;
}

@Component({
  imports: [],
  selector: "app-benchmark-result",
  styleUrls: [
    "./benchmark-result.component.scss",
    "../../styles/_dashboard.scss",
  ],
  templateUrl: "./benchmark-result.component.html",
})
export class BenchmarkResultComponent {
  performanceMetrics = input.required<PerformanceMetrics>();
  graphInformations = input.required<GraphInformations>();
}
