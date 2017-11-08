import { Directive, ElementRef, Input, DoCheck, HostListener } from "@angular/core";

@Directive({
  selector: "[Autofocus]"
})
export class AutofocusDirective implements DoCheck {
  @Input("Autofocus") Autofocus: boolean;
  private hasFocused: boolean = false;

  constructor(private el: ElementRef) { }

  public ngDoCheck() {
    if (this.Autofocus === true && !this.hasFocused) {
      this.el.nativeElement.focus();
    } else if (this.Autofocus === false) {
      this.hasFocused = false;
    }
  }

  @HostListener("focus")
  public onFocus() {
    this.hasFocused = true;
  }
}