import * as _ from "lodash";
import { SecurePage } from "./secure-page";

export type GroupedList<T> = any;

export abstract class ListPage extends SecurePage {

  protected groupBy<T>(list: T[], groupBy: keyof T, groups: string[]): GroupedList<T> {
    let groupedList: GroupedList<T> = {};

    groups.forEach((group) => groupedList[group] = _.filter(list, _.zipObject([groupBy], [group])));

    return groupedList;
  }

  protected sortList(list: any[], sortBy: any, order: "asc" | "desc"): any[] {
    return _.orderBy(list, sortBy, order);
  }
}
