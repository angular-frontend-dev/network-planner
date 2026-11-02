import { Component, ElementRef, input, output, viewChild } from "@angular/core";

@Component({
  selector: "app-tutorial-prompt",
  standalone: true,
  templateUrl: "./tutorial-prompt.component.html",
  styleUrl: "./tutorial-prompt.component.scss",
})
export class TutorialPromptComponent {
  readonly title = input("Would you like a quick tour?");
  readonly description = input(
    "Take a short guided tour to understand how this page works.",
  );

  readonly startTour = output<void>();
  readonly dismissed = output<void>();

  private readonly dialog =
    viewChild.required<ElementRef<HTMLDialogElement>>("dialog");

  open(): void {
    const element = this.dialog().nativeElement;

    if (!element.open) {
      element.showModal();
    }
  }

  start(): void {
    this.dialog().nativeElement.close();
    this.startTour.emit();
  }

  dismiss(event?: Event): void {
    event?.preventDefault();
    this.dialog().nativeElement.close();
    this.dismissed.emit();
  }
}
