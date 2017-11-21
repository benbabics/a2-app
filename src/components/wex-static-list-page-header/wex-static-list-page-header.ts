import { Component, Input } from "@angular/core";
import { StaticListPage } from "../../pages/static-list-page";
import { WexPlatform } from "../../providers/index";
import { ViewChild } from "@angular/core";
import { Searchbar } from "ionic-angular/components/searchbar/searchbar";

@Component({
  selector: "wex-static-list-page-header",
  templateUrl: "wex-static-list-page-header.html"
})
export class WexStaticListPageHeader {
  @Input() page: StaticListPage<any, any>;
  @Input() title: string;
  @ViewChild("searchbar") searchbar: Searchbar;

  public searchExists: boolean = false;

  public constructor(public  platform: WexPlatform) {
    this.searchExists = platform.isIos;
  }

  public search() {
    this.searchExists = true;
    setTimeout(() => this.searchbar.setFocus(), 500);
  }

  public cancel() {
    this.page.searchFilter = "";
    this.page.updateList();
    this.searchExists = false;
  }

  public onSearchBlur() {
    if (this.platform.isAndroid && this.page.searchFilter === "") {
      this.cancel();
    }
  }
}
