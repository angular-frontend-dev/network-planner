import { Component } from "@angular/core";
import {
  LucideCodeXml,
  LucidePanelsTopLeft,
  LucideLayers,
  LucideMousePointer2,
  LucideWorkflow,
  LucideNetwork,
  LucidePalette,
  LucideShare2,
  LucideActivity,
  LucideCircleStop,
} from "@lucide/angular";

@Component({
  standalone: true,
  imports: [
    LucideCodeXml,
    LucidePanelsTopLeft,
    LucideLayers,
    LucideMousePointer2,
    LucideWorkflow,
    LucideNetwork,
    LucidePalette,
    LucideShare2,
    LucideActivity,
    LucideCircleStop,
  ],
  selector: "app-architecture",
  styleUrl: "./architecture.component.scss",
  templateUrl: "./architecture.component.html",
})
export class ArchitectureComponent {}
