import { Injectable } from "@angular/core";
import { WexSnackbarAction } from "../wex-snackbar/wex-snackbar";

@Injectable()
export class WexAppSnackbarController {

  public text: string;
  public buttonTextColor: string;

  public action: WexSnackbarAction = {
   label: "",
   handler: () => { }
  }

  public get hasContent(): boolean {
    return !!this.text;
  }

  public setActionToDismiss() {
    this.action.label = "Dismiss";
    this.action.handler = () => true;
  }

  public clear() {
    this.text = "";
    this.buttonTextColor = "";
  }

  public general(text: string) {
    this.text = text;
    this.buttonTextColor = "";
  }

  public error(text: string) {
    this.text = text;
    this.buttonTextColor = "red";
  }

  public success(text: string) {
    this.text = text;
    this.buttonTextColor = "green";
  }

  public warning(text: string) {
    this.text = text;
    this.buttonTextColor = "orange";
  }
}
