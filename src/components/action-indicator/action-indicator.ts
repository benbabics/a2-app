import { Component, Input } from "@angular/core";
import { ElementRef } from "@angular/core";
import { OnChanges, SimpleChanges } from "@angular/core/src/metadata/lifecycle_hooks";

@Component({
  selector: "action-indicator",
  templateUrl: "action-indicator.html"
})
export class ActionIndicator implements OnChanges {

  @Input("when") public showIndicator: boolean;

  constructor(private elementRef: ElementRef) {}

  private element(): any {
    return this.elementRef.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges) {
    let hasIndicator = changes.showIndicator.currentValue;
    let button = this.element().closest(".button-gradient");

    if (button) {
      button.classList.toggle("is-loading", hasIndicator);
    }
  }

}
