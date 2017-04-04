import * as _ from "lodash";
import { EnumUtil } from "../utils";

export enum CardStatus {
    ACTIVE,
    SUSPENDED,
    TERMINATED
}

export namespace CardStatus {
    export const names = (): string[] => EnumUtil.names<CardStatus>(CardStatus);
    export const values = (): CardStatus[] => EnumUtil.values<CardStatus>(CardStatus);

    export const displayName = (cardStatus: CardStatus): string => {
      return _.capitalize(<any>cardStatus);
    };
}
