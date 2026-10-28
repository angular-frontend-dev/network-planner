import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MarketingLayout } from "./marketing.layout";
import { beforeEach, describe, expect, it } from "vitest";
import { provideRouter } from "@angular/router";

describe("MarketingLayout", () => {
  let component: MarketingLayout;
  let fixture: ComponentFixture<MarketingLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketingLayout],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MarketingLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
