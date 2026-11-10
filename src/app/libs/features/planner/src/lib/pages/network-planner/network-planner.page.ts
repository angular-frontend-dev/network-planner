import {
  afterNextRender,
  Component,
  DestroyRef,
  inject,
  signal,
  viewChild,
} from "@angular/core";

import Graph from "graphology";

import {
  GraphGeneralAttributes,
  Network,
  HeapDsatur,
  ScanDsatur,
  ColoringAlgorithm,
  DsaturResult,
  Miliseconds,
} from "@signal/util";

import {
  WarningDialogComponent,
  GraphViewComponent,
  GraphViewOptions,
  LoadingComponent,
  TutorialPromptComponent,
} from "@signal/ui";

import { GuidedTourService } from "@signal/data-access";

import type { GraphInformations } from "./components/performance-summary/performance-summary.component";

import { PlannerControlsComponent } from "./components/network-configuration/planner-controls.component";

import type {
  ConfigurationOptions,
  AllocationOptions,
} from "./components/network-configuration/planner-controls.component";

import {
  PerformanceMetrics,
  PerformanceSummaryComponent,
} from "./components/performance-summary/performance-summary.component";

import {
  EMPTY_PERFORMANCE_METRICS,
  EMPTY_GRAPH_INFORMATIONS,
  TUTORIAL_STEPS,
} from "./network-planner.constants";
import { TutorialService } from "../../services/tutorial/tutorial.service";

@Component({
  imports: [
    PlannerControlsComponent,
    GraphViewComponent,
    LoadingComponent,
    WarningDialogComponent,
    PerformanceSummaryComponent,
    TutorialPromptComponent,
  ],
  providers: [TutorialService],
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
  private readonly tutorialService = inject(TutorialService);

  readonly tutorialPrompt = viewChild.required(TutorialPromptComponent);

  readonly network = signal<Network | null>(null);
  readonly loadingNetwork = signal(false);
  readonly loadingAlgorithm = signal(false);
  readonly showNoGraphWarning = signal(false);

  performanceMetrics = signal<PerformanceMetrics>(EMPTY_PERFORMANCE_METRICS);
  graphInformations = signal<GraphInformations>(EMPTY_GRAPH_INFORMATIONS);

  private graphConstructionTime = 0;
  private renderingTime = 0;

  private readonly DSATUR_NAIVE_OPTION: ColoringAlgorithm = "DSATUR-NAIVE";

  constructor() {
    this.destroyRef.onDestroy(() => this.guidedTour.destroy());
    afterNextRender(() => {
      if (!this.tutorialService.hasSeenTutorial()) this.tutorialPrompt().open();
    });
  }

  startTutorial() {
    this.markTutorialSeen();
    this.guidedTour.start(TUTORIAL_STEPS);
  }

  markTutorialSeen() {
    this.tutorialService.markAsSeen();
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
