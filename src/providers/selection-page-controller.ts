import { Injectable } from "@angular/core";
import { SelectionPageNavParams, SelectionPage } from "../pages/generic/index";
import { App } from "ionic-angular";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";


@Injectable()
export class SelectionPageController {
  public constructor(private app: App) {  }

  public presentSelectionPage<T>(navParams: SelectionPageNavParams<T>): Observable<T> {
    if (!(navParams.submittedItem instanceof Subject)) {
      navParams.submittedItem = new BehaviorSubject<T>(navParams.submittedItem);
    }

    this.app.getActiveNav().push(SelectionPage, navParams);

    return navParams.submittedItem.asObservable()
      .skip(1)
      .take(1);
  }
}