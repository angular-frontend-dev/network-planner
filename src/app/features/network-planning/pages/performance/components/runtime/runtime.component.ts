import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  viewChild,
} from "@angular/core";

import { Chart, ChartConfiguration, registerables } from "chart.js";
import { PERFORMANCE_DATA } from "../../data/performance-data";

Chart.register(...registerables);

@Component({
  selector: "app-runtime",
  templateUrl: "./runtime.component.html",
  styleUrls: ["./runtime.component.scss", "../../styles/_dashboard.scss"],
})
export class RuntimeComponent implements AfterViewInit, OnDestroy {
  private readonly canvas =
    viewChild.required<ElementRef<HTMLCanvasElement>>("canvas");

  private chart?: Chart<"line">;

  ngAfterViewInit(): void {
    this.chart = new Chart(
      this.canvas().nativeElement,
      this.chartConfiguration,
    );
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private get chartConfiguration(): ChartConfiguration<"line"> {
    return {
      type: "line",

      data: {
        datasets: this.dataSet,
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,

        interaction: {
          mode: "nearest",
          intersect: false,
        },

        elements: {
          line: {
            borderWidth: 2.5,
          },

          point: {
            radius: 3,
            hoverRadius: 5,
            borderWidth: 1,
          },
        },

        plugins: {
          legend: {
            position: "top",
            align: "end",

            labels: {
              usePointStyle: true,
              pointStyle: "line",

              padding: 20,

              color: "#9ba7b4",

              font: {
                size: 12,
                weight: 500,
              },
            },
          },

          tooltip: {
            padding: 12,

            displayColors: true,

            callbacks: {
              title: (items) => {
                const point = items[0];

                return `${this.formatNumber(Number(point.parsed.x))} vertices`;
              },

              label: (context) => {
                return `${context.dataset.label}: ${this.formatRuntime(
                  Number(context.parsed.y),
                )}`;
              },

              afterLabel: (context) => {
                const algorithm = PERFORMANCE_DATA[context.datasetIndex];

                const sample = algorithm?.samples[context.dataIndex];

                if (!sample) {
                  return [];
                }

                const averageDegree =
                  sample.vertices > 0
                    ? (2 * sample.edges) / sample.vertices
                    : 0;

                return [
                  `Edges: ${this.formatNumber(sample.edges)}`,
                  `Average degree: ${averageDegree.toFixed(1)}`,
                ];
              },
            },
          },
        },

        scales: {
          x: {
            type: "logarithmic",

            title: {
              display: true,
              text: "Vertices",

              color: "#7f8b99",

              font: {
                size: 12,
                weight: 500,
              },

              padding: {
                top: 14,
              },
            },

            border: {
              display: false,
            },

            grid: {
              color: "rgba(255, 255, 255, 0.035)",
            },

            ticks: {
              color: "#707b88",

              maxRotation: 0,
              minRotation: 0,

              callback: (value) =>
                this.formatLogarithmicVertexTick(Number(value)),
            },
          },

          y: {
            type: "logarithmic",

            title: {
              display: true,
              text: "Runtime",

              color: "#7f8b99",

              font: {
                size: 12,
                weight: 500,
              },

              padding: {
                bottom: 14,
              },
            },

            border: {
              display: false,
            },

            grid: {
              color: "rgba(255, 255, 255, 0.035)",
            },

            ticks: {
              color: "#707b88",

              callback: (value) =>
                this.formatLogarithmicRuntimeTick(Number(value)),
            },
          },
        },
      },
    };
  }

  private get dataSet() {
    return PERFORMANCE_DATA.map((item) => ({
      label: item.algorithm,

      data: item.samples.map((point) => ({
        x: point.vertices,
        y: point.runtime,
      })),

      tension: 0,
    }));
  }

  private formatLogarithmicVertexTick(value: number): string {
    if (!this.isPowerOfTen(value)) {
      return "";
    }

    return this.formatNumber(value);
  }

  private formatLogarithmicRuntimeTick(value: number): string {
    if (!this.isPowerOfTen(value)) {
      return "";
    }

    return this.formatRuntime(value);
  }

  private isPowerOfTen(value: number): boolean {
    if (value <= 0) {
      return false;
    }

    return Number.isInteger(Math.log10(value));
  }

  private formatNumber(value: number): string {
    if (value >= 1_000_000) {
      return `${value / 1_000_000}M`;
    }

    if (value >= 1_000) {
      return `${value / 1_000}K`;
    }

    return value.toString();
  }

  private formatRuntime(milliseconds: number): string {
    if (milliseconds >= 60_000) {
      const minutes = milliseconds / 60_000;

      return `${this.formatDecimal(minutes)} min`;
    }

    if (milliseconds >= 1_000) {
      const seconds = milliseconds / 1_000;

      return `${this.formatDecimal(seconds)} s`;
    }

    return `${this.formatDecimal(milliseconds)} ms`;
  }

  private formatDecimal(value: number): string {
    if (value >= 100) {
      return value.toFixed(0);
    }

    if (value >= 10) {
      return value.toFixed(1);
    }

    return value.toFixed(2);
  }
}
