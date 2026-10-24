import { Miliseconds } from "../../../../../shared/types/time.type";
import { ColoringAlgorithm } from "../../../engines/algorithms/algorithm.types";

export interface AlgorithmPerformance {
  algorithm: ColoringAlgorithm;
  samples: PerformanceSample[];
}

export interface PerformanceSample {
  vertices: number;
  edges: number;
  runtime: Miliseconds;
}

export const PERFORMANCE_DATA: AlgorithmPerformance[] = [
  {
    algorithm: "DSATUR-NAIVE",
    samples: [
      {
        vertices: 100,
        edges: 200,
        runtime: 5.2,
      },
      {
        vertices: 500,
        edges: 1000,
        runtime: 7.8,
      },
      {
        vertices: 1000,
        edges: 2000,
        runtime: 9.2,
      },
      {
        vertices: 5000,
        edges: 10000,
        runtime: 63.5,
      },
      {
        vertices: 10000,
        edges: 20000,
        runtime: 399.1,
      },
      {
        vertices: 50000,
        edges: 100000,
        runtime: 12122.4,
      },
      {
        vertices: 100000,
        edges: 200000,
        runtime: 120762.8,
      },
    ],
  },
  {
    algorithm: "DSATUR-HEAP",
    samples: [
      {
        vertices: 100,
        edges: 200,
        runtime: 2.7,
      },
      {
        vertices: 500,
        edges: 1000,
        runtime: 3.8,
      },
      {
        vertices: 1000,
        edges: 2000,
        runtime: 4.8,
      },
      {
        vertices: 5000,
        edges: 10000,
        runtime: 24.8,
      },
      {
        vertices: 10000,
        edges: 20000,
        runtime: 37.2,
      },
      {
        vertices: 50000,
        edges: 100000,
        runtime: 126.6,
      },
      {
        vertices: 100000,
        edges: 200000,
        runtime: 424.8,
      },
    ],
  },
];
