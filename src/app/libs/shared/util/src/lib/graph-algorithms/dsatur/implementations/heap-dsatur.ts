import { IndexedMaxHeap } from "../utils/indexed-max-heap";
import { DsaturBase } from "../dsatur-base";
import Graph from "graphology";
import { DsaturNode } from "../models/dsatur-node";

export class HeapDsatur extends DsaturBase {
  private readonly uncolored!: IndexedMaxHeap<DsaturNode>;

  constructor(graph: Graph) {
    super(graph);

    this.uncolored = new IndexedMaxHeap<DsaturNode>(
      (node) => node.id,
      (a, b) => {
        if (a.saturation.size !== b.saturation.size) {
          return a.saturation.size - b.saturation.size;
        }

        if (a.degree !== b.degree) {
          return a.degree - b.degree;
        }

        return a.id - b.id;
      },
    );

    for (const node of this.nodes) {
      this.uncolored.push(node);
    }
  }

  protected get hasUncolored(): boolean {
    return this.uncolored.size > 0;
  }

  protected updateNodeSaturation(node: DsaturNode, color: number): void {
    const previousSize = node.saturation.size;

    node.saturation.add(color);

    if (node.saturation.size !== previousSize) {
      this.uncolored.update(node.id);
    }
  }

  protected removeNode(node: DsaturNode): void {
    if (!this.uncolored.delete(node.id)) {
      throw new Error(`Node ${node.id} is not in the uncolored heap.`);
    }
  }

  protected override selectNextNode(): DsaturNode {
    const node = this.uncolored.peek();

    if (!node) {
      throw new Error("Cannot select a node from an empty heap.");
    }

    return node;
  }
}
