import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { TUTORIAL_STORAGE_KEY } from "./tutorial.constants";

@Injectable()
export class TutorialService {
  private readonly platformId = inject(PLATFORM_ID);

  hasSeenTutorial(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;

    return localStorage.getItem(TUTORIAL_STORAGE_KEY) === "true";
  }

  markAsSeen(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    localStorage.setItem(TUTORIAL_STORAGE_KEY, "true");
  }
}
