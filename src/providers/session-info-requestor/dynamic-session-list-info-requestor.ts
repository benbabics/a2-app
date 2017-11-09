import * as _ from "lodash";
import * as moment from "moment";
import { Observable } from "rxjs";
import {
  DynamicList,
  Session
} from "../../models";
import {
  ListResponse,
  Model
} from "@angular-wex/models";
import { SessionInfoRequestorDetails } from "./session-info-requestor";
import { Value } from "../../decorators/value";

export abstract class DynamicSessionListInfoRequestor<T extends Model<DetailsT>, DetailsT> implements SessionInfoRequestorDetails {

  @Value("INFINITE_LIST")
  private readonly INFINITE_LIST: any;

  // The field to use for merging list results
  protected abstract listMergeId: keyof DetailsT;

  public readonly requestor = (session: Session, params: object) => this.request(session, params);

  constructor(public requiredFields?: Session.Field[]) { }

  protected abstract get dynamicList$(): Observable<DynamicList<T, DetailsT>>;

  protected abstract search(session: Session, params: any): Observable<ListResponse<T>>;

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

  public request(session: Session, params: any): Observable<DynamicList<T, DetailsT>> {
    return this.dynamicList$.take(1).flatMap((dynamicList: DynamicList<T, DetailsT>) => {
      let searchParams: any = {};
      let requestDate = _.get<Date>(dynamicList, "requestDate", new Date());
      let currentPage = _.get<number>(dynamicList, "details.currentPage", 0);

      // Default search parameters (may be overriden by input params)
      searchParams.fromDate = (<any>moment)(requestDate) //TODO: Remove <any>moment cast when the .d.ts is fixed
        .subtract(...this.INFINITE_LIST.DEFAULT_SEARCH_PERIOD)
        .toDate();
      searchParams.toDate = requestDate;
      searchParams.pageNumber = currentPage;
      searchParams.pageSize = this.INFINITE_LIST.DEFAULT_PAGE_SIZE;

      // Merge default params with input params
      params = _.merge(searchParams, params);
      return this.search(session, params)
        .map((response: ListResponse<T>) => {
          // If the dynamic list doesn't exist in the cache yet, initialize it
          /*if (!this.dynamicList) {
            this.dynamicList = DynamicList.create(this.$class);
          }*/

          // If an initial request date hasn't been recorded yet, create a new one
          if (!dynamicList.requestDate) {
            dynamicList.requestDate = requestDate;
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
