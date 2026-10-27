import { SpatialNode } from "./spatial-node.model";

export class SpatialGrid {
  private readonly cells = new Map<string, SpatialNode[]>();

  constructor(private readonly cellSize: number) {}

  add(node: SpatialNode): void {
    const key = this.getCellKey(node);

    const cell = this.cells.get(key);

    if (cell) {
      cell.push(node);
    } else {
      this.cells.set(key, [node]);
    }
  }

  getCellNeighbors(node: SpatialNode): SpatialNode[] {
    const { x, y } = this.getCellCoordinates(node);
    const cellNeighbors: SpatialNode[] = [];

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const key = this.createKey(x + dx, y + dy);
        const cell = this.cells.get(key);

        if (cell) {
          cellNeighbors.push(...cell);
        }
      }
    }

    return cellNeighbors;
  }

  private getCellCoordinates(node: SpatialNode) {
    return {
      x: Math.floor(node.x / this.cellSize),
      y: Math.floor(node.y / this.cellSize),
    };
  }

  private getCellKey(node: SpatialNode): string {
    const { x, y } = this.getCellCoordinates(node);
    return this.createKey(x, y);
  }

  private createKey(x: number, y: number): string {
    return `${x},${y}`;
  }
}
