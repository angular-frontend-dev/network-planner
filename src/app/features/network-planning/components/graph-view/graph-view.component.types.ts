import type Graph from "graphology";
import type Sigma from "sigma";

export interface NodeAttributes {
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  borderColor: string;
  outerBorderSize: number;
  innerBorderSize: number;
}

export interface EdgeAttributes {
  size?: number;
  color?: string;
  opacity?: number;
  delay?: number;
}

export type SignalGraph = Graph<NodeAttributes, EdgeAttributes>;

export type SignalGraphRenderer = Sigma<NodeAttributes, EdgeAttributes>;
