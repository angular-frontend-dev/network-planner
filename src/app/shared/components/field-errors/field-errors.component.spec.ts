import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FieldErrorsComponent } from "./field-errors.component";
import { beforeEach, describe, expect, it } from "vitest";
import { signal } from "@angular/core";
import { form } from "@angular/forms/signals";

describe("FieldErrorsComponent", () => {
  let component: FieldErrorsComponent;
  let fixture: ComponentFixture<FieldErrorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldErrorsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FieldErrorsComponent);
    component = fixture.componentInstance;

    const model = signal({ value: "" });

    const testForm = TestBed.runInInjectionContext(() => form(model));

    fixture.componentRef.setInput("field", testForm.value());

    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
