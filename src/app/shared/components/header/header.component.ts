import { Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-header",
  styleUrls: ["./header.component.scss"],
  templateUrl: "./header.component.html",
  imports: [RouterLink],
})
export class HeaderComponent {}
