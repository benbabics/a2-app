import { ViewChild } from "@angular/core";
import { NavController, Navbar } from "ionic-angular";
import { SecurePage } from "./secure-page";
import { SessionManager } from "../providers/session-manager";
import { Session } from "../models/session";

export abstract class DetailsPage extends SecurePage {

  @ViewChild(Navbar) navBar: Navbar;

  private exited = false;

  constructor(
    pageName: string,
    sessionManager: SessionManager,
    protected navCtrl: NavController,
    requiredSessionInfo?: Session.Field[]
  ) {
    super(pageName, sessionManager, requiredSessionInfo);
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
    //this.goBack();
  }
}
