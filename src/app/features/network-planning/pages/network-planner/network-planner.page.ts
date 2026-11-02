import {
  afterNextRender,
  Component,
  DestroyRef,
  inject,
  signal,
  viewChild,
} from "@angular/core";
import type { GraphInformations } from "./components/performance-summary/performance-summary.component";
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
  Network,
} from "../../models/network/network.model";
import { HeapDsatur } from "../../engines/algorithms/dsatur/implementations/heap-dsatur";
import { ScanDsatur } from "../../engines/algorithms/dsatur/implementations/scan-dsatur";
import {
  PerformanceMetrics,
  PerformanceSummaryComponent,
} from "./components/performance-summary/performance-summary.component";
import Graph from "graphology";
import { ColoringAlgorithm } from "../../engines/algorithms/algorithm.types";
import { Miliseconds } from "../../../../shared/types/time.type";
import { DsaturResult } from "../../engines/algorithms/dsatur/models/dsatur-result";
import {
  GuidedTourService,
  TutorialStep,
} from "../../../../shared/services/guided-tour.service";
import { TutorialPromptComponent } from "../../../../shared/components/tutorial-prompt/tutorial-prompt.component";
import {
  EMPTY_PERFORMANCE_METRICS,
  EMPTY_GRAPH_INFORMATIONS,
  TUTORIAL_STORAGE_KEY,
  TUTORIAL_STEPS,
} from "./network-planner.constants";

@Component({
  imports: [
    PlannerControlsComponent,
    GraphViewComponent,
    LoadingComponent,
    WarningDialogComponent,
    PerformanceSummaryComponent,
    TutorialPromptComponent,
  ],
  selector: "app-network-planner",
  styleUrl: "./network-planner.page.scss",
  templateUrl: "./network-planner.page.html",
})
export class NetworkPlannerPage {
  readonly plannerGraphOptions = {
    enableCameraPanning: true,
    enableCameraZooming: true,
    enableNodeDrag: true,
    enableToolBar: true,
  } satisfies Partial<GraphViewOptions>;

  private readonly guidedTour = inject(GuidedTourService);
  private readonly destroyRef = inject(DestroyRef);

  readonly tutorialPrompt = viewChild.required(TutorialPromptComponent);

  readonly network = signal<Network | null>(null);
  readonly loadingNetwork = signal(false);
  readonly loadingAlgorithm = signal(false);
  readonly showNoGraphWarning = signal(false);

  performanceMetrics = signal<PerformanceMetrics>(EMPTY_PERFORMANCE_METRICS);
  graphInformations = signal<GraphInformations>(EMPTY_GRAPH_INFORMATIONS);

  private graphConstructionTime: number = 0;
  private renderingTime: number = 0;

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

  private shouldShowAlgorithmLoading(size: number): boolean {
    return size >= 300_000;
  }

  async onGenerateNetwork(options: ConfigurationOptions): Promise<void> {
    this.setPerformanceMetrics(
      EMPTY_PERFORMANCE_METRICS.graphConstruction,
      EMPTY_PERFORMANCE_METRICS.algorithm,
      EMPTY_PERFORMANCE_METRICS.rendering,
    );
    this.setGraphInformations(
      EMPTY_GRAPH_INFORMATIONS.transmitters,
      EMPTY_GRAPH_INFORMATIONS.edges,
    );

    this.graphConstructionTime = 0;
    this.renderingTime = 0;

    this.loadingNetwork.set(true);

    await this.waitForNextPaint();

    const { graph, constructionTime } = this.constructGraph(options);

    this.network.set(graph);
    this.graphConstructionTime = constructionTime;
  }

  private constructGraph(options: ConfigurationOptions): {
    graph: Network;
    constructionTime: Miliseconds;
  } {
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
    const graph = Network.random(
      options.transmitters,
      options.interferenceRadius,
      graphGeneralOptions,
    );
    const constructionTime = performance.now() - startGraphConstruction;
    return { graph, constructionTime };
  }

  async onRunAllocation(allocationOptions: AllocationOptions) {
    const graph = this.network();

    if (!graph || graph.value.order === 0) {
      this.showNoGraphWarning.set(true);
      return;
    }

    const showLoading = this.shouldShowAlgorithmLoading(graph.value.size);

    if (showLoading) {
      this.loadingAlgorithm.set(true);

      await this.waitForNextPaint();
    }

    const { assignament, algorithmTime } = this.runAlgorithm(
      graph.value,
      allocationOptions.algorithm,
    );

    this.setPerformanceMetrics(
      this.graphConstructionTime,
      algorithmTime,
      this.renderingTime,
    );

    this.setGraphInformations(graph.value.order, graph.value.size);
    this.assingColors(assignament);

    this.loadingAlgorithm.set(false);
  }

  private runAlgorithm(
    graph: Graph,
    colorignAlgorithm: ColoringAlgorithm,
  ): { assignament: DsaturResult; algorithmTime: Miliseconds } {
    const startRunningAlgorithm = performance.now();

    const algorithm =
      colorignAlgorithm === this.DSATUR_NAIVE_OPTION
        ? new ScanDsatur(graph)
        : new HeapDsatur(graph);

    const assignament = algorithm.run();
    const algorithmTime = performance.now() - startRunningAlgorithm;

    return { assignament, algorithmTime };
  }

  private assingColors(assignament: DsaturResult) {
    this.network()!.assignColors(assignament.coloring);
  }

  private setPerformanceMetrics(
    constructionTime: Miliseconds,
    algorithmTime: Miliseconds,
    renderingTime: Miliseconds,
  ) {
    this.performanceMetrics.set({
      graphConstruction: constructionTime,
      algorithm: algorithmTime,
      rendering: renderingTime,
    });
  }

  private setGraphInformations(order: number, size: number) {
    this.graphInformations.set({
      transmitters: order,
      edges: size,
      averageDegree: order > 0 ? (2 * size) / order : 0,
    });
  }

  onGraphRendered(renderingTime: number): void {
    this.renderingTime = renderingTime;
    this.loadingNetwork.set(false);
  }
}
