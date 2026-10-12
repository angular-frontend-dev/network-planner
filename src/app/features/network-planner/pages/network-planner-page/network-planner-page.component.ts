import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

@Component({
  standalone: true,
  selector: "app-network-planner-page",
  templateUrl: "network-planner-page.html",
  styleUrls: ["network-planner-page.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NetworkPlannerPageComponent {
  protected readonly title = signal("Network Planner");
}
