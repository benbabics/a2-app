import * as _ from "lodash";
import { Observable } from "rxjs";
import { ListPage, GroupedList } from "./list-page";
import { Model } from "../models";

export { GroupedList } from "./list-page";

export abstract class StaticListPage<T extends Model<DetailsT>, DetailsT> extends ListPage {

  abstract dividerLabels: string[];
  abstract sortedItemLists: T[][];

  protected fetchingItems: boolean = false;
  protected searchFilter: string = "";
  protected sortedItemGroups: GroupedList<T> = {};
  protected items: T[];

  constructor(pageName: string, protected searchFilterFields?: (keyof DetailsT)[]) {
    super(pageName);
  }

  protected abstract sortItems(items: T[]): T[];
  protected abstract groupItems(items: T[]): GroupedList<T>;
  protected abstract search(): Observable<T[]>;

  protected get isSearchEnabled(): boolean {
    return !!this.searchFilterFields;
  }

  ionViewWillEnter() {
    this.fetchingItems = true;

    this.search()
      .finally(() => this.fetchingItems = false)
      .subscribe((items: T[]) => {
        this.items = items;

        this.updateList();
      });
  }

  protected createSearchRegex(searchFilter: string) {
    //do a case-insensitive search
    return new RegExp(_.escapeRegExp(searchFilter), "i");
  }

  protected defaultItemSort(items: T[], sortBy: keyof DetailsT, order: "asc" | "desc" = "asc"): T[] {
    return this.sortListByDetails<T, DetailsT>(items, sortBy, order);
  }

  protected defaultItemGroup(items: T[], groupBy: keyof DetailsT, groups: string[]): GroupedList<T> {
    return this.groupByDetails<T, DetailsT>(items, groupBy, groups);
  }

  protected sortItemGroups(groupedItems: GroupedList<T>): GroupedList<T> {
    return _.transform(groupedItems, (sortedGroups: GroupedList<T>, items: T[], group: string) => {
      //sort each grouped list individually
      return sortedGroups[group] = this.sortItems(items);
    }, {});
  }

  public updateList() {
    let filteredItems: T[];

    if (this.isSearchEnabled) {
      let searchRegex = this.createSearchRegex(this.searchFilter);

      filteredItems = this.items.filter((item: T) => this.searchFilterFields.some((searchField) => {
        return String(item.details[searchField]).search(searchRegex) !== -1;
      }));
    }
    else {
      filteredItems = this.items;
    }


    this.sortedItemGroups = this.sortItemGroups(this.groupItems(filteredItems));
  }
}