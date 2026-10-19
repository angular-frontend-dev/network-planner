import type Graph from "graphology";
import type Sigma from "sigma";

export interface NetworkNodeAttributes {
  x: number;
  y: number;
  size: number;
  color: string;
  delay?: number;
  borderColor?: string;
  outerBorderSize?: number;
  innerBorderSize?: number;
}

export interface NetworkEdgeAttributes {
  size?: number;
  color?: string;
  opacity?: number;
  delay?: number;
}

export type NetworkGraph = Graph<NetworkNodeAttributes, NetworkEdgeAttributes>;

export type NetworkGraphRenderer = Sigma<
  NetworkNodeAttributes,
  NetworkEdgeAttributes
>;
