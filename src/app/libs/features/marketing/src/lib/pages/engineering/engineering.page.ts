import { Component } from "@angular/core";
import { ArchitectureComponent } from "./components/architecture/architecture.component";
import { TechStackComponent } from "./components/tech-stack/tech-stack.component";
import { KeyDecisionComponent } from "./components/key-decision/key-decision.component";
import {
  LucideLayers,
  LucideCpu,
  LucideShare2,
  LucidePackageCheck,
  LucideGrid3X3,
} from "@lucide/angular";
import type { LucideIcon } from "@lucide/angular";

interface Decision {
  id: number;
  icon: LucideIcon;
  title: string;
  description: string;
}

@Component({
  imports: [ArchitectureComponent, TechStackComponent, KeyDecisionComponent],
  selector: "app-engineering",
  styleUrl: "./engineering.page.scss",
  templateUrl: "./engineering.page.html",
})
export class EngineeringPage {
  readonly keyDecisions: Decision[] = [
    {
      id: 1,
      icon: LucideLayers,
      title: "WebGL Rendering",
      description:
        "Sigma.js uses WebGL to visualize large graphs efficiently, " +
        "avoiding the overhead of rendering thousands of individual DOM elements.",
    },
    {
      id: 2,
      icon: LucideCpu,
      title: "Web Workers (Planned)",
      description:
        "Graph generation and coloring currently run on the main thread. " +
        "Moving these computations to Web Workers is a possible future improvement.",
    },
    {
      id: 3,
      icon: LucideShare2,
      title: "Graphology",
      description:
        "Graphology manages the graph's vertices, edges, and attributes, " +
        "providing a shared representation for algorithms and visualization.",
    },
    {
      id: 4,
      icon: LucideGrid3X3,
      title: "Spatial Partitioning",
      description:
        "A spatial grid organizes transmitters by location, allowing graph " +
        "generation to search nearby cells instead of comparing every pair of nodes.",
    },
    {
      id: 5,
      icon: LucidePackageCheck,
      title: "Playwright testing",
      description:
        "Unit tests verify graph construction and coloring algorithms, " +
        "while Playwright tests validate the application's main workflows.",
    },
  ];
}
