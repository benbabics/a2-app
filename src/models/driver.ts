import * as moment from "moment";
import * as _ from "lodash";
import { Model } from "./model";
import { DriverStatus } from "./driver-status";

interface DriverDetails {
  driverId: string;
  promptId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  status: DriverStatus;
  statusDate: string;
  sourceSystem: string;
}

export class Driver extends Model<DriverDetails> {

  public get listDisplayName(): string {
    return `${_.capitalize(this.details.lastName)}, ${_.capitalize(this.details.firstName)}`;
  }

  public get statusDate(): Date {
    return moment(this.details.statusDate).toDate();
  }

  public set statusDate(statusDate: Date) {
    this.details.statusDate = moment(statusDate).toISOString();
  }

  public get isActive(): boolean {
    return this.details.status === DriverStatus.ACTIVE;
  }

  public get isSuspended(): boolean {
    return this.details.status === DriverStatus.SUSPENDED;
  }

  public get isTerminated(): boolean {
    return this.details.status === DriverStatus.TERMINATED;
  }

  public get statusDisplayName(): string {
    return DriverStatus.displayName(this.details.status);
  }
}

export namespace Driver {
    export type Details = DriverDetails;
    export type Field = keyof Details;
}
