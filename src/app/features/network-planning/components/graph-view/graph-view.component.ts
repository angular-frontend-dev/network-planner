import {
  Component,
  computed,
  effect,
  ElementRef,
  input,
  OnInit,
  output,
  viewChild,
} from "@angular/core";
import { layerBorder } from "@sigma/node-border";
import {
  NetworkEdgeAttributes,
  Network,
  NetworkNodeAttributes,
} from "../../models/network/network";
import Sigma from "sigma";

export interface GraphViewOptions {
  enableNodeDrag: boolean;
  enableCameraZooming: boolean;
  enableCameraPanning: boolean;
  enableToolBar: boolean;
}

const DEFAULT_GRAPH_VIEW_OPTIONS: GraphViewOptions = {
  enableNodeDrag: true,
  enableCameraZooming: true,
  enableCameraPanning: true,
  enableToolBar: true,
};

type NetworkRenderer = Sigma<NetworkNodeAttributes, NetworkEdgeAttributes>;

@Component({
  selector: "app-graph-view",
  templateUrl: "./graph-view.component.html",
  styleUrl: "./graph-view.component.scss",
})
export class GraphViewComponent implements OnInit {
  graph = input.required<Network>();
  options = input<Partial<GraphViewOptions>>({});
  backgroundImage = input<string>("/images/network-planning/planner-map.png");

  readonly initializationTime = output<number>();

  resolvedOptions!: GraphViewOptions;

  private readonly container =
    viewChild.required<ElementRef<HTMLDivElement>>("container");

  private renderer?: NetworkRenderer;

  constructor() {
    effect((onCleanup) => {
      const container = this.container();
      if (!container) {
        return;
      }

      const startInitializationTime = performance.now();

      const renderer = this.render(this.graph(), container.nativeElement);

      const initializationTime = performance.now() - startInitializationTime;

      this.renderer = renderer;

      this.initializationTime.emit(initializationTime);

      const cleanupMap = this.createBackgroundLayer(
        renderer as Sigma,
        container.nativeElement,
      );

      onCleanup(() => {
        cleanupMap();
        renderer.kill();
      });
    });
  }

  ngOnInit(): void {
    this.resolvedOptions = {
      ...DEFAULT_GRAPH_VIEW_OPTIONS,
      ...this.options(),
    };
  }

  private render(graph: Network, container: HTMLElement) {
    this.fitGraphToContainer(graph, container);

    const renderer = new Sigma(graph.value, container, {
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
        enableNodeDrag: this.resolvedOptions.enableNodeDrag,
        enableCameraZooming: this.resolvedOptions.enableCameraZooming,
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

    if (this.resolvedOptions.enableCameraPanning)
      this.configureCamera(renderer);

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

  private configureCamera(renderer: NetworkRenderer): void {
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

  private fitGraphToContainer(graph: Network, container: HTMLElement): void {
    const width = container.clientWidth;
    const height = container.clientHeight;

    if (!width || !height) return;

    const viewportAspect = width / height;

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    graph.value.forEachNode((_node, attributes) => {
      minX = Math.min(minX, attributes.x);
      maxX = Math.max(maxX, attributes.x);

      minY = Math.min(minY, attributes.y);
      maxY = Math.max(maxY, attributes.y);
    });

    const graphWidth = maxX - minX;
    const graphHeight = maxY - minY;

    if (!graphWidth || !graphHeight) return;

    const graphAspect = graphWidth / graphHeight;

    const yScale = graphAspect / viewportAspect;

    graph.value.forEachNode((node, attributes) => {
      graph.value.setNodeAttribute(
        node,
        "y",
        minY + (attributes.y - minY) * yScale,
      );
    });
  }

  private createBackgroundLayer(
    renderer: Sigma,
    container: HTMLElement,
  ): () => void {
    const image = document.createElement("img");

    image.src = this.backgroundImage();

    image.style.position = "absolute";
    image.style.pointerEvents = "none";
    image.style.opacity = "0.3";
    image.style.zIndex = "0";

    container.prepend(image);

    const update = () => {
      const graph = this.graph().value;

      const bbox = renderer.getBBox();

      const topLeft = renderer.graphToViewport({
        x: bbox.x[0],
        y: bbox.y[1],
      });

      const bottomRight = renderer.graphToViewport({
        x: bbox.x[1],
        y: bbox.y[0],
      });

      image.style.left = `${topLeft.x}px`;
      image.style.top = `${topLeft.y}px`;

      image.style.width = `${bottomRight.x - topLeft.x}px`;

      image.style.height = `${bottomRight.y - topLeft.y}px`;
    };

    renderer.on("afterRender", update);

    update();

    return () => {
      renderer.off("afterRender", update);
      image.remove();
    };
  }

  zoomIn(): void {
    this.renderer?.getCamera().zoomIn({
      factor: 1.5,
      duration: 200,
    });
  }

  zoomOut(): void {
    this.renderer?.getCamera().zoomOut({
      factor: 1.5,
      duration: 200,
    });
  }

  resetCamera(): void {
    this.renderer?.getCamera().reset({
      duration: 300,
    });
  }
}
