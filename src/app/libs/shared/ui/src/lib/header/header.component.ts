import { Component, signal } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-header",
  styleUrls: ["./header.component.scss"],
  templateUrl: "./header.component.html",
  imports: [RouterLink],
})
export class HeaderComponent {
  readonly menuOpen = signal(false);

  toggleMenu() {
    this.menuOpen.update((open) => !open);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }
}
