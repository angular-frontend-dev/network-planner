import { isPlatformBrowser } from "@angular/common";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import type { Driver } from "driver.js";

export interface TutorialStep {
  target: string;
  title: string;
  description: string;
}

@Injectable({ providedIn: "root" })
export class GuidedTourService {
  private readonly platformId = inject(PLATFORM_ID);

  private tour?: Driver;
  private requestId = 0;

  async start(steps: TutorialStep[]): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || !steps.length) {
      return;
    }

    this.destroy();

    const requestId = this.requestId;
    const { driver } = await import("driver.js");

    // Prevent starting a tour after it was cancelled.
    if (requestId !== this.requestId) {
      return;
    }

    const instance = driver({
      showProgress: true,
      disableActiveInteraction: true,
      overlayClickBehavior: "none",
      allowScroll: false,
      overlayOpacity: 0.7,
      stagePadding: 8,
      stageRadius: 8,
      skipMissingElement: true,

      steps: steps.map((step) => ({
        element: step.target,
        popover: {
          title: step.title,
          description: step.description,
        },
      })),

      onDestroyed: () => {
        if (this.tour === instance) {
          this.tour = undefined;
        }
      },
    });

    this.tour = instance;
    instance.drive();
  }

  destroy(): void {
    this.requestId++;
    this.tour?.destroy();
    this.tour = undefined;
  }
}
