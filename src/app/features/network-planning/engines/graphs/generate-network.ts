import Graph from "graphology";
import { ConfigurationOptions } from "../../pages/network-planner/components/network-configuration/planner-controls.component";
import { SpatialGrid } from "./spatial-grid";
import { SpatialNode } from "./spatial-node";
import { NetworkGraph } from "../../models/graphs/network-graph";

const NETWORK_WIDTH = 2500;
const NETWORK_HEIGHT = 1000;

export function generateRandomNetwork(
  options: ConfigurationOptions,
): NetworkGraph {
  const graph: NetworkGraph = new Graph({
    type: "undirected",
  });

  createRandomNodes(graph, options.transmitters);
  createEdges(graph, options.interferenceRadius);

  return graph;
}

function createRandomNodes(graph: NetworkGraph, transmitters: number): void {
  const nodeSize = getNodeSize(transmitters);

  for (let i = 0; i < transmitters; i++) {
    graph.addNode(i.toString(), {
      x: Math.random() * NETWORK_WIDTH,
      y: Math.random() * NETWORK_HEIGHT,
      size: nodeSize,
      color: "#3de2c0",
      innerBorderSize: 0,
    });
  }
}

function createEdges(graph: NetworkGraph, interferenceRadius: number): void {
  const spatialGrid = new SpatialGrid(interferenceRadius);

  graph.forEachNode((node, attributes) => {
    const spatialNode = new SpatialNode(node, attributes.x, attributes.y);

    for (const neighborNode of spatialGrid.getCellNeighbors(spatialNode)) {
      if (spatialNode.distanceTo(neighborNode) <= interferenceRadius) {
        graph.addEdge(spatialNode.id, neighborNode.id, {
          size: 1,
          color: "#000",
        });
      }
    }

    spatialGrid.add(spatialNode);
  });
}

function getNodeSize(nodeCount: number): number {
  if (nodeCount <= 100) return 5.5;
  if (nodeCount <= 500) return 4.5;
  if (nodeCount <= 2000) return 3.5;
  if (nodeCount <= 5000) return 2.5;

  return 2;
}
