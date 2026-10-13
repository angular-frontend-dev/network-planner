import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { FooterComponent } from "../../../../shared/components/footer/footer.component";

@Component({
  selector: "app-marketing-layout",
  styleUrls: ["./marketing.layout.scss"],
  templateUrl: "./marketing.layout.html",
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
})
export class MarketingLayout {}
