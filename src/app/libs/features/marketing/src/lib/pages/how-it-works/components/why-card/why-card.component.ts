import { Component, input } from "@angular/core";

@Component({
  imports: [],
  selector: "app-why-card",
  styleUrl: "./why-card.component.scss",
  templateUrl: "./why-card.component.html",
})
export class WhyCardComponent {
  title = input.required<string>();
  description = input.required<string>();
  points = input.required<string[]>();
}
