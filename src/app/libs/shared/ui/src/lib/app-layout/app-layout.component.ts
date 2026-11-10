import { Component, input } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: "app-layout",
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: "./app-layout.component.html",
  styleUrl: "./app-layout.component.scss",
})
export class AppLayoutComponent {
  theme = input<"light" | "dark">("dark");
}
