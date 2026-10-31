import { Page } from "@playwright/test";

export class HomePOM {
  constructor(private readonly page: Page) {}

  readonly randomGraphSection = this.page.getByTestId("home-random-graph");

  readonly randomGraphCanvas = this.randomGraphSection.locator("canvas");

  async goto() {
    await this.page.goto("/");
  }
}
