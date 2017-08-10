import * as moment from "moment";
import { Model } from "@angular-wex/models";

export interface DynamicListDetails<DetailsT> {
  currentPage: number;
  totalResults: number;
  requestDate: string;
  items: DetailsT[];
}

export type ModelT<T extends Model<DetailsT>, DetailsT> = { new(details: DetailsT): T };

export class DynamicList<T extends Model<DetailsT>, DetailsT> extends Model<DynamicListDetails<DetailsT>> {

  private constructor(private $class: ModelT<T, DetailsT>) {
    super();

    this.clear();
  }

  public static create<T extends Model<DetailsT>, DetailsT>($class: ModelT<T, DetailsT>): DynamicList<T, DetailsT> {
    return new DynamicList<T, DetailsT>($class);
  }

  public get requestDate(): Date {
    return this.details.requestDate ? moment(this.details.requestDate).toDate() : null;
  }

  public set requestDate(requestDate: Date) {
    this.details.requestDate = moment(requestDate).toISOString();
  }

  public get items(): T[] {
    return this.details.items ? this.details.items.map(value => new this.$class(value)) : null;
  }

  public set items(items: T[]) {
    this.details.items = items.map(item => item.details);
  }

  public clear() {
    this.details.items = undefined;
    this.details.currentPage = 0;
    this.details.totalResults = 0;
  }
}

export namespace DynamicList {
    export type Details<DetailsT> = DynamicListDetails<DetailsT>;
    export type Field<DetailsT> = keyof Details<DetailsT>;
}
