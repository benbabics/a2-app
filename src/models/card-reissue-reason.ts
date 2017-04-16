export type CardReissueReason = keyof {
  DAMAGED,
  LOST,
  STOLEN
};

export namespace CardReissueReason {
  export const DAMAGED: CardReissueReason = "DAMAGED";
  export const LOST: CardReissueReason = "LOST";
  export const STOLEN: CardReissueReason = "STOLEN";

  export const values = (): CardReissueReason[] => [DAMAGED, LOST, STOLEN];
}
