export type OnlineApplication = keyof {
  UNKNOWN,
  WOL_NP,
  CLASSIC,
  DISTRIBUTOR
}

export namespace OnlineApplication {
  export const UNKNOWN: OnlineApplication = "UNKNOWN";
  export const WOL_NP: OnlineApplication = "WOL_NP";
  export const CLASSIC: OnlineApplication = "CLASSIC";
  export const DISTRIBUTOR: OnlineApplication = "DISTRIBUTOR";

  export const values = (): OnlineApplication[] => [UNKNOWN, WOL_NP, CLASSIC, DISTRIBUTOR];
}
