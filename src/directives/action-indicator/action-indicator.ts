import * as _ from "lodash";
import { Directive, Input, ElementRef, ViewContainerRef, Renderer2, ComponentFactoryResolver, ComponentRef } from "@angular/core";
import { Spinner } from "ionic-angular";

@Directive({
  selector: "[actionIndicator]"
})
export class ActionIndicatorDirective {
  private containerContents = [];
  private spinnerRef: ComponentRef<Spinner>;

  constructor(
    private el: ElementRef,
    private viewContainer: ViewContainerRef,
    private renderer: Renderer2,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  @Input("actionIndicator") set showIndicator(hasIndicator: boolean) {
    this.toggleIsLoading(hasIndicator);
    this.toggleContainerContents(hasIndicator);
    this.toggleSpinner(hasIndicator);
  }

  private get element(): any {
    return this.el.nativeElement;
  }

  private toggleIsLoading(isVisible: boolean) {
    if (isVisible) {
      this.renderer.addClass(this.element, "is-loading");
    }
    else {
      this.renderer.removeClass(this.element, "is-loading");
    }
  }

  private toggleSpinner(isVisible: boolean) {
    if (isVisible) {
      const spinnerContainer = this.renderer.createElement("div");
      spinnerContainer.classList.add("action-indicator");

      const factory = this.componentFactoryResolver.resolveComponentFactory(Spinner);
      this.spinnerRef = this.viewContainer.createComponent(factory);
      let spinnerElement = this.spinnerRef.injector.get(Spinner)._elementRef.nativeElement;
      spinnerElement.classList.add("action-spinner");

      this.renderer.appendChild(this.element, spinnerContainer);
      spinnerContainer.appendChild(spinnerElement);
    }
    else if (this.spinnerRef) {
      this.spinnerRef.destroy();
    }
  }

  private toggleContainerContents(isHidden: boolean) {
    if (isHidden) {
      let containerContentsCache = _.extend([], this.containerContents); // clone as .removeChild pops

      if (this.containerContents.length) {
        do {
          this.renderer.removeChild(this.element, this.containerContents[0]);
        }
        while (this.containerContents.length);
      }

      this.containerContents = containerContentsCache;
    }
    else {
      this.containerContents.forEach(child => this.renderer.appendChild(this.element, child));
      this.containerContents = this.element.childNodes;
    }
  }
}
