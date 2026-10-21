import { Component, signal } from "@angular/core";
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
import { dsatur } from "../../engines/algorithms/dsatur/dsatur";
import {
  GraphGeneralAttributes,
  NetworkGraph,
} from "../../models/graphs/network/network-graph";

@Component({
  imports: [
    PlannerControlsComponent,
    GraphViewComponent,
    LoadingComponent,
    WarningDialogComponent,
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
  readonly showNoGraphWarning = signal(false);

  async onGenerateNetwork(options: ConfigurationOptions): Promise<void> {
    this.loading.set(true);

    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );

    const graphGeneralOptions = {
      node: {
        color: "#A7C2D6",
        opacity: 0.9,
        borderColor: "#10151F",
        outerBorderSize: 3,
      },
      edge: {
        color: "#817A96",
        opacity: 0.4,
      },
    } as GraphGeneralAttributes;

    const graph = NetworkGraph.random(
      options.transmitters,
      options.interferenceRadius,
      graphGeneralOptions,
    );

    this.networkGraph.set(graph);
    this.loading.set(false);
  }

  onRunAllocation(allocationOptions: AllocationOptions) {
    const graph = this.networkGraph();

    if (!graph || graph.value.order === 0) {
      this.showNoGraphWarning.set(true);
      return;
    }

    const start = performance.now();
    const assignament = dsatur(graph);

    const end = performance.now();
    console.log(`Allocation runtime: ${end - start} ms`);

    this.networkGraph()!.assignColors(
      new Map(
        assignament.nodes.map((user) => [
          user.id.toString(),
          user.color.toString(),
        ]),
      ) as ReadonlyMap<string, string>,
      assignament.colorCount,
    );
    console.log(this.networkGraph()!);
  }

  onGraphRendered(): void {
    this.loading.set(false);
  }
}
