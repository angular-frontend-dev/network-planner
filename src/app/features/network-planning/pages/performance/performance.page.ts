import { Component, signal } from "@angular/core";
import {
  AlgorithmOption,
  BenchmarkConfigurationComponent,
  ConfigurationOptions,
} from "./components/benchmark-configuration/benchmark-configuration.component";
import {
  BenchmarkResultComponent,
  PerformanceMetrics,
  GraphInformations,
} from "./components/benchmark-result/benchmark-result.component";
import { RuntimeComponent } from "./components/runtime/runtime.component";
import { ReferenceBenchmarkComponent } from "./components/reference-benchmark/reference-benchmark.component";
import { ScanDsatur } from "../../engines/algorithms/dsatur/implementations/scan-dsatur";
import { HeapDsatur } from "../../engines/algorithms/dsatur/implementations/heap-dsatur";
import { LoadingComponent } from "../../../../shared/components/loading/loading.component";
import { UndirectedGraph } from "graphology";
import type Graph from "graphology";
import erdosRenyi from "graphology-generators/random/erdos-renyi";
import { createBenchmarkGraph } from "./graph/benchmark-graph.factory";

const EMPTY_PERFORMANCE_METRIC: PerformanceMetrics = {
  graphConstruction: 0,
  algorithm: 0,
  totalRuntime: 0,
};

const EMPTY_GRAPH_INFORMATIONS: GraphInformations = {
  transmitters: 0,
  edges: 0,
  averageDegree: 0,
};

type Time = number;

@Component({
  imports: [
    BenchmarkConfigurationComponent,
    BenchmarkResultComponent,
    RuntimeComponent,
    ReferenceBenchmarkComponent,
    LoadingComponent,
  ],
  selector: "app-performance",
  styleUrl: "./performance.page.scss",
  templateUrl: "./performance.page.html",
})
export class PerformancePage {
  readonly loadingAlgorithm = signal(false);
  readonly showNoGraphWarning = signal(false);

  performanceMetrics = signal<PerformanceMetrics>(EMPTY_PERFORMANCE_METRIC);
  graphInformations = signal<GraphInformations>(EMPTY_GRAPH_INFORMATIONS);

  private readonly DSATUR_NAIVE_OPTION: AlgorithmOption = "DSATUR-NAIVE";

  private async waitForNextPaint(): Promise<void> {
    return new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
  }

  async onRunBenchmark(options: ConfigurationOptions): Promise<void> {
    this.setPerformanceMetrics(
      EMPTY_PERFORMANCE_METRIC.graphConstruction,
      EMPTY_PERFORMANCE_METRIC.algorithm,
    );
    this.setGraphInformations(
      EMPTY_GRAPH_INFORMATIONS.transmitters,
      EMPTY_GRAPH_INFORMATIONS.edges,
    );

    this.loadingAlgorithm.set(true);

    await this.waitForNextPaint();

    const { graph, constructionTime } = this.constructGraph(
      options.transmitters,
      options.approximateSize,
    );

    const algorithmTime = this.runAlgorithm(graph, options.algorithm);

    this.setPerformanceMetrics(constructionTime, algorithmTime);
    this.setGraphInformations(graph.order, graph.size);

    this.loadingAlgorithm.set(false);
  }

  private constructGraph(
    transmitters: number,
    approximateSize: number,
  ): {
    graph: Graph;
    constructionTime: Time;
  } {
    const startConstruction = performance.now();

    const graph = createBenchmarkGraph(transmitters, approximateSize);

    const constructionTime = performance.now() - startConstruction;

    return { graph, constructionTime };
  }

  private runAlgorithm(graph: Graph, algorithmType: AlgorithmOption): Time {
    const startRunningAlgorithm = performance.now();

    const algorithm =
      algorithmType === this.DSATUR_NAIVE_OPTION
        ? new ScanDsatur(graph)
        : new HeapDsatur(graph);

    algorithm.run();

    return performance.now() - startRunningAlgorithm;
  }

  private setPerformanceMetrics(constructionTime: Time, algorithmTime: Time) {
    this.performanceMetrics.set({
      graphConstruction: constructionTime,
      algorithm: algorithmTime,
      totalRuntime: constructionTime + algorithmTime,
    });
  }

  private setGraphInformations(order: number, size: number) {
    this.graphInformations.set({
      transmitters: order,
      edges: size,
      averageDegree: order > 0 ? (2 * size) / order : 0,
    });
    console.log(this.graphInformations());
  }
}
