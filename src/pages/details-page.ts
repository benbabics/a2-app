import { ViewChild } from "@angular/core";
import { NavController, Navbar } from "ionic-angular";
import { SecurePage } from "./secure-page";

export abstract class DetailsPage extends SecurePage {

  @ViewChild(Navbar) navBar: Navbar;

  private exited = false;

  constructor(pageName: string, protected navCtrl: NavController) {
    super(pageName);
  }

  private goBack() {
    if (!this.exited) {
      this.navCtrl.pop();
      this.exited = true;
    }
  }

  ionViewDidLoad() {
    // Guard against double popping
    this.navBar.backButtonClick = () => this.goBack();
  }

  ionViewDidLeave() {
    // Reset the tab nav stack back to the main list page
    this.goBack();
  }
}
