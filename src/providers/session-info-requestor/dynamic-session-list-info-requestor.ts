import * as _ from "lodash";
import { Observable, BehaviorSubject } from "rxjs";
import {
  DynamicList,
  Session
} from "../../models";
import {
  ListResponse,
  Model
} from "@angular-wex/models";
import { SessionInfoRequestorDetails, SessionInfoOptions } from "./session-info-requestor";
import { Value } from "../../decorators/value";

export abstract class DynamicSessionListInfoRequestor<T extends Model<DetailsT>, DetailsT> implements SessionInfoRequestorDetails {

  @Value("INFINITE_LIST")
  private readonly INFINITE_LIST: any;

  private dynamicList$ = new BehaviorSubject<DynamicList<T, DetailsT>>(DynamicList.create(this.class$));

  protected abstract search$(session: Session, params: any): Observable<ListResponse<T>>;

  /**
   * @param class$ The model class.
   * @param listMergeId The field to use for merging list results.
   * @param requiredFields Any required fields needed to do the request.
   */
  constructor(private class$: new(details: DetailsT) => T, private listMergeId: keyof DetailsT, public requiredFields?: Session.Field[]) { }

  private mergeList(object: T[], source: T[], uniqueId?: keyof DetailsT): T[] {
    if (_.isNil(object)) {
      return _.clone(source);
    }

    _.forEach(source, (value, index) => {
      let searchKey,
        existingValue;

      if (uniqueId) {
        searchKey = { details: {} };
        searchKey.details[uniqueId] = value.details[uniqueId];
      }

      existingValue = _.find(object, searchKey);

      if (existingValue) {
        object[index] = value;
      }
      else {
        object.push(value);
      }
    });

    return object;
  }

  public requestor(session: Session, params: SessionInfoOptions<any>): Observable<DynamicList<T, DetailsT>> {
    let searchParams: any = Object.assign({}, params.requestParams);
    let newSearch: boolean = params.clearCache;

    if (newSearch) {
      // Create a new dynamic list
      this.dynamicList$.next(DynamicList.create(this.class$));
    }

    return this.dynamicList$.asObservable().take(1).flatMap((dynamicList: DynamicList<T, DetailsT>) => {
      // If continuing a previous search, use the existing properties from the dynamic list
      if (!newSearch) {
        searchParams.toDate = dynamicList.requestDate;
        searchParams.pageNumber = dynamicList.details.currentPage;
      }

      // Assign defaults to any values that weren't provided
      searchParams.toDate = searchParams.toDate || new Date();
      searchParams.pageNumber = searchParams.pageNumber || 0;
      searchParams.pageSize = searchParams.pageSize || this.INFINITE_LIST.DEFAULT_PAGE_SIZE;

      return this.search$(session, searchParams)
        .map((response: ListResponse<T>) => {
          // If an initial request date hasn't been recorded yet, create a new one
          if (!dynamicList.requestDate) {
            dynamicList.requestDate = searchParams.toDate;
          }

          //Adjust the total result count and page
          dynamicList.details.totalResults = response.totalResultCount;
          ++dynamicList.details.currentPage;

          //Merge the new results with the existing results
          dynamicList.items = this.mergeList(dynamicList.items, response.values, this.listMergeId);

          return dynamicList;
        });
      });
  }
}
