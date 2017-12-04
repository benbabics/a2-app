import { Component, Input, ViewChild } from "@angular/core";
import { StaticListPage } from "../../pages/static-list-page";
import { Searchbar } from "ionic-angular";
import { Reactive, StateEmitter } from "angular-rxjs-extensions";
import { Subject } from "rxjs/Subject";


@Component({
  selector: "wex-static-list-page-header",
  templateUrl: "wex-static-list-page-header.html"
})
@Reactive()
export class WexStaticListPageHeader {
  @StateEmitter(ViewChild(Searchbar)) public searchbar$: Subject<Searchbar>;
  @Input() public page: StaticListPage<any, any>;
}
