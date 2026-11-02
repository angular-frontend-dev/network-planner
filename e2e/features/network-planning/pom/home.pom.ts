import { BasePOM } from "../../../shared/pom/base.pom";

export class HomePOM extends BasePOM {
  protected readonly path = "/";

  readonly randomGraphSection = this.page.getByTestId("home-random-graph");

  readonly randomGraphCanvas = this.randomGraphSection.locator("canvas");
}
