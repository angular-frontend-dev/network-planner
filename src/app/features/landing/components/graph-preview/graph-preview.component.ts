import { ChangeDetectionStrategy, Component } from "@angular/core";

interface PreviewNode {
  id: number;
  x: number; // percentage
  y: number; // percentage
  animationDelay: number;
}

interface PreviewEdge {
  id: number;
  source: PreviewNode; // percentage
  target: PreviewNode; // percentage
}

interface RenderedPreviewEdge {
  id: number;
  x: number;
  y: number;
  length: number;
  angle: number;
  animationDelay: number;
}

@Component({
  standalone: true,
  imports: [],
  selector: "app-graph-preview",
  styleUrls: ["./graph-preview.component.scss"],
  templateUrl: "./graph-preview.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraphPreviewComponent {
  readonly nodes: PreviewNode[] = this.createRandomNodes();
  readonly edges: PreviewEdge[] = this.createRandomEdges(this.nodes);
  readonly renderedEdges: RenderedPreviewEdge[] = this.edges.map((edge) =>
    this.createRenderedEdges(edge.id, edge.source, edge.target),
  );

  private getRandomInterval(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  private createRandomNodes(): PreviewNode[] {
    const maxGrids = 3;

    const nodes: PreviewNode[] = [];
    for (let i = 0.2; i < maxGrids; i++) {
      for (let j = 0.2; j < maxGrids; j++) {
        nodes.push({
          id: nodes.length + 1,
          x: this.getRandomInterval(i / maxGrids, (i + 1) / maxGrids) * 80,
          y: this.getRandomInterval(j / maxGrids, (j + 1) / maxGrids) * 80,
          animationDelay: this.getRandomInterval(-5, 0),
        });
      }
    }
    return nodes;
  }

  private createRandomEdges(nodes: PreviewNode[]): PreviewEdge[] {
    const edges: PreviewEdge[] = [];

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.random() >= 0.6) {
          edges.push({
            id: edges.length + 1,
            source: nodes[i],
            target: nodes[j],
          });
        }
      }
    }

    return edges;
  }

  private createRenderedEdges(
    id: number,
    source: PreviewNode,
    target: PreviewNode,
  ): RenderedPreviewEdge {
    const dx = target.x - source.x;
    const dy = target.y - source.y;

    return {
      id: id,
      x: source.x,
      y: source.y,
      length: Math.hypot(dx, dy),
      angle: (Math.atan2(dy, dx) * 180) / Math.PI,
      animationDelay: this.getRandomInterval(-5, 0),
    };
  }
}
