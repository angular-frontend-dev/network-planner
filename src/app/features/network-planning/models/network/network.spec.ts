import { describe, it, expect, vi, afterEach } from "vitest";
import { Network } from "./network.model";
import { SpatialNode } from "./spatial/spatial-node.model";
import {
  Color,
  NodeId,
} from "../../engines/algorithms/dsatur/dsatur-base.types";

describe("Network Model", () => {
  describe("Random network", () => {
    it.each([0, 1, 10, 100, 500])(
      "should generate %i transmitters",
      (transmitters) => {
        const graph = Network.random(transmitters, 100).value;

        expect(graph.order).toBe(transmitters);
      },
    );

    it("should generate nodes within network boundaries", () => {
      const width = 1000;
      const height = 500;

      const graph = Network.random(100, 100, {}, width, height).value;

      graph.forEachNode((_, attributes) => {
        expect(attributes.x).toBeGreaterThanOrEqual(0);
        expect(attributes.x).toBeLessThan(width);

        expect(attributes.y).toBeGreaterThanOrEqual(0);
        expect(attributes.y).toBeLessThan(height);
      });
    });

    it("should create edges exactly within the interference radius", () => {
      const radius = 100;
      const graph = Network.random(100, radius, {}, 1000, 500).value;

      const nodes = graph.nodes().map(
        (id) =>
          new SpatialNode(id, {
            x: graph.getNodeAttribute(id, "x"),
            y: graph.getNodeAttribute(id, "y"),
          }),
      );

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const u = nodes[i];
          const v = nodes[j];

          const shouldHaveEdge = u.distanceTo(v) <= radius;

          expect(graph.hasEdge(u.id, v.id)).toBe(shouldHaveEdge);
        }
      }
    });

    it("should connect nodes exactly at the interference radius", () => {
      const random = vi.spyOn(Math, "random");

      random
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0.3)
        .mockReturnValueOnce(0.4)
        .mockReturnValueOnce(0.9)
        .mockReturnValueOnce(0.9);

      try {
        const graph = Network.random(3, 5, {}, 10, 10).value;

        // (0,0), (3,4), (9,9)
        expect(graph.hasEdge("0", "1")).toBe(true);
        expect(graph.hasEdge("0", "2")).toBe(false);
        expect(graph.hasEdge("1", "2")).toBe(false);

        expect(graph.size).toBe(1);
      } finally {
        random.mockRestore();
      }
    });

    describe("Network", () => {
      afterEach(() => {
        vi.restoreAllMocks();
      });

      describe("randomGrid", () => {
        it.each([1, 2, 3, 5, 10])(
          "should generate a %ix%i grid",
          (gridSize) => {
            const graph = Network.randomGrid({}, gridSize).value;

            expect(graph.order).toBe(gridSize ** 2);
            expect(graph.type).toBe("undirected");
            expect(graph.selfLoopCount).toBe(0);
          },
        );

        it("should generate nodes inside their respective grid cells", () => {
          const gridSize = 4;
          const bounds = {
            minX: 0,
            maxX: 1,
            minY: 0,
            maxY: 1,
          };

          const graph = Network.randomGrid({}, gridSize, bounds).value;

          for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
              const node = graph.getNodeAttributes(`${i}-${j}`);

              expect(node.x).toBeGreaterThanOrEqual((i / gridSize) * 100);
              expect(node.x).toBeLessThanOrEqual(((i + 1) / gridSize) * 100);

              expect(node.y).toBeGreaterThanOrEqual((j / gridSize) * 100);
              expect(node.y).toBeLessThanOrEqual(((j + 1) / gridSize) * 100);
            }
          }
        });

        it("should respect custom node attributes", () => {
          const graph = Network.randomGrid(
            {
              node: {
                size: 20,
                color: "#ff0000",
                opacity: 0.5,
                borderColor: "#ffffff",
              },
            },
            3,
          ).value;

          graph.forEachNode((_, attributes) => {
            expect(attributes).toMatchObject({
              size: 20,
              color: "#ff0000",
              opacity: 0.5,
              borderColor: "#ffffff",
            });
          });
        });

        it("should respect custom edge attributes", () => {
          // Forces the random edge condition to succeed.
          vi.spyOn(Math, "random").mockReturnValue(0.9);

          const graph = Network.randomGrid(
            {
              edge: {
                size: 3,
                color: "#ff0000",
                opacity: 0.7,
              },
            },
            2,
          ).value;

          // Four vertices form a complete graph K4.
          expect(graph.size).toBe(6);

          graph.forEachEdge((_, attributes, source, target) => {
            expect(source).not.toBe(target);

            expect(attributes).toMatchObject({
              size: 3,
              color: "#ff0000",
              opacity: 0.7,
            });
          });
        });
      });

      describe("assignColors", () => {
        it("should assign colors without modifying the graph topology", () => {
          const network = Network.random(4, 100);
          const graph = network.value;

          const originalEdges = graph.edges();
          const originalColor = graph.getNodeAttribute("3", "color");

          const coloring = new Map<NodeId, Color>([
            [0, 1],
            [1, 1],
            [2, 2],
          ]);

          network.assignColors(coloring);

          const color0 = graph.getNodeAttribute("0", "color");
          const color1 = graph.getNodeAttribute("1", "color");
          const color2 = graph.getNodeAttribute("2", "color");

          // Same frequency => same visual color.
          expect(color0).toBe(color1);

          // Different frequencies => different visual colors.
          expect(color0).not.toBe(color2);

          // Colors must be valid hexadecimal values.
          expect(color0).toMatch(/^#[0-9a-f]{6}$/i);
          expect(color2).toMatch(/^#[0-9a-f]{6}$/i);

          // Unspecified vertices remain unchanged.
          expect(graph.getNodeAttribute("3", "color")).toBe(originalColor);

          // The graph structure remains unchanged.
          expect(graph.order).toBe(4);
          expect(graph.edges()).toEqual(originalEdges);
        });
      });
    });
  });
});
