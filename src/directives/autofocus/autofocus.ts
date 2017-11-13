import { Directive, ElementRef, Input, DoCheck, HostListener } from "@angular/core";
import { Keyboard } from "@ionic-native/keyboard";

@Directive({
  selector: "[Autofocus]"
})
export class AutofocusDirective implements DoCheck {
  @Input("Autofocus") Autofocus: boolean;
  private hasFocused: boolean = false;

  constructor(private el: ElementRef, private keyboard: Keyboard) { }

  public ngDoCheck() {
    if (this.Autofocus === true && !this.hasFocused) {
      this.keyboard.disableScroll(true);
      this.el.nativeElement.focus();
    } else if (this.Autofocus === false) {
      this.hasFocused = false;
    }
  }

  @HostListener("focus")
  public onFocus() {
    this.hasFocused = true;
  }

  @HostListener("blur")
  public onBlur() {
    this.keyboard.disableScroll(false);
  }
}