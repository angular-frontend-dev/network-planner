import Graph from "graphology";
import { SpatialGrid } from "./spatial/spatial-grid.model";
import { SpatialNode } from "./spatial/spatial-node.model";
import { NodeGeneralAttributes } from "./node-attributes.model";
import { EdgeGeneralAttributes } from "./edge-attributes.model";
import { GridBounds } from "./grid-bounds.model";
import {
  Color,
  NodeId,
} from "../../engines/algorithms/dsatur/dsatur-base.types";

export interface GraphGeneralAttributes {
  node: Partial<NodeGeneralAttributes>;
  edge: Partial<EdgeGeneralAttributes>;
}

export interface NetworkNodeAttributes extends NodeGeneralAttributes {
  x: number;
  y: number;
  delay?: number;
}

export interface NetworkEdgeAttributes extends EdgeGeneralAttributes {}

const DEFAULT_NODE_OPTIONS: NodeGeneralAttributes = {
  size: 16,
  color: "#65E5C2",
  borderColor: "#10151F",
  outerBorderSize: 3,
  innerBorderSize: 8,
  opacity: 0.9,
};

const DEFAULT_EDGE_OPTIONS: EdgeGeneralAttributes = {
  size: 5,
  color: "#65e5c273",
  opacity: 0,
  delay: 0,
};

const DEFAULT_BOUNDS: GridBounds = {
  minX: 0.1,
  maxX: 0.9,
  minY: 0.1,
  maxY: 0.9,
};

export class Network {
  private readonly frequencyPalette = [
    "#B88A72", // muted terracotta
    "#B7A36A", // muted ochre
    "#7F9D7A", // sage green
    "#6F9C96", // desaturated teal
    "#7894A8", // steel blue
    "#7E86A8", // muted indigo
    "#9782A6", // dusty violet
    "#AA8298", // muted rose
  ];

  private constructor(
    private readonly graph: Graph<NetworkNodeAttributes, NetworkEdgeAttributes>,
  ) {}

  static random(
    transmitters: number,
    interferenceRadius: number,
    graphGeneralOptions: Partial<GraphGeneralAttributes> = {},
    networkWidth: number = 2500,
    networkHeight: number = 1000,
  ): Network {
    const graph = new Graph<NetworkNodeAttributes, NetworkEdgeAttributes>({
      type: "undirected",
    });

    // O(1)
    const nodeOptions = Network.getNodeOptions(graphGeneralOptions.node);
    const edgeOptions = Network.getEdgeOptions(graphGeneralOptions.edge);

    // O(n)
    this.createRandomNodes(
      graph,
      transmitters,
      networkWidth,
      networkHeight,
      nodeOptions,
    );

    // O(n * k) in expectation, where k is the maximum number of neighbors in the spatial grid cell
    this.createEdges(graph, interferenceRadius, edgeOptions);

    return new Network(graph);
  }

  private static createRandomNodes(
    graph: Graph<NetworkNodeAttributes, NetworkEdgeAttributes>,
    transmitters: number,
    networkWidth: number,
    networkHeight: number,
    nodeOptions: NodeGeneralAttributes,
  ): void {
    const nodeSize = this.getNodeSize(transmitters);

    // O(n) iterations
    for (let i = 0; i < transmitters; i++) {
      // expected O(1) per iteration
      graph.addNode(i.toString(), {
        x: Math.random() * networkWidth,
        y: Math.random() * networkHeight,
        size: nodeSize,
        color: nodeOptions.color,
        opacity: nodeOptions.opacity,
        borderColor: nodeOptions.borderColor,
        outerBorderSize: nodeSize * 0.25,
        innerBorderSize: nodeSize * 0.55,
      });
    }
  }

  private static createEdges(
    graph: Graph<NetworkNodeAttributes, NetworkEdgeAttributes>,
    interferenceRadius: number,
    edgeOptions: EdgeGeneralAttributes,
  ): void {
    // O(1)
    const spatialGrid = new SpatialGrid(interferenceRadius);
    const edgeSize = Network.getEdgeSize(graph.order);

    // O(n) iterations
    graph.forEachNode((node, attributes) => {
      const spatialNode = new SpatialNode(node, {
        x: attributes.x,
        y: attributes.y,
      });

      // O(k) iterations, where k is the number of neighbors in the spatial grid cell
      for (const neighborNode of spatialGrid.getCellNeighbors(spatialNode)) {
        if (spatialNode.distanceTo(neighborNode) <= interferenceRadius) {
          // expected O(1) per iteration
          graph.addEdge(spatialNode.id, neighborNode.id, {
            size: edgeSize,
            color: edgeOptions.color,
            opacity: edgeOptions.opacity,
            delay: edgeOptions.delay,
          });
        }
      }

      spatialGrid.add(spatialNode);
    });
  }

