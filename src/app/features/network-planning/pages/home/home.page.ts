import { Component, signal } from "@angular/core";
import { FeatureCardComponent } from "./components/feature-card/feature-card.component";
import { GraphPreviewComponent } from "./components/graph-preview/graph-preview.component";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
  imports: [FeatureCardComponent, GraphPreviewComponent],
})
export class HomePage {
  protected readonly title = signal("Home Page");
}
