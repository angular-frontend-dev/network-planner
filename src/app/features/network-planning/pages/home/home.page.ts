import { Component, signal } from "@angular/core";
import { FeatureCardComponent } from "./components/feature-card/feature-card.component";
import { RandomGraphComponent } from "./components/random-graph/random-graph.component";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
  imports: [FeatureCardComponent, RandomGraphComponent],
})
export class HomePage {
  protected readonly title = signal("Home Page");
}
