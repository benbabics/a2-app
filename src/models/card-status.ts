import * as _ from "lodash";

export type CardStatus = keyof {
  ACTIVE,
  SUSPENDED,
  TERMINATED
};

export namespace CardStatus {
  export const ACTIVE: CardStatus = "ACTIVE";
  export const SUSPENDED: CardStatus = "SUSPENDED";
  export const TERMINATED: CardStatus = "TERMINATED";

  export const values = (): CardStatus[] => [ACTIVE, SUSPENDED, TERMINATED];

  export const displayName = (cardStatus: CardStatus): string => {
    return _.capitalize(cardStatus);
  };
}
