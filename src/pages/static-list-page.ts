import { Injector, ViewChild } from "@angular/core";
import * as _ from "lodash";
import { ListPage, GroupedList } from "./list-page";
import { Model } from "@angular-wex/models";
import { Session } from "../models";

export { GroupedList } from "./list-page";
import { WexGreeking } from "../components";
import { Content } from "ionic-angular";
import { PageDetails } from "./page";
import { Subject, Observable, BehaviorSubject } from "rxjs";
import { StateEmitter } from "angular-rxjs-extensions";

type milliseconds = number;

export abstract class StaticListPage<T extends Model<DetailsT>, DetailsT> extends ListPage {

  // The threshold size that a list is considered large enough to automatically enable a loading facade
  private static readonly LARGE_LIST_SIZE = 75;
  private static readonly LARGE_LIST_FACADE_DURATION: milliseconds = 100;

  @ViewChild(Content) public content: Content;

  @StateEmitter() private fetchingItems$: Subject<boolean>;
  @StateEmitter({ initialValue: [] }) private items$: Subject<T[]>;
  @StateEmitter() private itemLists$: Subject<T[][]>;

  private displayedItems$: Observable<T[]>;
  private isGrouped$: Observable<boolean>;
  private totalDisplayedItemCount$ = new BehaviorSubject<number>(0);

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

  constructor(
    pageDetails: PageDetails,
    protected listDataField: Session.Field,
    public injector: Injector,
    protected searchFilterFields?: (keyof DetailsT)[],
    requiredSessionInfo?: Session.Field[]
  ) {
    super(pageDetails, injector, requiredSessionInfo);

    this.isGrouped$ = Observable.of(!!this.dividerLabels).shareReplay(1);

    this.displayedItems$ = this.sessionCache.getField$<T[]>(listDataField)
      .map((items) => {
        this.fetchingItems$.next(false);
        return this.filterItems(items);
      });

    // Update the results when the session data changes
    this.isGrouped$
      .filter(grouped => grouped)
      .flatMap(() => this.displayedItems$)
      .map(items => this.sortItemGroups(this.groupItems(items)))
      .map(groupedList => this.listGroupDisplayOrder.reduce<T[][]>((sortedList: T[][], group: string) => {
        sortedList.push(groupedList[group]);
        return sortedList;
      }, []))
      .subscribe((itemLists) => {
        this.totalDisplayedItemCount$.next(itemLists.reduce((count, list) => count + _.size(list), 0));
        this.itemLists$.next(itemLists);
      });

    this.isGrouped$
      .filter(grouped => !grouped)
      .flatMap(() => this.displayedItems$)
      .map(items => this.sortItems(items))
      .subscribe((items) => {
        this.totalDisplayedItemCount$.next(items.length);
        this.items$.next(items);
      });

    this.sessionCache.onFieldUpdating$(listDataField)
      .map(() => this.clearList())
      .subscribe(() => this.fetchingItems$.next(true));
  }

  public static defaultItemSort<T extends Model<DetailsT>, DetailsT>(items: T[], sortBy: keyof DetailsT, order: "asc" | "desc" = "asc"): T[] {
    return ListPage.sortListByDetails<T, DetailsT>(items, sortBy, order);
  }

  public static defaultItemGroup<T extends Model<DetailsT>, DetailsT>(items: T[], groupBy: keyof DetailsT, groups: string[]): GroupedList<T> {
    return ListPage.groupByDetails<T, DetailsT>(items, groupBy, groups);
  }

  public abstract goToDetailPage(element: T);

  protected abstract sortItems(items: T[]): T[];

  protected get isSearchEnabled(): boolean {
    return !!this.searchFilterFields;
  }

  protected checkListSize() {
    this.totalDisplayedItemCount$.asObservable().take(1).subscribe((totalDisplayedItemCount) => {
      // If this is a large list, enable a loading facade to defer list rendering until the view has been entered
      if (totalDisplayedItemCount > StaticListPage.LARGE_LIST_SIZE) {
        this.loadingFacade = true;
        window.setTimeout(() => this.loadingFacade = false, StaticListPage.LARGE_LIST_FACADE_DURATION);
      }
    });
  }

  protected clearList() {
    this.items$.next([]);
    this.itemLists$.next([]);
  }

  protected createSearchRegex(searchFilter: string) {
    //do a case-insensitive search
    return new RegExp(_.escapeRegExp(searchFilter), "i");
  }

  protected filterItems(items: T[]): T[] {
    if (this.isSearchEnabled) {
      let searchRegex = this.createSearchRegex(this.searchFilter);

      return items.filter((item: T) => this.searchFilterFields.some((searchField) => {
        return String(item.details[searchField]).search(searchRegex) !== -1;
      }));
    }

    return items;
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

  ionViewWillEnter() {
    this.checkListSize();
  }

  ionViewDidEnter() {
    this.content.scrollTo(0, this.scrollLocation, 0);
  }

  ionViewWillLeave() {
    this.scrollLocation = this.content.getScrollElement().scrollTop;
  }

  public isItemActive(item: T): boolean {
    return !!item;
  }

  public onRefresh(refresher) {
    this.sessionCache.update$(this.listDataField, { clearCache: true })
      .finally(() => refresher.complete())
      .subscribe();
  }
}
