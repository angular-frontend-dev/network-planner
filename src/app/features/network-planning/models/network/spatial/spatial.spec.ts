import { describe, it, expect } from "vitest";
import { SpatialNode } from "./spatial-node.model";
import { SpatialNodeId } from "./spatial.types";

describe("SpatialNode", () => {
  const createNode = (x: number, y: number) =>
    new SpatialNode("1" as SpatialNodeId, { x, y });

  describe("Coordinate validation", () => {
    it.each([
      [0, 0],
      [10, 20],
      [0, 15],
      [15, 0],
    ])("should accept valid coordinates (%i, %i)", (x, y) => {
      expect(() => createNode(x, y)).not.toThrow();
    });

    it.each([
      [-1, 0],
      [0, -1],
      [-10, -20],
      [NaN, 10],
      [10, NaN],
      [Infinity, 10],
      [10, -Infinity],
    ])("should reject invalid coordinates (%s, %s)", (x, y) => {
      expect(() => createNode(x, y)).toThrow(RangeError);
    });
  });

  describe("Distance calculation", () => {
    it("should calculate Euclidean distance", () => {
      const a = createNode(0, 0);
      const b = createNode(3, 4);

      expect(a.distanceTo(b)).toBe(5);
    });

    it("should return zero for identical coordinates", () => {
      const a = createNode(5, 5);
      const b = createNode(5, 5);

      expect(a.distanceTo(b)).toBe(0);
    });
  });
});
