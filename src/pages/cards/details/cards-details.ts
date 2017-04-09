import { Component } from "@angular/core";
import { NavParams } from "ionic-angular";
import { WexNavController } from "../../../providers";
import { SecurePage } from "../../secure-page";
import { Card } from "../../../models";

@Component({
  selector: "page-cards-details",
  templateUrl: "cards-details.html"
})
export class CardsDetailsPage extends SecurePage {

  public card: Card;

  constructor(public navCtrl: WexNavController, public navParams: NavParams) {
    super("Cards.Details");

    this.card = this.navParams.get("card");
  }

  public get statusColor(): string {
    return this.CONSTANTS.STATUS.COLOR[this.card.details.status] || "warning";
  }

  public get statusIcon(): string {
    return this.CONSTANTS.STATUS.ICON[this.card.details.status] || "information-circled";
  }
}
