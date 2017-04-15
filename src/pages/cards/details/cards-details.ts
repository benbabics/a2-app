import { Component } from "@angular/core";
import { NavParams, NavController } from "ionic-angular";
import { DetailsPage } from "../../details-page";
import { Card } from "../../../models";

@Component({
  selector: "page-cards-details",
  templateUrl: "cards-details.html"
})
export class CardsDetailsPage extends DetailsPage {

  public card: Card;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    super("Cards.Details", navCtrl);

    this.card = this.navParams.get("card");
  }

  public get statusColor(): string {
    return this.CONSTANTS.STATUS.COLOR[this.card.details.status] || "warning";
  }

  public get statusIcon(): string {
    return this.CONSTANTS.STATUS.ICON[this.card.details.status] || "information-circled";
  }
}
