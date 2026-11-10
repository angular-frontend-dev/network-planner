import { Component, input } from "@angular/core";
import type { FieldState } from "@angular/forms/signals";

@Component({
  selector: "app-field-errors",
  templateUrl: "./field-errors.component.html",
  styleUrls: ["./field-errors.component.scss"],
})
export class FieldErrorsComponent {
  field = input.required<FieldState<unknown>>();
}
