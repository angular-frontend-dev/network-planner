import { Component, signal } from "@angular/core";
import { WarningDialogComponent } from "../../../../shared/components/warning-dialog/warning-dialog.component";
import { PlannerControlsComponent } from "./components/network-configuration/planner-controls.component";
import type {
  ConfigurationOptions,
  AllocationOptions,
} from "./components/network-configuration/planner-controls.component";
import { generateRandomNetwork } from "../../engines/graphs/generate-network";
import { NetworkGraph } from "../../models/graphs/network-graph";
import {
  GraphViewComponent,
  GraphViewOptions,
} from "../../components/graph-view/graph-view.component";
import { LoadingComponent } from "../../../../shared/components/loading/loading.component";
import { dsatur } from "../../engines/algorithms/dsatur/dsatur";

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

    const graph = generateRandomNetwork(options);

    this.networkGraph.set(graph);
    this.loading.set(false);
  }

  onRunAllocation(allocationOptions: AllocationOptions) {
    const graph = this.networkGraph();

    if (!graph || graph.order === 0) {
      this.showNoGraphWarning.set(true);
      return;
    }

    const start = performance.now();
    dsatur(graph);

    const end = performance.now();
    console.log(`Allocation runtime: ${end - start} ms`);
  }

  onGraphRendered(): void {
    this.loading.set(false);
  }
}
