import { Coordinate, SpatialNodeId } from "./spatial.types";

export class SpatialNode {
  constructor(
    public readonly id: SpatialNodeId,
    public readonly coordinate: Coordinate,
  ) {
    const { x, y } = coordinate;

    if (!Number.isFinite(x) || !Number.isFinite(y) || x < 0 || y < 0) {
      throw new RangeError("Coordinates must be finite and non-negative.");
    }
  }

  distanceTo(other: SpatialNode): number {
    const dx = this.coordinate.x - other.coordinate.x;
    const dy = this.coordinate.y - other.coordinate.y;

    return Math.sqrt(dx * dx + dy * dy);
  }
}
