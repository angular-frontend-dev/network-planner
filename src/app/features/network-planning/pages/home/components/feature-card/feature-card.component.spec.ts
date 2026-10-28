import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FeatureCardComponent } from "./feature-card.component";
import { beforeEach, describe, expect, it } from "vitest";

describe("FeatureCardComponent", () => {
  let component: FeatureCardComponent;
  let fixture: ComponentFixture<FeatureCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureCardComponent);
    fixture.componentRef.setInput("icon", "network");
    fixture.componentRef.setInput("title", "Test title");
    fixture.componentRef.setInput("description", "Test description");
    fixture.detectChanges();
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
