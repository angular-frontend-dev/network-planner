import { describe, it, expect } from "vitest";
import { HeapDsatur } from "./implementations/heap-dsatur";
import { ScanDsatur } from "./implementations/scan-dsatur";
import { erdosRenyi } from "graphology-generators/random";
import Graph, { UndirectedGraph } from "graphology";
import { Color } from "chart.js";

const graphCases = [
  {
    order: 10,
    probability: 0.1,
  },
  {
    order: 100,
    probability: 0.5,
  },
];

describe("DSATUR", () => {
  describe.each([
    ["Implementation A", ScanDsatur],
    ["Implementation B", HeapDsatur],
  ])("%s", (_, Algorithm) => {
    describe("Basic cases", () => {
      it("should color an empty graph", () => {
        const emptyGraph = new Graph();
        const algorithm = new Algorithm(emptyGraph);

        const { colorCount } = algorithm.run();

        expect(colorCount).toBe(0);
      });

      it.each(graphCases)(
        "should color every vertex",
        ({ order, probability }) => {
          const graph = erdosRenyi(UndirectedGraph, { order, probability });
          const algorithm = new Algorithm(graph);

          const { coloring } = algorithm.run();

          graph.forEachNode((node) => {
            const nodeId = parseInt(node);
            expect(coloring.has(nodeId)).toBe(true);
            expect(coloring.get(nodeId)).toEqual(expect.any(Number));
          });
        },
      );

      it.each(graphCases)(
        "colorCount equals number of distinct colors",
        ({ order, probability }) => {
          const graph = erdosRenyi(UndirectedGraph, { order, probability });
          const algorithm = new Algorithm(graph);

          const { coloring, colorCount } = algorithm.run();

          const colors = new Set(coloring.values());
          expect(colorCount).toBe(colors.size);
        },
      );
    });

    describe.each(graphCases)(
      "Correctness invariants",
      ({ order, probability }) => {
        const graph = erdosRenyi(UndirectedGraph, { order, probability });
        it("should produce a proper coloring", () => {
          const algorithm = new Algorithm(graph);
          const { coloring } = algorithm.run();
          graph.forEachNode((node) => {
            const nodeId = parseInt(node);
            graph.neighbors(node).forEach((neighbor) => {
              const neighborId = parseInt(neighbor);
              expect(coloring.get(nodeId)).not.toBe(coloring.get(neighborId));
            });
          });
        });

        it("should use at most Delta + 1 colors", () => {
          const algorithm = new Algorithm(graph);

          const { colorCount } = algorithm.run();

          const maxDegree = Math.max(
            0,
            ...graph.mapNodes((node) => graph.degree(node)),
          );

          expect(colorCount).toBeLessThanOrEqual(maxDegree + 1);
        });
      },
    );
  });

  describe("Implementation A specific tests", () => {
    it("should handle implementation-specific behavior", () => {});
  });

  describe("Implementation B specific tests", () => {
    it("should handle implementation-specific behavior", () => {});
  });
});
