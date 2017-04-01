import * as moment from "moment";
import { Model } from "./model";

export type InvoiceSummaryField = keyof InvoiceSummary.Details;

class InvoiceSummaryDetails extends Model<InvoiceSummaryDetails> {
  _billingDate: string;
  _closingDate: string;
  _paymentDueDate: string;
  accountNumber: string;
  availableCredit: number;
  billingAmount: number;
  creditLimit: number;
  currentBalance: number;
  currentBalanceAsOf: number;
  invoiceId: string;
  invoiceNumber: string;
  minimumPaymentDue: number;
  statementBalance: number;
  unbilledAmount: number;
}

export class InvoiceSummary extends InvoiceSummaryDetails {

    public constructor(details?: InvoiceSummaryDetails) {
        super(details || {} as InvoiceSummaryDetails);
    }

    public get billingDate(): Date {
      return this._billingDate ? moment(this._billingDate).toDate() : null;
    }

    public set billingDate(billingDate: Date) {
      this._billingDate = moment(billingDate).toISOString();
    }

    public get closingDate(): Date {
      return this._closingDate ? moment(this._closingDate).toDate() : null;
    }

    public set closingDate(closingDate: Date) {
      this._closingDate = moment(closingDate).toISOString();
    }

    public get paymentDueDate(): Date {
      return this._paymentDueDate ? moment(this._paymentDueDate).toDate() : null;
    }

    public set paymentDueDate(paymentDueDate: Date) {
      this._paymentDueDate = moment(paymentDueDate).toISOString();
    }

    public get isAllCreditAvailable(): boolean {
      return this.availableCredit >= this.creditLimit;
    }

    public get isAnyCreditAvailable(): boolean {
      return this.availableCredit > 0;
    }
}

export namespace InvoiceSummary {
    export type Details = InvoiceSummaryDetails;
}
