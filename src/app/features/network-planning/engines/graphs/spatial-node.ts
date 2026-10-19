export class SpatialNode {
  constructor(
    public readonly id: string,
    public readonly x: number,
    public readonly y: number,
  ) {}

  distanceTo(other: SpatialNode): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;

    return Math.sqrt(dx * dx + dy * dy);
  }
}
