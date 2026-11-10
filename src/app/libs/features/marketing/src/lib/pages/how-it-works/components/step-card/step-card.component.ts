import { Component, input } from "@angular/core";

@Component({
  selector: "app-step-card",
  styleUrl: "./step-card.component.scss",
  templateUrl: "./step-card.component.html",
})
export class StepCardComponent {
  stepNumber = input.required<number>();
  title = input.required<string>();
  imgUrl = input.required<string>();
  description = input.required<string>();
  content = input.required<string>();
}
