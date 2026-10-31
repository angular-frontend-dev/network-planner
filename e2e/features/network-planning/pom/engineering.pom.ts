import { Locator, Page } from "@playwright/test";

export class EngineeringPOM {
  constructor(private readonly page: Page) {}

  get title(): Locator {
    return this.page.getByRole("main");
  }

  async goto() {
    await this.page.goto("/marketing/engineering");
  }
}
