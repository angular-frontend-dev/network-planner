import { Color, NodeId } from "../dsatur-base.types";

export interface DsaturNode {
  id: NodeId;
  color: Color;
  saturation: Set<Color>;
  neighbors: NodeId[];
  degree: number;
}
