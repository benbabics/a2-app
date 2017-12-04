import { Directive, ElementRef, Input, HostListener } from "@angular/core";
import { Keyboard } from "@ionic-native/keyboard";
import { EventSource, Reactive } from "angular-rxjs-extensions";
import { Observable } from "rxjs/Observable";
import { DoCheck } from "angular-rxjs-extensions";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Reactive()
@Directive({
  selector: "[Autofocus]"
})
export class AutofocusDirective {
  @Input("Autofocus") private set Autofocus(autofocus: boolean) { this.Autofocus$.next(autofocus); }
  private Autofocus$ = new BehaviorSubject<boolean>(false);
  private hasFocused$ = new BehaviorSubject<boolean>(false);
  @EventSource(HostListener("focus")) private onFocus$: Observable<void>;
  @EventSource(HostListener("blur")) private onBlur$: Observable<void>;
  @DoCheck() private ngDoCheck$: Observable<void>;

  constructor(el: ElementRef, keyboard: Keyboard) {
    this.ngDoCheck$
      .flatMapTo(Observable.combineLatest(this.Autofocus$, this.hasFocused$).take(1))
      .filter((args: [boolean, boolean]) => {
        let [autoFocus, hasFocused] = args;
        if (autoFocus === true && !hasFocused) {
          keyboard.disableScroll(true);
          el.nativeElement.focus();
        }
        return autoFocus === false;
      })
      .subscribe(() => this.hasFocused$.next(false));

      this.onFocus$.subscribe(() => this.hasFocused$.next(true));
      this.onBlur$.subscribe(() => keyboard.disableScroll(false));
  }
}