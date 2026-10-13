import { Component, input } from "@angular/core";
import { SignalGraph } from "../../../../components/graph-view/graph-view.component.types";
import { GraphViewComponent } from "../../../../components/graph-view/graph-view.component";

@Component({
  imports: [GraphViewComponent],
  selector: "app-algorithm-card",
  styleUrl: "./algorithm-card.component.scss",
  templateUrl: "./algorithm-card.component.html",
})
export class AlgorithmCardComponent {
  stepNumber = input.required<number>();
  title = input.required<string>();
  description = input.required<string>();
  graph = input.required<SignalGraph>();
}
