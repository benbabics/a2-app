import { Component, Input } from "@angular/core";
import { InAppBrowser } from "@ionic-native/in-app-browser";


@Component({
  selector: "user-enrollment-flow",
  templateUrl: "user-enrollment-flow.html"
})
export class UserEnrollmentFlow {
  @Input() text: string;

  constructor(private inAppBrowser: InAppBrowser) {  }

  private handleOpenEnrollmentWindow(): void {

  }
}
