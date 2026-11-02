import { BasePOM } from "./base.pom";

export abstract class TutorialPOM extends BasePOM {
  protected abstract readonly numberOfSteps: number;

  async skipTutorial() {
    await this.page.getByRole("button", { name: "Not now" }).click();
  }

  private async startTutorial() {
    await this.page
      .getByRole("button", {
        name: "Start tutorial",
      })
      .click();
  }

  async completeTutorial() {
    await this.startTutorial();
    for (let i = 0; i < this.numberOfSteps; i++) {
      await this.nextTutorialStep();
    }
  }

  private async nextTutorialStep() {
    await this.page.locator(".driver-popover-next-btn").click();
  }
}
