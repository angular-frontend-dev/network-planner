import { afterNextRender, Component, input, signal } from "@angular/core";

import {
  GraphViewComponent,
  GraphViewOptions,
} from "../../../../components/graph-view/graph-view.component";
import {
  GraphGeneralAttributes,
  Network,
} from "../../../../models/network/network.model";

@Component({
  imports: [GraphViewComponent],
  selector: "app-random-graph",
  styleUrl: "./random-graph.component.scss",
  templateUrl: "./random-graph.component.html",
})
export class RandomGraphComponent {
  options = input<Partial<GraphGeneralAttributes>>({});

  private animationFrame?: number;
  private randomGraph = signal<Network | null>(null);

  constructor() {
    afterNextRender(() => this.animateGraph());
  }

  graphViewOptions: Partial<GraphViewOptions> = {
    enableCameraPanning: false,
    enableCameraZooming: false,
    enableNodeDrag: true,
    enableToolBar: false,
  };

  ngOnInit() {
    this.randomGraph.set(Network.randomGrid(this.options()));
  }

  private animateGraph(): void {
    const start = performance.now();
    const duration = 3000;

    const animate = (now: number) => {
      const elapsed = now - start;

      this.randomGraph()!.value.updateEachNodeAttributes((_, attributes) => {
        const time = elapsed + attributes.delay!;

        const progress = (((time % duration) + duration) % duration) / duration;

        const opacity =
          0.45 + 0.55 * ((Math.sin(progress * Math.PI * 2) + 1) / 2);

        return {
          ...attributes,
          opacity,
        };
      });

      this.randomGraph()!.value.updateEachEdgeAttributes(
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
