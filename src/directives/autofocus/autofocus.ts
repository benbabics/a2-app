import { Directive, ElementRef, Input, AfterViewInit } from "@angular/core";
import * as _ from "lodash";

@Directive({
  selector: "[Autofocus]"
})
export class AutofocusDirective implements AfterViewInit {
    @Input() ngAutofocus: boolean | string;

    constructor(private el: ElementRef) { }

    public ngAfterViewInit() {
      if (this.ngAutofocus || this.ngAutofocus === "" || _.isNil(this.ngAutofocus)) {
        this.el.nativeElement.focus();
      }
    }
}