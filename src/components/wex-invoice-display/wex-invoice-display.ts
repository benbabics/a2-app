import { Component, Input } from "@angular/core";
import { InvoiceSummary } from "@angular-wex/models";

@Component({
  selector: "wex-invoice-display",
  templateUrl: "wex-invoice-display.html"
})
export class WexInvoiceDisplay {

  @Input() invoiceSummary: InvoiceSummary;
}
