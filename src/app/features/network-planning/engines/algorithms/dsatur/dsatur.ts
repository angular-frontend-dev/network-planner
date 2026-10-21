import type { NetworkGraph } from "../../../models/graphs/network-graph";
import type { DsaturResult } from "./dsatur-types";
import { HeapDsatur } from "./heap-dsatur";
import { ScanDsatur } from "./scan-dsatur";

function shouldUseHeap(n: number, m: number): boolean {
  // Example heuristic: use heap if the graph is not dense
  return m < (0.5 * (n * n)) / Math.log2(n);
}

export function dsatur(graph: NetworkGraph): DsaturResult {
  const n = graph.order;
  const m = graph.size;

  const algorithm = shouldUseHeap(n, m)
    ? new HeapDsatur(graph)
    : new ScanDsatur(graph);

  return algorithm.run();
}
