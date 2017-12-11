import { Component } from "@angular/core";
import { Reactive, StateEmitter } from "angular-rxjs-extensions";
import { NavParams } from "ionic-angular/navigation/nav-params";
import { PageParams, Page } from "../../page";
import { Injector } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { NavController } from "ionic-angular/navigation/nav-controller";
import { Observable } from "rxjs/Observable";
import { WexPlatform } from "../../../providers/index";

export type EqualityTestFunction<T> = (a: T, b: T) => boolean;

export interface SelectionItem<T> {
  label: string;
  subtext?: string;
  value: T;
}

export interface SelectionPageNavParams<T> extends PageParams {
  submittedItem$: Subject<T>;
  options: SelectionItem<T>[];
  submitButtonText: string;
  selfDismiss?: boolean;
  instructionalText?: string;
  equalityTest?: EqualityTestFunction<T>;
}

export type SelectionPageNavParamKey = keyof SelectionPageNavParams<void>;

export namespace SelectionPageNavParamKey {
  export const SubmittedItem: SelectionPageNavParamKey = "submittedItem$";
  export const Options: SelectionPageNavParamKey = "options";
  export const SelfDismiss: SelectionPageNavParamKey = "selfDismiss";
  export const InstructionalText: SelectionPageNavParamKey = "instructionalText";
  export const SubmitButtonText: SelectionPageNavParamKey = "submitButtonText";
  export const EqualityTest: SelectionPageNavParamKey = "equalityTest";
}

const defaultComparator: EqualityTestFunction<any> = (a: any, b: any) => {
  if (a === b) {
    return true;
  } else {
    return false;
  }
};

@Component({
  selector: "selection-page",
  templateUrl: "selection-page.html"
})
@Reactive()
export class SelectionPage extends Page {
  @StateEmitter.Alias("navParams.data." + SelectionPageNavParamKey.SubmittedItem) submittedItem$: Subject<any>;
  @StateEmitter.From("navParams.data." + SelectionPageNavParamKey.SubmittedItem) currentItem$: Subject<any>;
  @StateEmitter({ initialValue: true }) disableSubmit$: Subject<boolean>;
  public options: SelectionItem<any>;
  public instructionalText: string;
  public submitButtonText: string;
  public equalityTest: EqualityTestFunction<any>;

  constructor(public navParams: NavParams, navCtrl: NavController, public platform: WexPlatform, injector: Injector) {
    super(navParams.data, injector);

    this.options = navParams.get(SelectionPageNavParamKey.Options);
    this.instructionalText = navParams.get(SelectionPageNavParamKey.InstructionalText);
    this.submitButtonText = navParams.get(SelectionPageNavParamKey.SubmitButtonText);

    this.equalityTest = navParams.get(SelectionPageNavParamKey.EqualityTest);
    if (!this.equalityTest) {
      this.equalityTest = defaultComparator;
    }

    this.currentItem$.asObservable()
      .flatMap(item => Observable.combineLatest(Observable.of(item), this.submittedItem$))
      .subscribe((args: [SelectionItem<any>, SelectionItem<any>]) => {
        let [current, initial] = args;
        this.disableSubmit$.next(this.equalityTest(current, initial));
      });

    this.submittedItem$.asObservable()
      .take(1)
      .subscribe(item => this.currentItem$.next(item));

    this.submittedItem$.asObservable()
      .take(2)
      .last()
      .map(() => navParams.get(SelectionPageNavParamKey.SelfDismiss) as boolean)
      // Default to true by typesafe checking against false.
      .filter(selfDismiss => selfDismiss !== false)
      .subscribe(() => navCtrl.pop());
  }
}