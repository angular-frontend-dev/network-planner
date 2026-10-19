import {
  Component,
  effect,
  ElementRef,
  input,
  output,
  viewChild,
} from "@angular/core";
import { layerBorder } from "@sigma/node-border";
import {
  NetworkGraph,
  NetworkGraphRenderer,
} from "../../models/graphs/network-graph";
import Sigma from "sigma";

@Component({
  selector: "app-graph-view",
  templateUrl: "./graph-view.component.html",
  styleUrl: "./graph-view.component.scss",
})
export class GraphViewComponent {
  graph = input.required<NetworkGraph>();
  enableNodeDrag = input<boolean>(true);
  enableCameraZooming = input<boolean>(true);
  enableCameraPanning = input<boolean>(true);

  readonly rendered = output<void>();

  private readonly container =
    viewChild.required<ElementRef<HTMLDivElement>>("container");

  private renderer?: NetworkGraphRenderer;

  constructor() {
    effect((onCleanup) => {
      const container = this.container();
      if (!container) {
        return;
      }

      const renderer = this.render(this.graph(), container.nativeElement);

      this.renderer = renderer;

      renderer.once("afterRender", () => {
        this.rendered.emit();
      });

      onCleanup(() => {
        renderer.kill();
      });
    });
  }

  private render(graph: NetworkGraph, container: HTMLElement) {
    const renderer = new Sigma(graph, container, {
      primitives: {
        nodes: {
          variables: {
            borderColor: {
              type: "color",
              default: "#10151F",
            },

            outerBorderSize: {
              type: "number",
              default: 3,
            },

            innerBorderSize: {
              type: "number",
              default: 7,
            },
          },

          layers: [
            layerBorder({
              borders: [
                {
                  size: { attribute: "outerBorderSize" },
                  color: { attribute: "color" },
                  mode: "pixels",
                },
                {
                  size: { attribute: "innerBorderSize" },
                  color: { attribute: "borderColor" },
                  mode: "pixels",
                },
                {
                  size: 0,
                  color: { attribute: "color" },
                  fill: true,
                },
              ],
            }),
          ],
        },
      },

      styles: {
        nodes: [
          {
            x: { attribute: "x" },
            y: { attribute: "y" },
            opacity: { attribute: "opacity" },

            size: { attribute: "size" },
            color: { attribute: "color" },

            borderColor: { attribute: "borderColor" },
            outerBorderSize: { attribute: "outerBorderSize" },
            innerBorderSize: { attribute: "innerBorderSize" },
          },
        ],

        edges: [
          {
            color: { attribute: "color" },
            size: { attribute: "size" },
            opacity: { attribute: "opacity" },
          },
        ],
      },

      settings: {
        enableNodeDrag: this.enableNodeDrag(),
        enableCameraZooming: this.enableCameraZooming(),
        enableCameraPanning: false,
        minCameraRatio: 0.15,
        maxCameraRatio: 1,
        zoomingRatio: 1.4,
        autoRescale: "once",
        itemSizesReference: "screen",
        autoRescaleContent: "nodes",
        stagePadding: 4,

        cameraPanBoundaries: {
          tolerance: 0.1,
        },

        renderLabels: false,

        dragPositionToAttributes: (position, node) =>
          this.dragPositionToAttributes(position, node),
      },
    });

    if (this.enableCameraPanning()) this.configureCamera(renderer);

    return renderer;
  }

  private dragPositionToAttributes(
    position: { x: number; y: number },
    node: string,
  ): Record<string, unknown> {
    const renderer = this.renderer!;

    const viewportPosition = renderer.graphToViewport(position);
    const { width, height } = renderer.getDimensions();

    const padding = 20;

    const clampedViewportPosition = {
      x: Math.max(padding, Math.min(width - padding, viewportPosition.x)),
      y: Math.max(padding, Math.min(height - padding, viewportPosition.y)),
    };

    const graphPosition = renderer.viewportToGraph(clampedViewportPosition);

    return {
      x: graphPosition.x,
      y: graphPosition.y,
    };
  }

  private configureCamera(renderer: NetworkGraphRenderer): void {
    const camera = renderer.getCamera();

    let panningEnabled = false;

    camera.on("updated", (state) => {
      const isZoomedIn = state.ratio < 0.999;

      if (isZoomedIn !== panningEnabled) {
        panningEnabled = isZoomedIn;

        renderer.setSetting("enableCameraPanning", panningEnabled);
      }
    });
  }
}
