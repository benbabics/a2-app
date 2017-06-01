import * as _ from "lodash";
import { SecurePage } from "./secure-page";
import { Model } from "@angular-wex/models";

export type GroupedList<T> = { [group: string]: T[] };

export abstract class ListPage extends SecurePage {

  private static _groupBy<T>(list: T[], propertyPath: string, groups: string[]): GroupedList<T> {
    let groupedList: GroupedList<T> = {};

    groups.forEach((group) => groupedList[group] = _.filter(list,  _.matchesProperty(propertyPath, group)));

    return groupedList;
  }

  public static filterOnDetails<ModelT extends Model<DetailsT>, DetailsT>(list: ModelT[], filterOn: Partial<DetailsT>) {
    return list.filter((item: ModelT) => {
      return _.reduce(<any>filterOn, (valid, filterValue: any, filterProperty: keyof DetailsT) => {
        return valid && item.details[filterProperty] === filterValue;
      }, true);
    });
  }

  public static groupBy<T>(list: T[], groupBy: keyof T, groups: string[]): GroupedList<T> {
    return this._groupBy(list, groupBy, groups);
  }

  public static groupByDetails<ModelT extends Model<DetailsT>, DetailsT>(list: ModelT[], groupBy: keyof DetailsT, groups: string[]): GroupedList<ModelT> {
    return this._groupBy(list, `details.${groupBy}`, groups);
  }

  public static sortList<T>(list: T[], sortBy: any, order: "asc" | "desc"): T[] {
    return _.orderBy(list, sortBy, order);
  }

  public static sortListByDetails<ModelT extends Model<DetailsT>, DetailsT>(list: ModelT[], sortBy: keyof DetailsT, order: "asc" | "desc"): any[] {
    return this.sortList(list, `details.${sortBy}`, order);
  }
}
