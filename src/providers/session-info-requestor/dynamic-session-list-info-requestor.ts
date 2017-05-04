import * as _ from "lodash";
import * as moment from "moment";
import { Observable } from "rxjs";
import {
  ListResponse,
  DynamicList,
  Model,
  ModelT,
  Session
} from "../../models";
import { SessionInfoRequestorDetails } from "./session-info-requestor";

export abstract class DynamicSessionListInfoRequestor<T extends Model<DetailsT>, DetailsT> implements SessionInfoRequestorDetails {

  // The field to use for merging list results
  protected abstract listMergeId: keyof DetailsT;

  public readonly requestor = (session: Session, params: object) => this.request(session, params);

  constructor(private $class: ModelT<T, DetailsT>, public requiredFields?: Session.Field[]) { }

  protected abstract get dynamicList(): DynamicList<T, DetailsT>;

  protected abstract set dynamicList(dynamicList: DynamicList<T, DetailsT>);

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

  protected request(session: Session, params: any): Observable<DynamicList<T, DetailsT>> {
    let searchParams: any = {};
    let requestDate = _.get<Date>(this.dynamicList, "requestDate", new Date());
    let currentPage = _.get<number>(this.dynamicList, "details.currentPage", 0);

    // Default search parameters (may be overriden by input params)
    searchParams.fromDate = moment(requestDate).subtract(1, "y").toDate(); //TODO externalize duration
    searchParams.toDate = requestDate;
    searchParams.pageNumber = currentPage;
    searchParams.pageSize = 100; //TODO externalize

    // Merge default params with input params
    params = _.merge(searchParams, params);

    // Execute the search request
    return this.search(session, params)
      .map((response: ListResponse<T>): DynamicList<T, DetailsT> => {
        // If the dynamic list doesn't exist in the cache yet, initialize it
        if (!this.dynamicList) {
          this.dynamicList = DynamicList.create(this.$class);
        }

        // If an initial request date hasn't been recorded yet, create a new one
        if (!this.dynamicList.requestDate) {
          this.dynamicList.requestDate = requestDate;
        }

        //Adjust the total result count and page
        this.dynamicList.details.totalResults = response.totalResultCount;
        ++this.dynamicList.details.currentPage;

        //Merge the new results with the existing results
        this.dynamicList.items = this.mergeList(this.dynamicList.items, response.values, this.listMergeId);

        return this.dynamicList;
      });
  }
}
