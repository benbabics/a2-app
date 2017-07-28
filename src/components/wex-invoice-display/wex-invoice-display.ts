import { Component, Input } from "@angular/core";
import { InvoiceSummary } from "@angular-wex/models";

@Component({
  selector: "wex-invoice-display",
  templateUrl: "wex-invoice-display.html"
})
export class WexInvoiceDisplay {

  private _collpased: boolean = false;

  @Input() invoiceSummary: InvoiceSummary;

  @Input() public set collapsed(collapsed: boolean) {
    this._collpased = collapsed;
  }

  public get collapsed(): boolean {
    return this._collpased;
  }

  public toggleCollapse() {
    this._collpased = !this._collpased;
  }
}
