import { ComponentFixture, TestBed } from "@angular/core/testing";
import { KeyDecisionComponent } from "./key-decision.component";
import { beforeEach, describe, expect, it } from "vitest";
import { signal } from "@angular/core";
import { LucideLayers } from "@lucide/angular";

describe("KeyDecisionComponent", () => {
  let component: KeyDecisionComponent;
  let fixture: ComponentFixture<KeyDecisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyDecisionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KeyDecisionComponent);

    fixture.componentRef.setInput("icon", LucideLayers);
    fixture.componentRef.setInput("title", signal("Test title"));
    fixture.componentRef.setInput("description", signal("Test description"));

    fixture.detectChanges();

    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
