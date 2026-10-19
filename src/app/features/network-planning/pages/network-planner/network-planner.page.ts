import { Component, signal } from "@angular/core";
import { PlannerControlsComponent } from "./components/network-configuration/planner-controls.component";
import type {
  ConfigurationOptions,
  AllocationOptions,
} from "./components/network-configuration/planner-controls.component";
import { generateRandomNetwork } from "../../engines/graphs/generate-network";
import { NetworkGraph } from "../../models/graphs/network-graph";
import { GraphViewComponent } from "../../components/graph-view/graph-view.component";
import { LoadingComponent } from "../../../../shared/components/loading/loading.component";

@Component({
  imports: [PlannerControlsComponent, GraphViewComponent, LoadingComponent],
  selector: "app-network-planner",
  styleUrl: "./network-planner.page.scss",
  templateUrl: "./network-planner.page.html",
})
export class NetworkPlannerPage {
  readonly networkGraph = signal<NetworkGraph | null>(null);
  readonly loading = signal(false);

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
    console.log("Running allocation with options:", allocationOptions);
  }

  onGraphRendered(): void {
    this.loading.set(false);
  }
}
