import * as _ from "lodash";
import { Observable } from "rxjs";
import { ListPage, GroupedList } from "./list-page";
import { Model, Session } from "../models";

export { GroupedList } from "./list-page";
import { SessionManager } from "../providers/session-manager";
import { WexGreeking } from "../components";

export abstract class StaticListPage<T extends Model<DetailsT>, DetailsT> extends ListPage {

  // The session data to display for this list
  protected abstract listData: Session.Field;

  private _fetchingItems: boolean = false;
  private _items: T[];
  private _displayedItems: T[];
  private _displayedItemGroups: GroupedList<T> = {};

  // Set this to specify the order that groups should appear in grouped list mode
  protected listGroupDisplayOrder: string[] = null;

  public searchFilter: string = "";

  // Set this to add header dividers and enable grouped list mode
  public dividerLabels?: string[] = null;
  // Labels for the list header
  public listLabels?: string[] = _.get<string[]>(this.CONSTANTS, "listLabels");
  // Search field label
  public searchLabel?: string = _.get<string>(this.CONSTANTS, "searchLabel");
  //The greeking data displayed for each element
  public greekingData?: WexGreeking.Rect[] = _.get<WexGreeking.Rect[]>(this.CONSTANTS, "greekingData");
  //The number of default elements to display
  public greekedElementCount?: number = _.get<number>(this.CONSTANTS, "greekedElementCount");

  constructor(
    pageName: string,
    sessionManager: SessionManager,
    protected searchFilterFields?: (keyof DetailsT)[],
    requiredSessionInfo?: Session.Field[]
  ) {
    super(pageName, sessionManager, requiredSessionInfo);
  }

  protected abstract sortItems(items: T[]): T[];

  protected get displayedItemGroups(): GroupedList<T> {
    return this._displayedItemGroups;
  }

  protected get isSearchEnabled(): boolean {
    return !!this.searchFilterFields;
  }

  protected get items(): T[] {
    return this._items;
  }

  protected clearList() {
    this._items = [];
    this._displayedItems = [];
    this._displayedItemGroups = {};
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

  protected fetchResults(forceUpdate?: boolean): Observable<T[]> {
    this.clearList(); //Clear the results for a new search

    this._fetchingItems = true;
    // get the session info required to display the list
    return this.sessionManager.cache.getSessionDetail(this.listData, { forceRequest: forceUpdate })
      .finally(() => this._fetchingItems = false)
      .map((items: T[]): T[] => {
        this._items = items;

        // build the display lists
        this.updateList();
        return this.items;
      });
  }

  protected groupItems(items: T[]): GroupedList<T> {
    throw new Error("StaticListPage.groupItems must be defined when using a grouped list.");
  }

  protected sortItemGroups(groupedItems: GroupedList<T>): GroupedList<T> {
    return _.transform(groupedItems, (sortedGroups: GroupedList<T>, items: T[], group: string) => {
      //sort each grouped list individually
      return sortedGroups[group] = this.sortItems(items);
    }, {});
  }

  protected updateList() {
    if (this.isSearchEnabled) {
      let searchRegex = this.createSearchRegex(this.searchFilter);

      this._displayedItems = this._items.filter((item: T) => this.searchFilterFields.some((searchField) => {
        return String(item.details[searchField]).search(searchRegex) !== -1;
      }));
    }
    else {
      this._displayedItems = this._items;
    }

    if (this.isGrouped) {
      this._displayedItemGroups = this.sortItemGroups(this.groupItems(this._displayedItems));
    }
    else {
      this._displayedItems = this.sortItems(this._displayedItems);
    }
  }

  ionViewWillEnter() {
    this.fetchResults().subscribe();
  }

  public get displayedItems(): T[] {
    return this.isGrouped ? null : this._displayedItems;
  }

  public get displayedItemLists(): T[][] {
    if (this.isGrouped) {
      //returns a list containing lists of items, ordered by the specified group display order
      return this.listGroupDisplayOrder.reduce<T[][]>((sortedList: T[][], group: string) => {

        sortedList.push(this._displayedItemGroups[group]);
        return sortedList;
      }, []);
    }

    return null;
  }

  public get fetchingItems(): boolean {
    return this._fetchingItems;
  }

  public get isGrouped(): boolean {
    return !!this.dividerLabels;
  }

  public onRefresh(refresher) {
    this.fetchResults(true)
      .finally(() => refresher.complete())
      .subscribe();
  }
}
