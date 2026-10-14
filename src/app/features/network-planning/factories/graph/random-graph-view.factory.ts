import Graph from "graphology";
import {
  EdgeAttributes,
  NodeAttributes,
  SignalGraph,
} from "../../components/graph-view/graph-view.component.types";

export interface RandomGraphBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface RandomGraphNodeOptions {
  gridSize: number;
  size?: number;
  color?: string;
  borderColor?: string;
  outerBorderSize?: number;
  innerBorderSize?: number;
}

export interface RandomGraphEdgeAttributes {
  size?: number;
  color?: string;
  opacity?: number;
  delay?: number;
}

export interface RandomGraphOptions {
  bounds?: RandomGraphBounds;
  nodeOptions?: RandomGraphNodeOptions;
  edgeOptions?: RandomGraphEdgeAttributes;
}

const DEFAULT_BOUNDS: RandomGraphBounds = {
  minX: 0.1,
  maxX: 0.9,
  minY: 0.1,
  maxY: 0.9,
};

const DEFAULT_NODE_OPTIONS: Required<RandomGraphNodeOptions> = {
  gridSize: 3,
  size: 16,
  color: "#65E5C2",
  borderColor: "#10151F",
  outerBorderSize: 3,
  innerBorderSize: 8,
};

const DEFAULT_EDGE_OPTIONS: Required<RandomGraphEdgeAttributes> = {
  size: 5,
  color: "#65e5c273",
  opacity: 0,
  delay: 4,
};

export function createRandomGraph(
  options: RandomGraphOptions = {},
): SignalGraph {
  const bounds = {
    ...DEFAULT_BOUNDS,
    ...options.bounds,
  };

  const nodeOptions = {
    ...DEFAULT_NODE_OPTIONS,
    ...options.nodeOptions,
  };

  const edgeOptions = {
    ...DEFAULT_EDGE_OPTIONS,
    ...options.edgeOptions,
  };

  const graph = new Graph<NodeAttributes, EdgeAttributes>();

  createRandomNodes(graph, bounds, nodeOptions);
  createRandomEdges(graph, edgeOptions);

  return graph;
}

function createRandomNodes(
  graph: Graph<NodeAttributes, EdgeAttributes>,
  bounds: Required<RandomGraphBounds>,
  nodeOptions: Required<RandomGraphNodeOptions>,
) {
  const gridSize = nodeOptions.gridSize;

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const minX = Math.max(bounds.minX, i / gridSize);
      const maxX = Math.min(bounds.maxX, (i + 1) / gridSize);
      const minY = Math.max(bounds.minY, j / gridSize);
      const maxY = Math.min(bounds.maxY, (j + 1) / gridSize);

      graph.addNode(`node-${i}-${j}`, {
        x: getRandomInterval(minX, maxX) * 100,
        y: getRandomInterval(minY, maxY) * 100,
        size: nodeOptions.size,
        color: nodeOptions.color,
        borderColor: nodeOptions.borderColor,
        outerBorderSize: nodeOptions.outerBorderSize,
        innerBorderSize: nodeOptions.innerBorderSize,
        delay: getRandomInterval(0, 3000),
      });
    }
  }
}

function createRandomEdges(
  graph: Graph<NodeAttributes, EdgeAttributes>,
  edgeOptions: Required<RandomGraphEdgeAttributes>,
) {
  const nodes = graph.nodes();

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (Math.random() >= 0.6) {
        graph.addEdge(nodes[i], nodes[j], {
          size: edgeOptions.size,
          color: edgeOptions.color,
          opacity: edgeOptions.opacity,
          delay: getRandomInterval(0, 3000),
        });
      }
    }
  }
}

function getRandomInterval(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
