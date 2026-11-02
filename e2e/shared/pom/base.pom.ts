import { Page } from "@playwright/test";

export abstract class BasePOM {
  protected abstract readonly path: string;

  constructor(protected readonly page: Page) {}

  get main() {
    return this.page.getByRole("main");
  }

  async goto() {
    await this.page.goto(this.path);
  }
}
