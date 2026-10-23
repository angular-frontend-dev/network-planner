import { Component, signal } from "@angular/core";
import type { GraphSize } from "./components/performance-summary/performance-summary.component";
import { WarningDialogComponent } from "../../../../shared/components/warning-dialog/warning-dialog.component";
import { PlannerControlsComponent } from "./components/network-configuration/planner-controls.component";
import type {
  ConfigurationOptions,
  AllocationOptions,
} from "./components/network-configuration/planner-controls.component";
import {
  GraphViewComponent,
  GraphViewOptions,
} from "../../components/graph-view/graph-view.component";
import { LoadingComponent } from "../../../../shared/components/loading/loading.component";
import {
  GraphGeneralAttributes,
  NetworkGraph,
} from "../../models/graphs/network/network-graph";
import { HeapDsatur } from "../../engines/algorithms/dsatur/implementations/heap-dsatur";
import { ScanDsatur } from "../../engines/algorithms/dsatur/implementations/scan-dsatur";
import {
  PerformanceMetric,
  PerformanceSummaryComponent,
} from "./components/performance-summary/performance-summary.component";

const EMPTY_PERFORMANCE_METRIC: PerformanceMetric = {
  graphConstruction: 0,
  algorithm: 0,
  rendering: 0,
};

const EMPTY_GRAPH_SIZE: GraphSize = {
  transmitters: 0,
  edges: 0,
  averageDegree: 0,
};

@Component({
  imports: [
    PlannerControlsComponent,
    GraphViewComponent,
    LoadingComponent,
    WarningDialogComponent,
    PerformanceSummaryComponent,
  ],
  selector: "app-network-planner",
  styleUrl: "./network-planner.page.scss",
  templateUrl: "./network-planner.page.html",
})
export class NetworkPlannerPage {
  readonly plannerGraphOptions = {
    enableNodeDrag: false,
  } satisfies Partial<GraphViewOptions>;

  readonly networkGraph = signal<NetworkGraph | null>(null);
  readonly loading = signal(false);
  readonly loadingAlgorithm = signal(false);
  readonly showNoGraphWarning = signal(false);

  performance = signal<PerformanceMetric>(EMPTY_PERFORMANCE_METRIC);
  graphSize = signal<GraphSize>(EMPTY_GRAPH_SIZE);

  graphConstructionTime = signal(0);
  renderingTime = signal(0);

  private async waitForNextPaint(): Promise<void> {
    return new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
  }

  private shouldShowAlgorithmLoading(size: number): boolean {
    return size >= 300_000;
  }

  async onGenerateNetwork(options: ConfigurationOptions): Promise<void> {
    this.performance.set(EMPTY_PERFORMANCE_METRIC);
    this.graphSize.set(EMPTY_GRAPH_SIZE);
    this.graphConstructionTime.set(0);
    this.renderingTime.set(0);

    this.loading.set(true);

    await this.waitForNextPaint();

    const graphGeneralOptions = {
      node: {
        color: "#65e5c2",
        opacity: 0.6,
        borderColor: "#10151F",
        outerBorderSize: 3,
      },
      edge: {
        color: "#817A96",
        opacity: 0.4,
      },
    } as GraphGeneralAttributes;

    const startGraphConstruction = performance.now();
    const graph = NetworkGraph.random(
      options.transmitters,
      options.interferenceRadius,
      graphGeneralOptions,
    );
    this.graphConstructionTime.set(performance.now() - startGraphConstruction);

    this.networkGraph.set(graph);
  }

  async onRunAllocation(allocationOptions: AllocationOptions) {
    const graph = this.networkGraph();

    if (!graph || graph.value.order === 0) {
      this.showNoGraphWarning.set(true);
      return;
    }

    const showLoading = this.shouldShowAlgorithmLoading(graph.value.size);

    if (showLoading) {
      this.loadingAlgorithm.set(true);

      await this.waitForNextPaint();
    }

    const startRunningAlgorithm = performance.now();

    const algorithm =
      allocationOptions.algorithm === "DSATUR-NAIVE"
        ? new ScanDsatur(graph)
        : new HeapDsatur(graph);

    const assignament = algorithm.run();

    this.performance.set({
      graphConstruction: this.graphConstructionTime(),
      algorithm: performance.now() - startRunningAlgorithm,
      rendering: this.renderingTime(),
    });

    this.graphSize.set({
      transmitters: graph.value.order,
      edges: graph.value.size,
      averageDegree:
        graph.value.order > 0 ? (2 * graph.value.size) / graph.value.order : 0,
    });

    this.networkGraph()!.assignColors(
      new Map(
        assignament.nodes.map((user) => [
          user.id.toString(),
          user.color.toString(),
        ]),
      ) as ReadonlyMap<string, string>,
      assignament.colorCount,
    );

    this.loadingAlgorithm.set(false);
  }

  onGraphRendered(renderingTime: number): void {
    this.renderingTime.set(renderingTime);
    this.loading.set(false);
  }
}
