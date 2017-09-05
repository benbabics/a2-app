import * as _ from "lodash";

export namespace NameUtils {
  export function PrintableName (...names: Array<string>): string {
    return DelimitedPrintableName(" ", ...names);
  }

  export function DelimitedPrintableName(delimiter: string, ...names: Array<string>): string {
    return names
      .filter(name => !_.isNil(name))
      .map(name => name
        .split(/\s/)
        .map(word => _.capitalize(word))
        .join(" "))
      .join(delimiter);
  }

  export function MaskUsername(username: string) {
    return username.replace(/.{1,3}$/, "***").substr(0, username.length);
  }
}