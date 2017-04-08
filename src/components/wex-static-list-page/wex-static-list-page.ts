import { Component, Query, ContentChild, Input } from "@angular/core";
import { StaticListPage } from "../../pages/static-list-page";

@Component({
  selector: "wex-static-list-page",
  templateUrl: "wex-static-list-page.html"
})
export class WexStaticListPage {

  @Input() page: StaticListPage<any, any>;

  @ContentChild("itemTemplate") itemTemplate: Query;
}
