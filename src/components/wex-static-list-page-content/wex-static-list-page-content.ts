import { Component, Query, ContentChild, Input } from "@angular/core";
import { StaticListPage } from "../../pages/static-list-page";

@Component({
  selector: "wex-static-list-page-content",
  templateUrl: "wex-static-list-page-content.html"
})
export class WexStaticListPageContent {

  @Input() page: StaticListPage<any, any>;

  @ContentChild("itemTemplate") itemTemplate: Query;
}
