import { NetworkGraph } from "../../../../models/graphs/network/network-graph";
import { DsaturBase } from "../dsatur-base";
import type { DsaturNode } from "../dsatur-types";

export class ScanDsatur extends DsaturBase {
  private readonly uncolored: DsaturNode[] = [];

  constructor(graph: NetworkGraph) {
    super(graph);
    for (const node of this.nodes) {
      this.uncolored.push(node);
    }
  }

  protected get hasUncolored(): boolean {
    return this.uncolored.length > 0;
  }

  protected removeNode(node: DsaturNode): void {
    const index = this.uncolored.findIndex((n) => n.id === node.id);

    if (index === -1) {
      throw new Error(`Node ${node.id} is not in the uncolored list.`);
    }

    this.uncolored.splice(index, 1);
  }

  protected selectNextNode(): DsaturNode {
    let selectedNode: DsaturNode | null = null;

    let highestSaturation = -1;
    let highestDegree = -1;

    for (const node of this.uncolored) {
      if (
        node.saturation.size > highestSaturation ||
        (node.saturation.size === highestSaturation &&
          node.degree > highestDegree)
      ) {
        selectedNode = node;
        highestSaturation = node.saturation.size;
        highestDegree = node.degree;
      }
    }

    return selectedNode!;
  }

  protected updateNodeSaturation(node: DsaturNode, color: number): void {
    node.saturation.add(color);
  }
}
