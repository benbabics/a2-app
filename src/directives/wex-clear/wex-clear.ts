import { Directive, HostListener, ElementRef, Renderer2 } from "@angular/core";

@Directive({
  selector: "[wexClear]"
})
export class WexClear {
  private static readonly ACCEPTABLE_ELEMENTS = "ion-input";
  private readonly CLEAR_OFFSET = 30;
  private buttonVisible: boolean = false;

  private get element() {
    return this.elementRef.nativeElement;
  }

  private get input() {
    return this.element.localName.includes("ion") ? this.element.children[0] : this.element;
  }

  private get inputIsEmpty(): boolean {
    return this.input.value === "";
  }

  public constructor(private renderer: Renderer2, private elementRef: ElementRef) {
    if (!WexClear.ACCEPTABLE_ELEMENTS === this.element.localName) {
      throw new Error(`wexClear can only be an attribute of <${WexClear.ACCEPTABLE_ELEMENTS}>`);
    }
  }

  @HostListener("keyup")
  public onKeyup() {
    if (this.inputIsEmpty) {
      this.hideButton();
    } else {
      this.showButton();
    }
  }

  @HostListener("click", ["$event"])
  public onClick(event: MouseEvent) {
    if (this.isOnButton(event)) {
      this.input.value = "";
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

  @HostListener("mousemove", ["$event"])
  public onMousemove(event: MouseEvent) {
    console.log(this.isOnButton(event));
    if (this.isOnButton(event) && this.buttonVisible) {
      this.renderer.addClass(this.input, "cursor-pointer");
    } else {
      this.renderer.removeClass(this.input, "cursor-pointer");
    }
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
