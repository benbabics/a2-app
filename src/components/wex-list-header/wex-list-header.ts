import { Component, Input } from "@angular/core";

@Component({
  selector: "wex-list-header",
  templateUrl: "wex-list-header.html"
})
export class WexListHeader {
  @Input() fields: string[] = [];
}
