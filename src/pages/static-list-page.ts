import { Injector, ViewChild, forwardRef } from "@angular/core";
import * as _ from "lodash";
import { ListPage, GroupedList } from "./list-page";
import { Model } from "@angular-wex/models";
import { Session } from "../models";
import { WexGreeking, WexStaticListPageHeader } from "../components";
import { Content } from "ionic-angular";
import { PageDetails, PageParams } from "./page";
import { Subject, Observable, BehaviorSubject } from "rxjs";
import { StateEmitter, EventSource } from "angular-rxjs-extensions";
import { ViewWillEnter, ViewWillLeave, ViewDidEnter } from "angular-rxjs-extensions-ionic";
import { WexPlatform } from "../providers";
import { Searchbar } from "ionic-angular/components/searchbar/searchbar";

export { GroupedList } from "./list-page";

export type SessionListData<T> = GroupedList<T>;

export namespace StaticListPage {

  export interface Params<DetailsT> extends PageParams {
    // The session field(s) to display in the list
    listData: Session.Field | Session.Field[];
    listDataRequestParams?: any;
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
  private static readonly LARGE_LIST_FACADE_DURATION_MS: number = 100;

  public readonly params: StaticListPage.Params<DetailsT>;

  @ViewChild(Content) private content: Content;
  @StateEmitter(ViewChild(forwardRef(() => WexStaticListPageHeader))) private header$: Subject<WexStaticListPageHeader>;

  @ViewWillEnter() protected onViewWillEnter$: Observable<void>;
  @ViewWillLeave() protected onViewWillLeave$: Observable<void>;
  @ViewDidEnter() protected onViewDidEnter$: Observable<void>;
  @EventSource() protected onRefresh$: Observable<any>;
  @EventSource() protected onItemSelected$: Observable<T>;
  @EventSource() protected onShowSearch$: Observable<void>;
  @EventSource() protected onHideSearch$: Observable<void>;
  @EventSource() protected onSearchBlur$: Observable<void>;

  @StateEmitter() private fetchingItems$: Subject<boolean>;
  @StateEmitter({ initialValue: [] }) private items$: Subject<T[]>;
  @StateEmitter({ initialValue: [] }) private itemLists$: Subject<T[][]>;
  @StateEmitter({ initialValue: 0 }) private scrollLocation$: Subject<number>;
  @StateEmitter({ initialValue: "" }) private searchFilter$: Subject<string>;
  @StateEmitter() private searchHidden$: Subject<boolean>;
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

  private totalDisplayedItemCount$ = new BehaviorSubject<number>(0);

  protected fetchedItems$: Observable<T[][]>;
  protected displayedItems$: Observable<T[]>;
  protected isGrouped$: Observable<boolean>;

  protected abstract sortItems(items: T[]): T[];

