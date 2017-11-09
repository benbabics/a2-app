import { Injector, ViewChild } from "@angular/core";
import * as _ from "lodash";
import { Observable } from "rxjs";
import { ListPage, GroupedList } from "./list-page";
import { Model } from "@angular-wex/models";
import { Session } from "../models";

export { GroupedList } from "./list-page";
import { WexGreeking } from "../components";
import { SessionInfoOptions } from "../providers";
import { Content } from "ionic-angular";
import { PageDetails } from "./page";

export interface FetchOptions extends SessionInfoOptions {
  forceRequest?: boolean;
  clearItems?: boolean;
  checkListSize?: boolean;
}

export namespace FetchOptions {
  export const Defaults: Partial<FetchOptions> = {
    forceRequest: false,
    clearItems: true,
    checkListSize: true
  };
}

export const _FetchOptions = FetchOptions;
export type _FetchOptions = FetchOptions;

type milliseconds = number;

export abstract class StaticListPage<T extends Model<DetailsT>, DetailsT> extends ListPage {
  @ViewChild(Content) content: Content;

  // The threshold size that a list is considered large enough to automatically enable a loading facade
  private static readonly LARGE_LIST_SIZE = 75;
  private static readonly LARGE_LIST_FACADE_DURATION: milliseconds = 100;

  private _fetchingItems: boolean = false;
  private _items: T[] = [];
  private _displayedItems: T[] = [];
  private _displayedItemGroups: GroupedList<T> = {};
  public scrollLocation: number = 0;

  // Set this to specify the order that groups should appear in grouped list mode
  protected listGroupDisplayOrder: string[] = null;

  public searchFilter: string = "";

  // Set this to add header dividers and enable grouped list mode
  public dividerLabels?: string[];
  // Labels for the list header
  public listLabels?: string[] = _.get<string[]>(this.CONSTANTS, "listLabels");
  // Search field label
  public searchLabel?: string = _.get<string>(this.CONSTANTS, "searchLabel");
  //The greeking data displayed for each element
  public greekingData?: WexGreeking.Rect[] = _.get<WexGreeking.Rect[]>(this.CONSTANTS, "greekingData");
  //The number of default elements to display
  public greekedElementCount?: number = _.get<number>(this.CONSTANTS, "greekedElementCount");
  //Enables a loading facade. This forces the greeking state of the list to be shown instead of the actual items.
  public loadingFacade?: boolean = false;

  public abstract goToDetailPage(element: T);

  constructor(
    pageDetails: PageDetails,
    protected listDataField: Session.Field,
    public injector: Injector,
    protected searchFilterFields?: (keyof DetailsT)[],
    requiredSessionInfo?: Session.Field[]
  ) {
    super(pageDetails, injector, requiredSessionInfo);
  }

  public static defaultItemSort<T extends Model<DetailsT>, DetailsT>(items: T[], sortBy: keyof DetailsT, order: "asc" | "desc" = "asc"): T[] {
    return ListPage.sortListByDetails<T, DetailsT>(items, sortBy, order);
  }

  public static defaultItemGroup<T extends Model<DetailsT>, DetailsT>(items: T[], groupBy: keyof DetailsT, groups: string[]): GroupedList<T> {
    return ListPage.groupByDetails<T, DetailsT>(items, groupBy, groups);
  }

  protected abstract sortItems(items: T[]): T[];

  protected get displayedItemGroups(): GroupedList<T> {
    return this._displayedItemGroups;
  }

  protected get isSearchEnabled(): boolean {
    return !!this.searchFilterFields;
  }

  /** @internal */
  public get items(): T[] {
    return this._items;
  }

  protected checkListSize() {
    // If this is a large list, enable a loading facade to defer list rendering until the view has been entered
    if (this.totalDisplayedItemCount > StaticListPage.LARGE_LIST_SIZE) {
      this.loadingFacade = true;
      window.setTimeout(() => this.loadingFacade = false, StaticListPage.LARGE_LIST_FACADE_DURATION);
    }
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

  protected fetch(options?: FetchOptions): Observable<T[]> {
    return (function (): Observable<Session> {
      if (options.forceRequest) {
        return this.sessionCache.update$(this.listDataField, options);
      }
      else {
        return this.sessionCache.require$(this.listDataField);
      }
    })().map(session => session[this.listDataField] as any);
  }

  protected fetchResults(options?: FetchOptions): Observable<T[]> {
    options = _.merge({}, FetchOptions.Defaults, options);

    if (options.clearItems) {
      this.clearList(); //Clear the results for a new search
    }

    this._fetchingItems = true;
    // get the session info required to display the list
    return this.fetch(options)
      .finally(() => this._fetchingItems = false)
      .map((items: T[]): T[] => {
        this._items = items;

        // build the display lists
        this.updateList();

        if (options.checkListSize) {
          this.checkListSize();
        }

        return this.items;
      });
  }

  protected filterItems(items: T[]): T[] {
    if (this.isSearchEnabled) {
      let searchRegex = this.createSearchRegex(this.searchFilter);

      return items.filter((item: T) => this.searchFilterFields.some((searchField) => {
        return String(item.details[searchField]).search(searchRegex) !== -1;
      }));
    }
    else {
      return this._items;
    }
  }

  protected groupItems(items: T[]): GroupedList<T> {
    console.error("StaticListPage.groupItems must be defined when using a grouped list.");
    return { items };
  }

  protected sortItemGroups(groupedItems: GroupedList<T>): GroupedList<T> {
    return _.transform(groupedItems, (sortedGroups: GroupedList<T>, items: T[], group: string) => {
      //sort each grouped list individually
      return sortedGroups[group] = this.sortItems(items);
    }, {});
  }

  protected updateList() {
    this._displayedItems = this.filterItems(this._items);

    if (this.isGrouped) {
      this._displayedItemGroups = this.sortItemGroups(this.groupItems(this._displayedItems));
    }
    else {
      this._displayedItems = this.sortItems(this._displayedItems);
    }
  }

  ionViewWillEnter() {
    this.checkListSize();
    this.fetchResults().subscribe();
  }

  ionViewDidEnter() {
    this.content.scrollTo(0, this.scrollLocation, 0);
  }

  ionViewWillLeave() {
    this.scrollLocation = this.content.getScrollElement().scrollTop;
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

  public get totalDisplayedItemCount(): number {
    return this.isGrouped ? _.reduce<T[], number>(this._displayedItemGroups, (accumulator: number, list: T[]) => {
      accumulator += _.size(list);
      return accumulator;
    }, 0) : _.size(this._displayedItems);
  }

  public isItemActive(item: T): boolean {
    return !!item;
  }

  public onRefresh(refresher) {
    this.fetchResults({
      forceRequest: true,
      clearCache: true
    })
      .finally(() => refresher.complete())
      .subscribe();
  }
}

export namespace StaticListPage {
  export type FetchOptions = _FetchOptions;
  export const FetchOptions = _FetchOptions;
}
