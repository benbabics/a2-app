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
}