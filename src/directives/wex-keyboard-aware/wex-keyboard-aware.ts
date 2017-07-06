import { Directive, OnInit, OnDestroy, ElementRef } from "@angular/core";
import { Keyboard } from "@ionic-native/keyboard";

@Directive({
  selector: "[wexKeyboardAware]"
})
export class WexKeyboardAware implements OnInit, OnDestroy {

  private static readonly ELEMENT_OVERRIDES: { [tagName: string]: string } = {
    "ion-content": ".scroll-content"
  };

  private _onKeyboardOpen = event => this.onKeyboardOpen(event);
  private _onKeyboardClose = event => this.onKeyboardClose(event);

  constructor(
    private elementRef: ElementRef,
    private keyboard: Keyboard
  ) { }

  private get nativeElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  private get targetElement(): HTMLElement {
    let overrideQuery = WexKeyboardAware.ELEMENT_OVERRIDES[this.nativeElement.tagName.toLowerCase()];

    if (overrideQuery) {
      return this.nativeElement.querySelector(overrideQuery) as HTMLElement;
    }

    return this.nativeElement;
  }

  private onKeyboardOpen(event: any) {
    this.targetElement.style.marginBottom = `${event.keyboardHeight}px`;
  }

  private onKeyboardClose(event: any) {
    this.targetElement.style.marginBottom = "0px";
  }

  public ngOnInit() {
    this.keyboard.disableScroll(true);

    window.addEventListener("native.keyboardshow", this._onKeyboardOpen);
    window.addEventListener("native.keyboardhide", this._onKeyboardClose);
  }

  public ngOnDestroy() {
    this.keyboard.disableScroll(false);

    window.removeEventListener("native.keyboardshow", this._onKeyboardOpen);
    window.removeEventListener("native.keyboardhide", this._onKeyboardClose);
  }
}
