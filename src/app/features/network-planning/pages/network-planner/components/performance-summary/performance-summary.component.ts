import { Component, computed, input } from "@angular/core";

export interface PerformanceMetric {
  graphConstruction: number;
  algorithm: number;
  rendering: number;
}

export interface GraphSize {
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
  performance = input.required<PerformanceMetric>();
  graphSize = input.required<GraphSize>();

  totalTime = computed(
    () =>
      this.performance().graphConstruction +
      this.performance().algorithm +
      this.performance().rendering,
  );

  graphConstructionPercentage = computed(() =>
    this.percentage(this.performance().graphConstruction),
  );

  algorithmPercentage = computed(() =>
    this.percentage(this.performance().algorithm),
  );

  renderingPercentage = computed(() =>
    this.percentage(this.performance().rendering),
  );

  private percentage(time: number): number {
    const total = this.totalTime();

    if (total === 0) {
      return 0;
    }

    return Math.round((time / total) * 100);
  }
}
