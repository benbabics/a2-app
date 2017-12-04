import { Component, Input, ViewChild } from "@angular/core";
import { StaticListPage } from "../../pages/static-list-page";
import { Searchbar } from "ionic-angular";

@Component({
  selector: "wex-static-list-page-header",
  templateUrl: "wex-static-list-page-header.html"
})
export class WexStaticListPageHeader {

  @ViewChild(Searchbar) searchbar: Searchbar;
  @Input() page: StaticListPage<any, any>;
}
