import { Directive, HostListener, ElementRef, Renderer2, Output, EventEmitter } from "@angular/core";
import * as _ from "lodash";

@Directive({
  selector: "[wexClear]"
})
export class WexClear {
  @Output() ngModelChange = new EventEmitter<string>();

  private static readonly ACCEPTABLE_ELEMENT = "ion-input";
  private readonly CLEAR_OFFSET = 30;
  private buttonVisible: boolean = false;

  private get element(): any {
    return this.elementRef.nativeElement;
  }

  private get input(): any {
    return _.first(this.element.children);
  }

  private get inputIsEmpty(): boolean {
    return this.input.value === "";
  }

  public constructor(private renderer: Renderer2, private elementRef: ElementRef) {
    if (!WexClear.ACCEPTABLE_ELEMENT === this.element.localName) {
      throw new Error(`wexClear can only be an attribute of <${WexClear.ACCEPTABLE_ELEMENT}>`);
    }
  }

  @HostListener("keyup")
  @HostListener("keydown")
  public onKeyAction() {
    if (this.inputIsEmpty) {
      this.hideButton();
    } else {
      this.showButton();
    }
  }

  @HostListener("click", ["$event"])
  @HostListener("touchend", ["$event"])
  public onClick(event: MouseEvent) {
    if (this.isOnButton(event) && this.buttonVisible) {
      this.ngModelChange.emit("");
      this.hideButton();
    }
  }

  @HostListener("focus")
  public onFocus() {
    if (!this.inputIsEmpty) {
      this.showButton();
    }
  }

  @HostListener("blur")
  public onBlur() {
    this.hideButton();
  }

  private isOnButton(event: MouseEvent): boolean {
    return this.element.offsetWidth - event.layerX < this.CLEAR_OFFSET;
  }

  private showButton() {
    this.buttonVisible = true;
    this.renderer.addClass(this.element, "wex-clear");
  }

  private hideButton() {
    this.buttonVisible = false;
    this.renderer.removeClass(this.element, "wex-clear");
  }

}
