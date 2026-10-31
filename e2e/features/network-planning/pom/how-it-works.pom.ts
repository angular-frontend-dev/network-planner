import { Page } from "@playwright/test";

export class HowItWorksPOM {
  constructor(private readonly page: Page) {}

  get title() {
    return this.page.getByRole("main");
  }

  async goto() {
    await this.page.goto("/marketing/how-it-works");
  }
}
