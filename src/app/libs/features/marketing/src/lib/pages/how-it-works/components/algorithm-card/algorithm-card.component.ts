import { Component, input } from "@angular/core";

@Component({
  selector: "app-algorithm-card",
  styleUrl: "./algorithm-card.component.scss",
  templateUrl: "./algorithm-card.component.html",
})
export class AlgorithmCardComponent {
  stepNumber = input.required<number>();
  title = input.required<string>();
  description = input.required<string>();
  imgUrl = input.required<string>();
}
