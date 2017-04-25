import * as _ from "lodash";
import { Observable } from "rxjs";
import { ListPage, GroupedList } from "./list-page";
import { Model, Session } from "../models";
import { WexGreeking } from "../components";

export { GroupedList } from "./list-page";
import { SessionManager } from "../providers/session-manager";

export abstract class StaticListPage<T extends Model<DetailsT>, DetailsT> extends ListPage {

  protected abstract listGroupDisplayOrder: string[];
  public abstract dividerLabels: string[];

  protected fetchingItems: boolean = false;
  protected searchFilter: string = "";
  protected sortedItemGroups: GroupedList<T> = {};
  protected items: T[];
  protected greekingData: WexGreeking.Rect[];
  protected greekedElementCount: number;

  constructor(
    pageName: string,
    sessionManager: SessionManager,
    protected searchFilterFields?: (keyof DetailsT)[],
    requiredSessionInfo?: Session.Field[]
  ) {
    super(pageName, sessionManager, requiredSessionInfo);
  }

  protected abstract sortItems(items: T[]): T[];
  protected abstract groupItems(items: T[]): GroupedList<T>;
  protected abstract search(): Observable<T[]>;

  protected get isSearchEnabled(): boolean {
    return !!this.searchFilterFields;
  }

  private fetchResults(): Observable<T[]> {
    this.fetchingItems = true;
    this.clearList(); //Clear the results for a new search

    return this.search()
      .finally(() => {
        this.fetchingItems = false;
      })
      .map((items: T[]) => {
        this.items = items;

        this.updateList();
        return items;
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

  ionViewDidLoad() {
    this.fetchResults().subscribe();
  }

  public clearList() {
    this.items = [];
    this.sortedItemGroups = {};
  }

  public onRefresh(refresher) {
    this.fetchResults()
    .finally(() => refresher.complete())
    .subscribe();
  }

  public get sortedItemLists(): T[][] {
    //returns a list of item lists ordered by the list group display order
    return this.listGroupDisplayOrder.reduce<T[][]>((sortedList: T[][], group: string) => {

      sortedList.push(this.sortedItemGroups[group]);
      return sortedList;
    }, []);
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
