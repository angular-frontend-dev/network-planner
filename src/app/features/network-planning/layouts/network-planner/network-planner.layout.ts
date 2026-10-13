import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { FooterComponent } from "../../../../shared/components/footer/footer.component";

@Component({
  selector: "app-network-planner-layout",
  styleUrls: ["./network-planner.layout.scss"],
  templateUrl: "./network-planner.layout.html",
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
})
export class NetworkPlannerLayout {}
