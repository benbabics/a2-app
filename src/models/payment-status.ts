import * as _ from "lodash";

export type PaymentStatus = keyof {
  SCHEDULED,
  COMPLETE
};

export namespace PaymentStatus {
  export const SCHEDULED: PaymentStatus = "SCHEDULED";
  export const COMPLETE: PaymentStatus = "COMPLETE";

  export const values = (): PaymentStatus[] => [SCHEDULED, COMPLETE];

  export const displayName = (PaymentStatus: PaymentStatus): string => {
    return _.capitalize(PaymentStatus);
  };
}
