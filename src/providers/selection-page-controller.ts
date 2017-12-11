import { Injectable } from "@angular/core";
import { SelectionPageNavParams, SelectionPage } from "../pages/generic/index";
import { App } from "ionic-angular";
import { Observable } from "rxjs/Observable";


@Injectable()
export class SelectionPageController {
  public constructor(private app: App) {  }

  public presentSelectionPage<T>(navParams: SelectionPageNavParams<T>): Observable<T> {
    this.app.getActiveNav().push(SelectionPage, navParams);

    return navParams.submittedItem$.asObservable()
      .take(2)
      .last();
  }
}