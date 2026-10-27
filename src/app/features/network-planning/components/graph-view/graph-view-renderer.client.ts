import Sigma from "sigma";
import { layerBorder } from "@sigma/node-border";

import type {
  Network,
  NetworkNodeAttributes,
  NetworkEdgeAttributes,
} from "../../models/network/network.model";

import type { GraphViewOptions } from "./graph-view.component";

export type NetworkRenderer = Sigma<
  NetworkNodeAttributes,
  NetworkEdgeAttributes
>;

interface RendererConfig {
  graph: Network;
  container: HTMLDivElement;
  options: GraphViewOptions;
  backgroundImage: string;
}

interface RendererResult {
  renderer: NetworkRenderer;
  initializationTime: number;
  destroy: () => void;
}

export function createGraphRenderer({
  graph,
  container,
  options,
  backgroundImage,
}: RendererConfig): RendererResult {
  const start = performance.now();

  fitGraphToContainer(graph, container);

  let renderer!: NetworkRenderer;

  renderer = new Sigma(graph.value, container, {
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
      enableNodeDrag: options.enableNodeDrag,
      enableCameraZooming: options.enableCameraZooming,
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

      dragPositionToAttributes: (position) =>
        dragPositionToAttributes(renderer, position),
    },
  });

  if (options.enableCameraPanning) {
    configureCamera(renderer);
  }

  const initializationTime = performance.now() - start;

  let cleanupBackground: (() => void) | undefined;

  try {
    cleanupBackground = createBackgroundLayer(
      renderer,
      container,
      backgroundImage,
    );
  } catch (error) {
    renderer.kill();
    throw error;
  }

  return {
    renderer,
    initializationTime,

    destroy: () => {
      cleanupBackground?.();
      renderer.kill();
    },
  };
}

function dragPositionToAttributes(
  renderer: NetworkRenderer,
  position: { x: number; y: number },
): Record<string, unknown> {
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

function configureCamera(renderer: NetworkRenderer): void {
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

function fitGraphToContainer(graph: Network, container: HTMLElement): void {
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

function createBackgroundLayer(
  renderer: NetworkRenderer,
  container: HTMLElement,
  backgroundImage: string,
): () => void {
  const image = document.createElement("img");

  image.src = backgroundImage;
  image.style.position = "absolute";
  image.style.pointerEvents = "none";
  image.style.opacity = "0.3";
  image.style.zIndex = "0";

  container.prepend(image);

  const update = () => {
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
