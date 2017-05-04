import * as moment from "moment";
import * as _ from "lodash";
import { Model } from "./model";

interface TransactionDetails {
  transactionId: string;
  transactionDate: string;
  postDate: string;
  accountName: string;
  embossedAccountNumber: string;
  embossedCardNumber: string;
  driverFirstName: string;
  driverMiddleName: string;
  driverLastName: string;
  customVehicleId: string;
  merchantBrand: string;
  merchantName: string;
  merchantAddress: string;
  merchantCity: string;
  merchantState: string;
  merchantZipCode: string;
  productDescription: string;
  grossCost: string;
  netCost: string;
}

export class Transaction extends Model<TransactionDetails> {

  public get transactionDate(): Date {
    return moment(this.details.transactionDate).toDate();
  }

  public set transactionDate(transactionDate: Date) {
    this.details.transactionDate = moment(transactionDate).toISOString();
  }

  public get postDate(): Date {
    return moment(this.details.postDate).toDate();
  }

  public set postDate(postDate: Date) {
    this.details.postDate = moment(postDate).toISOString();
  }
}

export namespace Transaction {
    export type Details = TransactionDetails;
    export type Field = keyof Details;
}
