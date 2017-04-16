import * as _ from "lodash";

export namespace AddressValidators {

    export const POBOX_REGEX = new RegExp("([\\w\\s*\\W]*(P(OST)?(\\.)?\\s*O(FF(ICE)?)?(\\.)?\\s*B(OX)?))[\\w\\s*\\W]*");

    export function isPoBox(value: string): boolean {
       return _.isString(value) && value.length > 0 && !!value.toUpperCase().match(POBOX_REGEX);
    }
}
