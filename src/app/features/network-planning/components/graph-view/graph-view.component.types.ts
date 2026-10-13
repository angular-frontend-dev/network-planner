import Graph from "graphology";
import Sigma from "sigma";

export interface NodeAttributes {
  x: number;
  y: number;
  size: number;
  color: string;
}

export interface EdgeAttributes {
  size?: number;
  color?: string;
}

export type SignalGraph = Graph<NodeAttributes, EdgeAttributes>;

export type SignalGraphRenderer = Sigma<NodeAttributes, EdgeAttributes>;
