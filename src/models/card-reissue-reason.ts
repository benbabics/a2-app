import { Constants } from "../app/app.constants";

export type CardReissueReason = keyof {
  DAMAGED,
  LOST,
  STOLEN
};

export namespace CardReissueReason {
  const DISPLAY_NAMES = Constants.CARD.REISSUE_REASON.DISPLAY_NAMES;

  export const DAMAGED: CardReissueReason = "DAMAGED";
  export const LOST: CardReissueReason = "LOST";
  export const STOLEN: CardReissueReason = "STOLEN";

  export const values = (): CardReissueReason[] => [DAMAGED, LOST, STOLEN];

  export function getDisplayName(cardReissueReason: CardReissueReason): string {
    return DISPLAY_NAMES[cardReissueReason] || DISPLAY_NAMES.UNKNOWN;
  }
}
