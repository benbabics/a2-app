import * as _ from "lodash";
import { Component, Input, TemplateRef, ContentChild, Query } from "@angular/core";
import { Value } from "../../decorators/value";
import { WexGreeking } from "../index";

interface ItemListGroup {
  heading: string;
  items: any[];
}

@Component({
  selector: "wex-list",
  templateUrl: "wex-list.html"
})
export class WexList {

  private static readonly DEFAULT_NUM_GREEKED_ELEMENTS = 25;

  @Value("COMPONENTS.LIST") CONSTANTS: any;

  @Input() items: any[];
  @Input() dividers: string[];
  @Input() loading: boolean;
  @Input() headerFields: string[];
  @Input() greekingData: WexGreeking.Rect[];
  @Input() greekedElementCount: number;

  @ContentChild(TemplateRef) itemTemplate: Query;

  public get greekedElements(): undefined[] {
    return new Array(this.greekedElementCount || WexList.DEFAULT_NUM_GREEKED_ELEMENTS);
  }

  public get hasNoItems(): boolean {
    const hasNoItems = (itemList: any[]) => !(this.loading || _.size(itemList) > 0);

    if (_.size(this.dividers) > 0) {
      return !this.items || this.items.every(hasNoItems);
    }
    else {
      return hasNoItems(this.items);
    }
  }

  public get isGreekingVisible(): boolean {
    return this.loading && !!this.greekingData;
  }

  public getListForDivider(dividerIndex: number): any[] {
    if(_.isNumber(dividerIndex) && dividerIndex < this.items.length) {
      return this.items[dividerIndex];
    }
    else {
      return null;
    }
  }
}
