import { Component } from "@angular/core";
import { NavParams } from "ionic-angular";
import { WexNavController } from "../../providers";
import { SecurePage } from "../secure-page";

@Component({
  selector: "page-cards",
  templateUrl: "cards.html"
})
export class CardsPage extends SecurePage {

  constructor(public navCtrl: WexNavController, public navParams: NavParams) {
    super("Cards");
  }
}
