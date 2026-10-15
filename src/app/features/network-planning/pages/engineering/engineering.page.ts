import { Component } from "@angular/core";
import { ArchitectureComponent } from "./components/architecture/architecture.component";
import { TechStackComponent } from "./components/tech-stack/tech-stack.component";
import { KeyDecisionComponent } from "./components/key-decision/key-decision.component";
import {
  LucideLayers,
  LucideCpu,
  LucideShare2,
  LucidePackageCheck,
  LucideCircleStop,
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
      title: "Canvas rendering",
      description:
        "Rendering thousands of nodes with DOM/SVG would be too slow. Canvas " +
        "provides smooth performance.",
    },
    {
      id: 2,
      icon: LucideCpu,
      title: "Web Workers",
      description:
        "Graph construction and DSATUR run in a separate thread to avoid blocking user input and rendering.",
    },
    {
      id: 3,
      icon: LucideShare2,
      title: "Adjacency Lists",
      description:
        "The interference graph is sparse, so we use adjacency lists O(V + E) instead of an adjacency matrix O(V²).",
    },
    {
      id: 4,
      icon: LucidePackageCheck,
      title: "Batched updates",
      description:
        "The worker sends batched updates instead of a message per operation, reducing communication overhead.",
    },
    {
      id: 5,
      icon: LucideCircleStop,
      title: "Cancellation",
      description:
        "Long-running computations can be cancelled, keeping the interface responsive at all times.",
    },
  ];
}
