import * as _ from "lodash";
import { Directive, Input, ElementRef, ViewContainerRef, Renderer2, ComponentFactoryResolver } from "@angular/core";
import { Spinner } from "ionic-angular";

@Directive({
  selector: "[actionIndicator]"
})
export class ActionIndicatorDirective {
  private buttonContents = [];
  private spinnerRef;

  constructor(
    private el: ElementRef,
    private viewContainer: ViewContainerRef,
    private renderer: Renderer2,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  @Input() public actionIndicator;
  @Input("when") set showIndicator(hasIndicator: boolean) {
    this.toggleIsLoading(hasIndicator);
    this.toggleButtonContents(hasIndicator);
    this.toggleSpinner(hasIndicator);
  }

  private get element(): any {
    return this.el.nativeElement;
  }

  private toggleIsLoading(isVisible: boolean) {
    this.renderer[isVisible ? "addClass" : "removeClass"](this.element, "is-loading");
  }

  private toggleSpinner(isVisible: boolean) {
    if (isVisible) {
      const factory = this.componentFactoryResolver.resolveComponentFactory(Spinner);
      this.spinnerRef = this.viewContainer.createComponent(factory);
      let spinnerElement = this.spinnerRef.injector.get(Spinner)._elementRef.nativeElement;
      this.renderer.appendChild(this.element, spinnerElement);
    }
    else if (this.spinnerRef) {
      this.spinnerRef.destroy();
    }
  }

  private toggleButtonContents(isVisible: boolean) {
    if (isVisible) {
      let buttonContentsCache = _.extend([], this.buttonContents); // clone as .removeChild pops

      do {
        this.renderer.removeChild(this.element, this.buttonContents[0]);
      }
      while (this.buttonContents.length);

      this.buttonContents = buttonContentsCache;
    }
    else {
      this.buttonContents.forEach(child => this.renderer.appendChild(this.element, child));
      this.buttonContents = this.element.childNodes;
    }
  }
}
