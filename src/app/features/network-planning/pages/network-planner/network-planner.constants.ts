import {
  GraphInformations,
  PerformanceMetrics,
} from "./components/performance-summary/performance-summary.component";
import type { TutorialStep } from "../../../../shared/services/guided-tour.service";

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    target: '[data-tour="network-configuration"]',
    title: "Configure your network",
    description:
      "Choose the number of transmitters and their interference radius. " +
      "Two transmitters are connected when they are close enough to interfere.",
  },
  {
    target: '[data-tour="network-graph"]',
    title: "Why might the graph look messy?",
    description:
      "Large networks or greater interference radii can produce thousands " +
      "of overlapping edges. This is normal! The graph reflects the " +
      "interference relationships between transmitters.",
  },
  {
    target: '[data-tour="frequency-allocation"]',
    title: "Allocate frequencies",
    description:
      "Run the algorithm to assign frequencies. Colors represent " +
      "different frequencies, and connected transmitters must " +
      "receive different colors.",
  },
  {
    target: '[data-tour="graph-summary"]',
    title: "Understand the results",
    description:
      "The summary shows the network's size and density. " +
      "After running frequency allocation, performance metrics " +
      "and coloring results become available.",
  },
  {
    target: '[data-tour="how-it-works-link"]',
    title: "Want to learn more?",
    description:
      "Visit the How It Works page to understand graph construction, " +
      "frequency allocation, and the algorithms behind the application.",
  },
];

export const EMPTY_PERFORMANCE_METRICS: PerformanceMetrics = {
  graphConstruction: 0,
  algorithm: 0,
  rendering: 0,
};

export const EMPTY_GRAPH_INFORMATIONS: GraphInformations = {
  transmitters: 0,
  edges: 0,
  averageDegree: 0,
};

export const TUTORIAL_STORAGE_KEY = "network-planner-tutorial-seen";
