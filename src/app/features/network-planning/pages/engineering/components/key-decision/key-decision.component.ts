import { Component, input } from "@angular/core";
import { NgComponentOutlet } from "@angular/common";
import type { LucideIcon } from "@lucide/angular";

@Component({
  imports: [NgComponentOutlet],
  selector: "app-key-decision",
  styleUrl: "./key-decision.component.scss",
  templateUrl: "./key-decision.component.html",
})
export class KeyDecisionComponent {
  icon = input.required<LucideIcon>();
  title = input.required<string>();
  description = input.required<string>();
}
