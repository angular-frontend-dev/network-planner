import { Component, input } from "@angular/core";
import { SignalGraph } from "../../../../components/graph-view/graph-view.component.types";
import { GraphViewComponent } from "../../../../components/graph-view/graph-view.component";

@Component({
  imports: [GraphViewComponent],
  selector: "app-step-card",
  styleUrl: "./step-card.component.scss",
  templateUrl: "./step-card.component.html",
})
export class StepCardComponent {
  stepNumber = input.required<number>();
  title = input.required<string>();
  imgUrl = input<string>();
  graph = input<SignalGraph>();
  description = input.required<string>();
  content = input.required<string>();
}
