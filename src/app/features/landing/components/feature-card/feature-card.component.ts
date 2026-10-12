import { Component, input } from "@angular/core";

@Component({
  selector: "app-feature-card",
  styleUrls: ["./feature-card.component.scss"],
  templateUrl: "./feature-card.component.html",
})
export class FeatureCardComponent {
  icon = input.required<string>();
  title = input.required<string>();
  description = input.required<string>();
}
