import { Component } from "@angular/core";
import { CardsPage } from "../../pages/cards/cards";
import { LandingPage } from "../../pages/landing/landing";
import { PaymentsPage } from "../../pages/payments/payments";
import { Value } from "../../decorators/value";

@Component({
  selector: "wex-nav-bar",
  templateUrl: "wex-nav-bar.html"
})
export class WexNavBar {

  @Value("NAVIGATION") public CONSTANTS: any;

  public get CardsPage() {
    return CardsPage;
  }

  public get LandingPage() {
    return LandingPage;
  }

  public get PaymentsPage() {
    return PaymentsPage;
  }
}
