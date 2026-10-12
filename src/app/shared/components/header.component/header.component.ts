import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  standalone: true,
  selector: "app-header",
  styleUrls: ["./header.component.scss"],
  templateUrl: "./header.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}
