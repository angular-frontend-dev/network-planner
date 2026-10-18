import { Component, signal } from "@angular/core";
import { PlannerControlsComponent } from "./components/network-configuration/planner-controls.component";
import type {
  ConfigurationOptions,
  AllocationOptions,
} from "./components/network-configuration/planner-controls.component";

@Component({
  imports: [PlannerControlsComponent],
  selector: "app-network-planner",
  styleUrl: "./network-planner.page.scss",
  templateUrl: "./network-planner.page.html",
})
export class NetworkPlannerPage {
  onGenerateNetwork(configurationOptions: ConfigurationOptions) {
    console.log("Generating network with configuration:", configurationOptions);
  }

  onRunAllocation(allocationOptions: AllocationOptions) {
    console.log("Running allocation with options:", allocationOptions);
  }
}
