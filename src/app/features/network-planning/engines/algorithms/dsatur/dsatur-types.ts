export interface DsaturNode {
  id: NodeId;
  color: number;
  saturation: Set<number>;
  neighbors: DsaturNode[];
  degree: number;
}

export interface DsaturResult {
  nodes: DsaturNode[];
  colorCount: number;
}

export type NodeId = number;