  constructor(
    params: StaticListPage.Params<DetailsT> & PageDetails,
    injector: Injector,
    requiredSessionInfo?: Session.Field[]
  ) {
    super(params, injector, requiredSessionInfo);

    const platform: WexPlatform = injector.get(WexPlatform);
    const listDataFields = params.listData instanceof Array ? params.listData : [params.listData];

    // Hide search by default if on Android
    this.searchHidden$.next(platform.isAndroid);

    this.isGrouped$ = Observable.of(!!params.dividerLabels).shareReplay(1);

    this.fetchedItems$ = Observable.combineLatest(...listDataFields.map(field => this.sessionCache.getField$<T[]>(field).filter(Boolean)));

    this.displayedItems$ = this.fetchedItems$
      .map((lists: T[][]) => lists.reduce<SessionListData<T>>((listData, fieldList, fieldName) => {
        return Object.assign(listData, { [fieldName]: fieldList });
      }, {}))
      .map(listData => this.mergeLists(listData))
      .combineLatest(this.searchFilter$)
      .map((args) => {
        let [items, searchFilter] = args;
        return this.filterItems(items, searchFilter);
      });

    // Update the results when the session data changes
    this.isGrouped$
      .filter(grouped => grouped)
      .flatMapTo(this.displayedItems$)
      .map(items => this.sortItemGroups(this.groupItems(items)))
      .map(groupedList => params.listGroupDisplayOrder.reduce<T[][]>((sortedList: T[][], group: string) => {
        sortedList.push(groupedList[group]);
        return sortedList;
      }, []))
      .subscribe((itemLists: T[][]) => {
        this.totalDisplayedItemCount$.next(itemLists.reduce((count, list) => count + _.size(list), 0));
        this.itemLists$.next(itemLists);
      });

    this.isGrouped$
      .filter(grouped => !grouped)
      .flatMapTo(this.displayedItems$)
      .map(items => this.sortItems(items))
      .subscribe((items) => {
        this.totalDisplayedItemCount$.next(items.length);
        this.items$.next(items);
      });

    this.searchHidden$.asObservable()
      .filter(Boolean)
      .subscribe(() => this.searchFilter$.next(""));

    this.sessionCache.onAnyFieldsUpdating$(listDataFields)
      .flatMap((updatingField: Session.Field) => {
        this.clearList();
        this.fetchingItems$.next(true);

        return this.sessionCache.onFieldUpdated$(updatingField).take(1);
      })
      .flatMap(() => this.sessionCache.onAllFieldsUpdated$(listDataFields).take(1))
      .subscribe(() => this.fetchingItems$.next(false));

    this.onViewWillEnter$.subscribe(() => this.checkListSize());

    this.onViewDidEnter$
      .flatMap(() => this.scrollLocation$.asObservable().take(1))
      .subscribe(scrollLocation => this.content.scrollTo(0, scrollLocation, 0));

    this.onViewWillLeave$.subscribe(() => this.scrollLocation$.next(this.content.getScrollElement().scrollTop));

    this.onRefresh$.flatMap((refresher) => {
      return this.sessionCache.updateSome$(listDataFields, {
        clearCache: true,
        requestParams: params.listDataRequestParams
      }).finally(() => refresher.complete());
    }).subscribe();

    this.header$.asObservable()
      .filter(header => !!header)
      .subscribe(header =>
        header.keyboardEvent$.asObservable()
          .filter(event => !!event)
          .filter(event => event.keyCode === header.RETURN_KEYCODE)
          .flatMapTo(header.searchbar$)
          .filter(searchbar => !!searchbar)
          .flatMap(searchbar => Observable.of(searchbar).take(1))
          .subscribe(searchbar => searchbar._searchbarInput.nativeElement.blur()));

    this.onShowSearch$
      .map(() => this.searchHidden$.next(false))
      .delay(500)
      .flatMapTo(this.header$)
      .flatMap((header: WexStaticListPageHeader) => header.searchbar$)
      .subscribe((searchbar: Searchbar) => searchbar.setFocus());

    this.onHideSearch$
      .subscribe(() => this.searchHidden$.next(true));

    if (platform.isAndroid) {
      this.onSearchBlur$
        .flatMap(() => this.searchFilter$.asObservable().take(1))
        .filter(searchFilter => !searchFilter)
        .subscribe(() => this.searchHidden$.next(true));
    }
  }

  public static defaultItemSort<T extends Model<DetailsT>, DetailsT>(items: T[], sortBy: keyof DetailsT, order: "asc" | "desc" = "asc"): T[] {
    return ListPage.sortListByDetails<T, DetailsT>(items, sortBy, order);
  }

  public static defaultItemGroup<T extends Model<DetailsT>, DetailsT>(items: T[], groupBy: keyof DetailsT, groups: string[]): GroupedList<T> {
    return ListPage.groupByDetails<T, DetailsT>(items, groupBy, groups);
  }

  protected clearList() {
    this.items$.next([]);
    this.itemLists$.next([]);
  }

  protected groupItems(items: T[]): GroupedList<T> {
    console.error("StaticListPage.groupItems must be defined when using a grouped list.");
    return { items };
  }

  protected mergeLists(listData: SessionListData<T>): T[] {
    return _.reduce(listData, (mergedList: T[], fieldList: T[]) => mergedList.concat(fieldList), []);
  }

  private checkListSize() {
    this.totalDisplayedItemCount$.asObservable().take(1).subscribe((totalDisplayedItemCount) => {
      // If this is a large list, enable a loading facade to defer list rendering until the view has been entered
      if (totalDisplayedItemCount > StaticListPage.LARGE_LIST_SIZE) {
        this.loadingFacade$.next(true);
        window.setTimeout(() => this.loadingFacade$.next(false), StaticListPage.LARGE_LIST_FACADE_DURATION_MS);
      }
    });
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
