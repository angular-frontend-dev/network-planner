import { Component, computed, input } from "@angular/core";

export interface PerformanceMetrics {
  graphConstruction: number;
  algorithm: number;
  rendering: number;
}

export interface GraphInformations {
  transmitters: number;
  edges: number;
  averageDegree: number;
}

@Component({
  imports: [],
  selector: "app-performance-summary",
  styleUrl: "./performance-summary.component.scss",
  templateUrl: "./performance-summary.component.html",
})
export class PerformanceSummaryComponent {
  performanceMetrics = input.required<PerformanceMetrics>();
  graphInformations = input.required<GraphInformations>();

  totalTime = computed(
    () =>
      this.performanceMetrics().graphConstruction +
      this.performanceMetrics().algorithm +
      this.performanceMetrics().rendering,
  );

  graphConstructionPercentage = computed(() =>
    this.percentage(this.performanceMetrics().graphConstruction),
  );

  algorithmPercentage = computed(() =>
    this.percentage(this.performanceMetrics().algorithm),
  );

  renderingPercentage = computed(() =>
    this.percentage(this.performanceMetrics().rendering),
  );

  private percentage(time: number): number {
    const total = this.totalTime();

    if (total === 0) {
      return 0;
    }

    return Math.round((time / total) * 100);
  }
}
