import { Component, Input } from "@angular/core";

@Component({
  selector: "action-indicator",
  templateUrl: "action-indicator.html"
})
export class ActionIndicator {

  @Input("when") public showIndicator: boolean;

  constructor() { }

}
