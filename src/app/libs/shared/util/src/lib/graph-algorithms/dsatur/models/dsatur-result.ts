import type { Color, NodeId } from "../dsatur-base.types";

export interface DsaturResult {
  coloring: Map<NodeId, Color>;
  colorCount: number;
}
