import { Component, input, output } from "@angular/core";

@Component({
  selector: "app-warning-dialog",
  templateUrl: "./warning-dialog.component.html",
  styleUrl: "./warning-dialog.component.scss",
})
export class WarningDialogComponent {
  open = input(false);
  title = input<string>();

  close = output<void>();
}
