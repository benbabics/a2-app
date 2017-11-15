import { Injector, ViewChild } from "@angular/core";
import * as _ from "lodash";
import { ListPage, GroupedList } from "./list-page";
import { Model } from "@angular-wex/models";
import { Session } from "../models";

export { GroupedList } from "./list-page";
import { WexGreeking } from "../components";
import { Content } from "ionic-angular";
import { PageDetails, PageParams } from "./page";
import { Subject, Observable, BehaviorSubject } from "rxjs";
import { StateEmitter, EventSource } from "angular-rxjs-extensions";
import { ViewWillEnter, ViewWillLeave, ViewDidEnter } from "angular-rxjs-extensions-ionic";

type milliseconds = number;

export namespace StaticListPage {

  export interface Params<DetailsT> extends PageParams {
    // The session field to display in the list
    listDataField: Session.Field;
    // Set this to specify the order that groups should appear in grouped list mode
    listGroupDisplayOrder?: string[];
    // Set this to add header dividers and enable grouped list mode
    dividerLabels?: string[];
    // The fields to filter on when the user is searching
    searchFilterFields?: (keyof DetailsT)[];
  }
}

export abstract class StaticListPage<T extends Model<DetailsT>, DetailsT> extends ListPage {

  // The threshold size that a list is considered large enough to automatically enable a loading facade
  private static readonly LARGE_LIST_SIZE = 75;
  private static readonly LARGE_LIST_FACADE_DURATION: milliseconds = 100;

  @ViewChild(Content) public content: Content;

  @ViewWillEnter() protected onViewWillEnter$: Observable<void>;
  @ViewWillLeave() protected onViewWillLeave$: Observable<void>;
  @ViewDidEnter() protected onViewDidEnter$: Observable<void>;
  @EventSource() protected onRefresh$: Observable<any>;
  @EventSource() protected onItemSelected$: Observable<T>;

  @StateEmitter() private fetchingItems$: Subject<boolean>;
  @StateEmitter({ initialValue: [] }) private items$: Subject<T[]>;
  @StateEmitter() private itemLists$: Subject<T[][]>;
  @StateEmitter({ initialValue: 0 }) private scrollLocation$: Subject<number>;
  @StateEmitter({ initialValue: "" }) private searchFilter$: Subject<string>;
  //Enables a loading facade. This forces the greeking state of the list to be shown instead of the actual items.
  @StateEmitter() private loadingFacade$: Subject<boolean>;
  // Search field label
  @StateEmitter.Alias("CONSTANTS.searchLabel")
  public /** @template */ searchLabel$: Observable<string>;
  // The greeking data displayed for each element
  @StateEmitter.Alias("CONSTANTS.greekingData")
  public /** @template */ greekingData$: Observable<WexGreeking.Rect[]>;
  // The number of default elements to display
  @StateEmitter.Alias("CONSTANTS.greekedElementCount")
  public /** @template */ greekedElementCount$: Observable<number>;

  protected params: StaticListPage.Params<DetailsT>;

  private displayedItems$: Observable<T[]>;
  private isGrouped$: Observable<boolean>;
  private totalDisplayedItemCount$ = new BehaviorSubject<number>(0);

  protected abstract sortItems(items: T[]): T[];

  constructor(
    params: StaticListPage.Params<DetailsT> & PageDetails,
    public injector: Injector,
    requiredSessionInfo?: Session.Field[]
  ) {
    super(params, injector, requiredSessionInfo);

    this.isGrouped$ = Observable.of(!!params.dividerLabels).shareReplay(1);

    this.displayedItems$ = Observable.combineLatest(this.sessionCache.getField$<T[]>(params.listDataField), this.searchFilter$)
      .map((args) => {
        let [items, searchFilter] = args;
        return this.filterItems(items, searchFilter);
      });

    // Update the results when the session data changes
    this.isGrouped$
      .filter(grouped => grouped)
      .flatMap(() => this.displayedItems$)
      .map(items => this.sortItemGroups(this.groupItems(items)))
      .map(groupedList => params.listGroupDisplayOrder.reduce<T[][]>((sortedList: T[][], group: string) => {
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

    this.sessionCache.onFieldUpdating$(params.listDataField)
      .map(() => this.clearList())
      .subscribe(() => this.fetchingItems$.next(true));

    this.sessionCache.onFieldUpdated$(params.listDataField)
      .subscribe(() => this.fetchingItems$.next(false));

    this.onViewWillEnter$.subscribe(() => this.checkListSize());

    this.onViewDidEnter$
      .flatMap(() => this.scrollLocation$.asObservable().take(1))
      .subscribe(scrollLocation => this.content.scrollTo(0, scrollLocation, 0));

    this.onViewWillLeave$.subscribe(() => this.scrollLocation$.next(this.content.getScrollElement().scrollTop));

    this.onRefresh$.flatMap((refresher) => {
      return this.sessionCache.update$(params.listDataField, { clearCache: true }).finally(() => refresher.complete());
    }).subscribe();
  }

  public static defaultItemSort<T extends Model<DetailsT>, DetailsT>(items: T[], sortBy: keyof DetailsT, order: "asc" | "desc" = "asc"): T[] {
    return ListPage.sortListByDetails<T, DetailsT>(items, sortBy, order);
  }

  public static defaultItemGroup<T extends Model<DetailsT>, DetailsT>(items: T[], groupBy: keyof DetailsT, groups: string[]): GroupedList<T> {
    return ListPage.groupByDetails<T, DetailsT>(items, groupBy, groups);
  }

  protected checkListSize() {
    this.totalDisplayedItemCount$.asObservable().take(1).subscribe((totalDisplayedItemCount) => {
      // If this is a large list, enable a loading facade to defer list rendering until the view has been entered
      if (totalDisplayedItemCount > StaticListPage.LARGE_LIST_SIZE) {
        this.loadingFacade$.next(true);
        window.setTimeout(() => this.loadingFacade$.next(false), StaticListPage.LARGE_LIST_FACADE_DURATION);
      }
    });
  }

  protected clearList() {
    this.items$.next([]);
    this.itemLists$.next([]);
  }

  protected groupItems(items: T[]): GroupedList<T> {
    console.error("StaticListPage.groupItems must be defined when using a grouped list.");
    return { items };
  }

  private createSearchRegex(searchFilter: string) {
    //do a case-insensitive search
    return new RegExp(_.escapeRegExp(searchFilter), "i");
  }

  private filterItems(items: T[], searchFilter: string): T[] {
    if (searchFilter) {
      let searchRegex = this.createSearchRegex(searchFilter);

      return items.filter((item: T) => this.params.searchFilterFields.some((searchField) => {
        return String(item.details[searchField]).search(searchRegex) !== -1;
      }));
    }

    return items;
  }

  private sortItemGroups(groupedItems: GroupedList<T>): GroupedList<T> {
    return _.transform(groupedItems, (sortedGroups: GroupedList<T>, items: T[], group: string) => {
      //sort each grouped list individually
      return sortedGroups[group] = this.sortItems(items);
    }, {});
  }

  public isItemActive(item: T): boolean {
    return !!item;
  }
}
