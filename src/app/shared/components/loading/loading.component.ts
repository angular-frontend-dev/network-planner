import { Component, input } from "@angular/core";

@Component({
  imports: [],
  selector: "app-loading",
  styleUrl: "./loading.component.scss",
  templateUrl: "./loading.component.html",
})
export class LoadingComponent {
  readonly loading = input<boolean>(false);
}