  private static getNodeSize(nodeCount: number): number {
    if (nodeCount <= 100) return 8;
    if (nodeCount <= 500) return 7;
    if (nodeCount <= 2000) return 6;

    return 5;
  }

  private static getEdgeSize(nodeCount: number): number {
    if (nodeCount <= 100) return 7;
    if (nodeCount <= 500) return 6;
    if (nodeCount <= 2000) return 2;
    if (nodeCount <= 5000) return 1;
    if (nodeCount <= 10000) return 1;

    return 0.4;
  }

  static randomGrid(
    graphGeneralOptions: Partial<GraphGeneralAttributes>,
    gridSize: number = 3,
    bounds: GridBounds = DEFAULT_BOUNDS,
  ): Network {
    const graph = new Graph<NetworkNodeAttributes, NetworkEdgeAttributes>({
      type: "undirected",
    });

    const nodeOptions = Network.getNodeOptions(graphGeneralOptions.node);
    const edgeOptions = Network.getEdgeOptions(graphGeneralOptions.edge);

    this.createRandomGridNodes(graph, gridSize, bounds, nodeOptions);
    this.createRandomGridEdges(graph, edgeOptions);

    return new Network(graph);
  }

  private static createRandomGridNodes(
    graph: Graph<NetworkNodeAttributes, NetworkEdgeAttributes>,
    gridSize: number,
    bounds: GridBounds,
    nodeOptions: NodeGeneralAttributes,
  ) {
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const minX = Math.max(bounds.minX, i / gridSize);
        const maxX = Math.min(bounds.maxX, (i + 1) / gridSize);
        const minY = Math.max(bounds.minY, j / gridSize);
        const maxY = Math.min(bounds.maxY, (j + 1) / gridSize);

        graph.addNode(`${i}-${j}`, {
          x: Network.getRandomInterval(minX, maxX) * 100,
          y: Network.getRandomInterval(minY, maxY) * 100,
          size: nodeOptions.size,
          color: nodeOptions.color,
          opacity: nodeOptions.opacity,
          borderColor: nodeOptions.borderColor,
          outerBorderSize: nodeOptions.outerBorderSize,
          innerBorderSize: nodeOptions.innerBorderSize,
          delay: Network.getRandomInterval(0, 3000),
        });
      }
    }
  }

  private static createRandomGridEdges(
    graph: Graph<NetworkNodeAttributes, NetworkEdgeAttributes>,
    edgeOptions: EdgeGeneralAttributes,
  ) {
    const nodes = graph.nodes();

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.random() >= 0.6) {
          graph.addEdge(nodes[i], nodes[j], {
            size: edgeOptions.size,
            color: edgeOptions.color,
            opacity: edgeOptions.opacity,
            delay: this.getRandomInterval(0, 3000),
          });
        }
      }
    }
  }

  private static getRandomInterval(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  private static getNodeOptions(
    nodeOptions: Partial<NodeGeneralAttributes> | undefined,
  ): NodeGeneralAttributes {
    return {
      ...DEFAULT_NODE_OPTIONS,
      ...nodeOptions,
    };
  }

  private static getEdgeOptions(
    edgeOptions: Partial<EdgeGeneralAttributes> | undefined,
  ): EdgeGeneralAttributes {
    return {
      ...DEFAULT_EDGE_OPTIONS,
      ...edgeOptions,
    };
  }

  get value(): Graph<NetworkNodeAttributes, NetworkEdgeAttributes> {
    return this.graph;
  }

  assignColors(mapNodeColors: ReadonlyMap<NodeId, Color>): void {
    for (const [node, color] of mapNodeColors) {
      this.graph.setNodeAttribute(node, "color", this.getNodeColor(color));
    }
  }

  private hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;

    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));

    const m = l - c / 2;

    let r = 0;
    let g = 0;
    let b = 0;

    if (h < 60) {
      r = c;
      g = x;
    } else if (h < 120) {
      r = x;
      g = c;
    } else if (h < 180) {
      g = c;
      b = x;
    } else if (h < 240) {
      g = x;
      b = c;
    } else if (h < 300) {
      r = x;
      b = c;
    } else {
      r = c;
      b = x;
    }

    const toHex = (value: number) =>
      Math.round((value + m) * 255)
        .toString(16)
        .padStart(2, "0");

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  private getNodeColor(color: number): string {
    const hueCount = 8;
    const index = color - 1;

    const hueIndex = index % hueCount;
    const level = Math.floor(index / hueCount);

    const hue = (20 + hueIndex * 137.508) % 360;

    const lightnessLevels = [60, 50, 68];

    return this.hslToHex(
      hue,
      38,
      lightnessLevels[level % lightnessLevels.length],
    );
  }
}
