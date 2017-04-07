import * as moment from "moment";
import { Model } from "./model";

interface InvoiceSummaryDetails {
  billingDate: string;
  closingDate: string;
  paymentDueDate: string;
  accountNumber: string;
  availableCredit: number;
  billedAmount: number;
  creditLimit: number;
  currentBalance: number;
  currentBalanceAsOf: number;
  invoiceId: string;
  invoiceNumber: string;
  minimumPaymentDue: number;
  statementBalance: number;
  unbilledAmount: number;
  pendingAmount: number;
}

export class InvoiceSummary extends Model<InvoiceSummaryDetails> {

    public get billingDate(): Date {
      return this.details.billingDate ? moment(this.details.billingDate).toDate() : null;
    }

    public set billingDate(billingDate: Date) {
      this.details.billingDate = moment(billingDate).toISOString();
    }

    public get closingDate(): Date {
      return this.details.closingDate ? moment(this.details.closingDate).toDate() : null;
    }

    public set closingDate(closingDate: Date) {
      this.details.closingDate = moment(closingDate).toISOString();
    }

    public get paymentDueDate(): Date {
      return this.details.paymentDueDate ? moment(this.details.paymentDueDate).toDate() : null;
    }

    public set paymentDueDate(paymentDueDate: Date) {
      this.details.paymentDueDate = moment(paymentDueDate).toISOString();
    }

    public get isAllCreditAvailable(): boolean {
      return this.details.availableCredit >= this.details.creditLimit;
    }

    public get isAnyCreditAvailable(): boolean {
      return this.details.availableCredit > 0;
    }
}

export namespace InvoiceSummary {
    export type Details = InvoiceSummaryDetails;
    export type Field = keyof Details;
}
