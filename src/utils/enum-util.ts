import * as _ from "lodash";

export namespace EnumUtil {

    type EnumFilter<EnumT> = _.LoDashExplicitArrayWrapper<EnumT | string>;

    let flatten = <EnumT>(enumT: any): EnumFilter<EnumT> => {
        // flatten enum into an array of enum entry names and values
        return _.chain(enumT as EnumT)
                .values<EnumT | string>();
    };

    export let names = <EnumT>(enumT: any): string[] => {
        return flatten<EnumT>(enumT)
               .filter(_.isString)
               .map<string>()
               .value();
    };

    export let values = <EnumT>(enumT: any): EnumT[] => {
        return flatten<EnumT>(enumT)
               .filter(_.isNumber)
               .map<EnumT>()
               .value();
    };
}
