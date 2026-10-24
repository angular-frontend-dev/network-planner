export interface DsaturNode {
  id: NodeId;
  color: number;
  saturation: Set<number>;
  neighbors: DsaturNode[];
  degree: number;
}

export type NodeId = number;
