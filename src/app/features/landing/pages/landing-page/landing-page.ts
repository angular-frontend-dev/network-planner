import { Component, signal } from "@angular/core";
import { FeatureCardComponent } from "../../components/feature-card/feature-card.component";
import { HeaderComponent } from "../../../../shared/components/header.component/header.component";
import { GraphPreviewComponent } from "../../components/graph-preview/graph-preview.component";
import { FooterComponent } from "../../../../shared/components/footer/footer.component";

@Component({
  selector: "app-landing-page",
  templateUrl: "landing-page.html",
  styleUrls: ["landing-page.scss"],
  imports: [
    FeatureCardComponent,
    HeaderComponent,
    GraphPreviewComponent,
    FooterComponent,
  ],
})
export class LandingPage {
  protected readonly title = signal("Landing Page");
}
