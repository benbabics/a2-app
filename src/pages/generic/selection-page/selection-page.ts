import { Component } from "@angular/core";
import { Reactive, StateEmitter } from "angular-rxjs-extensions";
import { NavParams } from "ionic-angular/navigation/nav-params";
import { PageParams, Page } from "../../page";
import { Injector } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { NavController } from "ionic-angular/navigation/nav-controller";
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

const defaultEqualityTest: EqualityTestFunction<any> = (a: any, b: any) => a === b;

@Component({
  selector: "selection-page",
  templateUrl: "selection-page.html"
})
@Reactive()
export class SelectionPage extends Page {
  @StateEmitter.Alias("navParams.data." + SelectionPageNavParamKey.SubmittedItem) submittedItem$: Subject<any>;
  @StateEmitter.From("navParams.data." + SelectionPageNavParamKey.SubmittedItem) currentItem$: Subject<any>;
  @StateEmitter({ initialValue: true }) disableSubmit$: Subject<boolean>;
  public readonly options: SelectionItem<any> = this.navParams.get(SelectionPageNavParamKey.Options);
  public readonly instructionalText: string = this.navParams.get(SelectionPageNavParamKey.InstructionalText);
  public readonly submitButtonText: string = this.navParams.get(SelectionPageNavParamKey.SubmitButtonText);
  public readonly equalityTest: EqualityTestFunction<any> = this.navParams.get(SelectionPageNavParamKey.EqualityTest) || defaultEqualityTest;

  constructor(public navParams: NavParams, navCtrl: NavController, public platform: WexPlatform, injector: Injector) {
    super(navParams.data, injector);

    // Default to true by typesafe checking against false
    const selfDismiss = navParams.get(SelectionPageNavParamKey.SelfDismiss) !== false;
    if (selfDismiss) {
      this.submittedItem$.asObservable()
        .skip(1)
        .take(1)
        .subscribe(() => navCtrl.pop());
    }

    this.currentItem$.asObservable()
      .withLatestFrom(this.submittedItem$)
      .subscribe((args: [SelectionItem<any>, SelectionItem<any>]) => {
        let [current, initial] = args;
        this.disableSubmit$.next(this.equalityTest(current, initial));
      });
  }
}