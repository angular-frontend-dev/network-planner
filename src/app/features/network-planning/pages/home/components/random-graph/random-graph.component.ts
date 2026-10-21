import { Component, input, signal } from "@angular/core";

import Graph from "graphology";

import { GraphViewComponent } from "../../../../components/graph-view/graph-view.component";
import {
  NetworkEdgeAttributes,
  NetworkGraph,
  NetworkNodeAttributes,
} from "../../../../models/graphs/network-graph";

export interface RandomGraphOptions {
  bounds: Partial<RandomGraphBounds>;
  nodeOptions: Partial<RandomGraphNodeOptions>;
  edgeOptions: Partial<RandomGraphEdgeAttributes>;
}

export interface RandomGraphBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface RandomGraphNodeOptions {
  gridSize: number;
  size: number;
  color: string;
  borderColor: string;
  outerBorderSize: number;
  innerBorderSize: number;
}

export interface RandomGraphEdgeAttributes {
  size: number;
  color: string;
  opacity: number;
  delay: number;
}

const DEFAULT_BOUNDS: RandomGraphBounds = {
  minX: 0.1,
  maxX: 0.9,
  minY: 0.1,
  maxY: 0.9,
};

const DEFAULT_NODE_OPTIONS: Required<RandomGraphNodeOptions> = {
  gridSize: 3,
  size: 16,
  color: "#65E5C2",
  borderColor: "#10151F",
  outerBorderSize: 3,
  innerBorderSize: 8,
};

const DEFAULT_EDGE_OPTIONS: Required<RandomGraphEdgeAttributes> = {
  size: 5,
  color: "#65e5c273",
  opacity: 0,
  delay: 4,
};

@Component({
  imports: [GraphViewComponent],
  selector: "app-random-graph",
  styleUrl: "./random-graph.component.scss",
  templateUrl: "./random-graph.component.html",
})
export class RandomGraphComponent {
  options = input<Partial<RandomGraphOptions>>({});

  private animationFrame?: number;
  private randomGraph = signal<NetworkGraph>(
    new Graph<NetworkNodeAttributes, NetworkEdgeAttributes>(),
  );

  ngOnInit() {
    this.randomGraph.set(this.createRandomGraph(this.options()));
  }

  private createRandomGraph(
    options: Partial<RandomGraphOptions>,
  ): NetworkGraph {
    const bounds = {
      ...DEFAULT_BOUNDS,
      ...options.bounds,
    };

    const nodeOptions = {
      ...DEFAULT_NODE_OPTIONS,
      ...options.nodeOptions,
    };

    const edgeOptions = {
      ...DEFAULT_EDGE_OPTIONS,
      ...options.edgeOptions,
    };

    const graph = new Graph<NetworkNodeAttributes, NetworkEdgeAttributes>();

    this.createRandomNodes(graph, bounds, nodeOptions);
    this.createRandomEdges(graph, edgeOptions);

    return graph;
  }

  private createRandomNodes(
    graph: Graph<NetworkNodeAttributes, NetworkEdgeAttributes>,
    bounds: RandomGraphBounds,
    nodeOptions: RandomGraphNodeOptions,
  ) {
    const gridSize = nodeOptions.gridSize;

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const minX = Math.max(bounds.minX, i / gridSize);
        const maxX = Math.min(bounds.maxX, (i + 1) / gridSize);
        const minY = Math.max(bounds.minY, j / gridSize);
        const maxY = Math.min(bounds.maxY, (j + 1) / gridSize);

        graph.addNode(`node-${i}-${j}`, {
          x: this.getRandomInterval(minX, maxX) * 100,
          y: this.getRandomInterval(minY, maxY) * 100,
          size: nodeOptions.size,
          color: nodeOptions.color,
          borderColor: nodeOptions.borderColor,
          outerBorderSize: nodeOptions.outerBorderSize,
          innerBorderSize: nodeOptions.innerBorderSize,
          delay: this.getRandomInterval(0, 3000),
        });
      }
    }
  }

  private createRandomEdges(
    graph: Graph<NetworkNodeAttributes, NetworkEdgeAttributes>,
    edgeOptions: Required<RandomGraphEdgeAttributes>,
  ) {
    const nodes = graph.nodes();

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.random() >= 0.6) {
          graph.addEdge(nodes[i], nodes[j], {
            size: edgeOptions.size,
            color: edgeOptions.color,
            opacity: edgeOptions.opacity,
            delay: this.getRandomInterval(0, 3000),
          });
        }
      }
    }
  }

  private getRandomInterval(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  ngAfterViewInit() {
    this.animateGraph();
  }

  private animateGraph(): void {
    const start = performance.now();
    const duration = 3000;

    const animate = (now: number) => {
      const elapsed = now - start;

      this.randomGraph().updateEachNodeAttributes((_, attributes) => {
        const time = elapsed + attributes.delay!;

        const progress = (((time % duration) + duration) % duration) / duration;

        const opacity =
          0.45 + 0.55 * ((Math.sin(progress * Math.PI * 2) + 1) / 2);

        return {
          ...attributes,
          opacity,
        };
      });

      this.randomGraph().updateEachEdgeAttributes(
        (_, attributes) => {
          const time = elapsed + attributes.delay!;

          const progress =
            (((time % duration) + duration) % duration) / duration;

          const opacity =
            0.15 + 0.35 * ((Math.sin(progress * Math.PI * 2) + 1) / 2);

          return {
            ...attributes,
            opacity,
          };
        },
        {
          attributes: ["opacity"],
        },
      );

      this.animationFrame = requestAnimationFrame(animate);
    };

    this.animationFrame = requestAnimationFrame(animate);
  }
}
