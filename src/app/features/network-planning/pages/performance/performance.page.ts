import {
  afterNextRender,
  Component,
  DestroyRef,
  inject,
  signal,
  viewChild,
} from "@angular/core";
import {
  BenchmarkConfigurationComponent,
  ConfigurationOptions,
} from "./components/benchmark-configuration/benchmark-configuration.component";
import {
  BenchmarkResultComponent,
  PerformanceMetrics,
  GraphInformations,
} from "./components/benchmark-result/benchmark-result.component";
import { RuntimeComponent } from "./components/runtime/runtime.component";
import { ScanDsatur } from "../../engines/algorithms/dsatur/implementations/scan-dsatur";
import { HeapDsatur } from "../../engines/algorithms/dsatur/implementations/heap-dsatur";
import { LoadingComponent } from "../../../../shared/components/loading/loading.component";
import type Graph from "graphology";
import type { ColoringAlgorithm } from "../../engines/algorithms/algorithm.types";
import { createBenchmarkGraph } from "./graph/benchmark-graph.factory";
import { Miliseconds } from "../../../../shared/types/time.type";
import {
  GuidedTourService,
  TutorialStep,
} from "../../../../shared/services/guided-tour.service";
import { TutorialPromptComponent } from "../../../../shared/components/tutorial-prompt/tutorial-prompt.component";
import {
  EMPTY_GRAPH_INFORMATIONS,
  EMPTY_PERFORMANCE_METRIC,
  TUTORIAL_STEPS,
  TUTORIAL_STORAGE_KEY,
} from "./performance.constants";

@Component({
  imports: [
    BenchmarkConfigurationComponent,
    BenchmarkResultComponent,
    RuntimeComponent,
    LoadingComponent,
    TutorialPromptComponent,
  ],
  selector: "app-performance",
  styleUrl: "./performance.page.scss",
  templateUrl: "./performance.page.html",
})
export class PerformancePage {
  private readonly guidedTour = inject(GuidedTourService);
  private readonly destroyRef = inject(DestroyRef);

  readonly tutorialPrompt = viewChild.required(TutorialPromptComponent);

  readonly loadingAlgorithm = signal(false);
  readonly showNoGraphWarning = signal(false);

  performanceMetrics = signal<PerformanceMetrics>(EMPTY_PERFORMANCE_METRIC);
  graphInformations = signal<GraphInformations>(EMPTY_GRAPH_INFORMATIONS);

  private readonly DSATUR_NAIVE_OPTION: ColoringAlgorithm = "DSATUR-NAIVE";

  constructor() {
    this.destroyRef.onDestroy(() => this.guidedTour.destroy());
    afterNextRender(() => {
      if (!localStorage.getItem(TUTORIAL_STORAGE_KEY)) {
        this.tutorialPrompt().open();
      }
    });
  }

  startTutorial() {
    this.markTutorialSeen();
    this.guidedTour.start(TUTORIAL_STEPS);
  }

  private markTutorialSeen() {
    localStorage.setItem(TUTORIAL_STORAGE_KEY, "true");
  }

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
    constructionTime: Miliseconds;
  } {
    const startConstruction = performance.now();

    const graph = createBenchmarkGraph(transmitters, approximateSize);

    const constructionTime = performance.now() - startConstruction;

    return { graph, constructionTime };
  }

  private runAlgorithm(
    graph: Graph,
    colorignAlgorithm: ColoringAlgorithm,
  ): Miliseconds {
    const startRunningAlgorithm = performance.now();

    const algorithm =
      colorignAlgorithm === this.DSATUR_NAIVE_OPTION
        ? new ScanDsatur(graph)
        : new HeapDsatur(graph);

    algorithm.run();

    return performance.now() - startRunningAlgorithm;
  }

  private setPerformanceMetrics(
    constructionTime: Miliseconds,
    algorithmTime: Miliseconds,
  ) {
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
