import Graph from "graphology";
import { DsaturResult } from "./models/dsatur-result";
import { DsaturNode } from "./models/dsatur-node";

export abstract class DsaturBase {
  protected nodes: DsaturNode[] = [];
  protected minColor = 1;

  constructor(graph: Graph) {
    // O(n + m)
    for (const node of graph.nodes()) {
      const nodeId = Number(node);

      this.nodes[nodeId] = {
        id: nodeId,
        color: this.minColor - 1,
        neighbors: [],
        saturation: new Set(),
        degree: graph.degree(node),
      };
    }

    // O(m)
    graph.forEachEdge((_edge, _attributes, sourceId, targetId) => {
      const source = this.nodes[Number(sourceId)];
      const target = this.nodes[Number(targetId)];

      source.neighbors.push(target);
      target.neighbors.push(source);
    });
  }

  run(): DsaturResult {
    let colorCount = 0;

    // hasUncolored: O(1)
    // TOTAL: O(n)
    while (this.hasUncolored) {
      // SCAN-DSATUR: O(n)
      // HEAP-DSATUR: O(log n)
      const node = this.selectNextNode();

      // O(degree(node))
      // TOTAL: O(m)
      node.color = this.getSmallestAvailableColor(node.saturation);

      // SCAN-DSATUR: O(n)
      // HEAP-DSATUR: O(log n)
      this.removeNode(node);

      colorCount = Math.max(colorCount, node.color);

      // O(degree(node))
      // TOTAL: O(m)
      for (const neighbor of node.neighbors) {
        if (this.isNodeUncolored(neighbor)) {
          this.updateNodeSaturation(neighbor, node.color);
        }
      }
    }

    return {
      nodes: this.nodes,
      colorCount,
    };
  }

  protected abstract get hasUncolored(): boolean;

  protected abstract selectNextNode(): DsaturNode;

  protected abstract updateNodeSaturation(
    node: DsaturNode,
    color: number,
  ): void;

  protected abstract removeNode(node: DsaturNode): void;

  private isNodeUncolored(node: DsaturNode): boolean {
    return node.color === this.minColor - 1;
  }
  private getSmallestAvailableColor(forbiddenColors: Set<number>): number {
    let color = this.minColor;

    while (forbiddenColors.has(color)) {
      color++;
    }

    return color;
  }
}
