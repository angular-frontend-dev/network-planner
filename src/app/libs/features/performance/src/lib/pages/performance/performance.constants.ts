import type { TutorialStep } from "@signal/data-access";
import type {
  GraphInformations,
  PerformanceMetrics,
} from "./components/benchmark-result/benchmark-result.component";

export const EMPTY_PERFORMANCE_METRIC: PerformanceMetrics = {
  graphConstruction: 0,
  algorithm: 0,
  totalRuntime: 0,
};

export const EMPTY_GRAPH_INFORMATIONS: GraphInformations = {
  transmitters: 0,
  edges: 0,
  averageDegree: 0,
};

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    target: '[data-tour="performance-configuration"]',
    title: "Configure the benchmark",
    description:
      "Choose the network parameters to explore how different " +
      "graph sizes and densities affect performance.",
  },
  {
    target: '[data-tour="performance-algorithm"]',
    title: "Algorithm selection",
    description:
      "Different algorithms process the graph differently. " +
      "Their execution times depend on the number of vertices, " +
      "edges, and the operations they perform.",
  },
  {
    target: '[data-tour="performance-results"]',
    title: "Understand the results",
    description:
      "Two graphs with the same number of vertices can have very " +
      "different numbers of edges. Dense graphs may require " +
      "significantly more computation.",
  },
  {
    target: '[data-tour="runtime-chart"]',
    title: "Understanding execution time",
    description:
      "This chart visualizes the algorithms' execution times. " +
      "Performance depends also on the number of edges and the selected algorithm. " +
      "Compare the results to see how these factors affect runtime.",
  },
  {
    target: '[data-tour="engineering-link"]',
    title: "Explore the engineering",
    description:
      "Visit the Engineering page for more details about the " +
      "implementation, performance decisions, and optimization techniques.",
  },
];
