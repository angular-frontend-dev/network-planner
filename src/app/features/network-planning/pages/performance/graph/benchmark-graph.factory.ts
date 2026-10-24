import Graph, { UndirectedGraph } from "graphology";
import erdosRenyi from "graphology-generators/random/erdos-renyi";

export function createBenchmarkGraph(
  order: number,
  approximateSize: number,
): Graph {
  return erdosRenyi.sparse(UndirectedGraph, {
    order,
    approximateSize,
  });
}
