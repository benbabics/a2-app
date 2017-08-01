import { Component, Input } from "@angular/core";

@Component({
  selector: "wex-info-card",
  templateUrl: "wex-info-card.html"
})
export class WexInfoCard {

  @Input() public iconName: string = "information-circle";
  @Input() public color?: string;
}
