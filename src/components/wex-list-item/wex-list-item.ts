import { Component, Input } from "@angular/core";

@Component({
  selector: "wex-list-item",
  templateUrl: "wex-list-item.html"
})
export class WexListItem {
  @Input() active: boolean;
}
