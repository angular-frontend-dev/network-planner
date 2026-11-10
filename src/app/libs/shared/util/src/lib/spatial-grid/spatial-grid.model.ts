import { SpatialNode } from "./spatial-node.model";
import { Coordinate } from "./spatial.types";

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
    const { x, y } = this.getCellCoordinates(node.coordinate);
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

  private getCellKey(node: SpatialNode): string {
    const { x, y } = this.getCellCoordinates(node.coordinate);
    return this.createKey(x, y);
  }

  private getCellCoordinates(coordinate: Coordinate) {
    return {
      x: Math.floor(coordinate.x / this.cellSize),
      y: Math.floor(coordinate.y / this.cellSize),
    };
  }

  private createKey(x: number, y: number): string {
    return `${x},${y}`;
  }
}
