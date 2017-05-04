import { Component, Input } from "@angular/core";
import { StaticListPage } from "../../pages/static-list-page";

@Component({
  selector: "wex-static-list-page-header",
  templateUrl: "wex-static-list-page-header.html"
})
export class WexStaticListPageHeader {

  @Input() page: StaticListPage<any, any>;
}
