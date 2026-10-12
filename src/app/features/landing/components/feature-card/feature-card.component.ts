import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  standalone: true,
  selector: "app-feature-card",
  styleUrls: ["./feature-card.component.scss"],
  templateUrl: "./feature-card.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureCardComponent {
  icon = input.required<string>();
  title = input.required<string>();
  description = input.required<string>();
}
