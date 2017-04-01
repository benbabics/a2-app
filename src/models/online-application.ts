import { EnumUtil } from "../utils";

export enum OnlineApplication {
    UNKNOWN,
    WOL_NP,
    CLASSIC,
    DISTRIBUTOR
}

export namespace OnlineApplication {
    export let names = (): string[] => EnumUtil.names<OnlineApplication>(OnlineApplication);
    export let values = (): OnlineApplication[] => EnumUtil.values<OnlineApplication>(OnlineApplication);
}
