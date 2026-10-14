import { Component, signal } from "@angular/core";
import { FeatureCardComponent } from "./components/feature-card/feature-card.component";
import { createRandomGraph } from "../../factories/graph/random-graph-view.factory";
import { GraphViewComponent } from "../../components/graph-view/graph-view.component";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
  imports: [FeatureCardComponent, GraphViewComponent],
})
export class HomePage {
  protected readonly title = signal("Home Page");
  readonly randomGraph = signal(createRandomGraph());

  private animationFrame?: number;

  ngAfterViewInit() {
    this.animateGraph();
  }

  private animateGraph(): void {
    const start = performance.now();
    const duration = 3000;

    const animate = (now: number) => {
      const elapsed = now - start;

      this.randomGraph().updateEachNodeAttributes((_, attributes) => {
        const time = elapsed + attributes.delay;

        const progress = (((time % duration) + duration) % duration) / duration;

        const opacity =
          0.45 + 0.55 * ((Math.sin(progress * Math.PI * 2) + 1) / 2);

        return {
          ...attributes,
          opacity,
        };
      });

      this.randomGraph().updateEachEdgeAttributes(
        (_, attributes) => {
          const time = elapsed + attributes.delay!;

          const progress =
            (((time % duration) + duration) % duration) / duration;

          const opacity =
            0.15 + 0.35 * ((Math.sin(progress * Math.PI * 2) + 1) / 2);

          return {
            ...attributes,
            opacity,
          };
        },
        {
          attributes: ["opacity"],
        },
      );

      this.animationFrame = requestAnimationFrame(animate);
    };

    this.animationFrame = requestAnimationFrame(animate);
  }
}
