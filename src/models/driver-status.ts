import * as _ from "lodash";

export type DriverStatus = keyof {
  active,
  suspended,
  terminated
};

export namespace DriverStatus {
  export const ACTIVE: DriverStatus = "active";
  export const SUSPENDED: DriverStatus = "suspended";
  export const TERMINATED: DriverStatus = "terminated";

  export const values = (): DriverStatus[] => [ACTIVE, SUSPENDED, TERMINATED];

  export const displayName = (DriverStatus: DriverStatus): string => {
    return _.capitalize(DriverStatus);
  };
}
