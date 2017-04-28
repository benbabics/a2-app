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

  //Items can either be a flat list of items, or a list containing lists of items grouped by dividers
  @Input() items: any[];
  @Input() itemLists: any[][];
  //Dividers must be specified if using a list of item lists
  @Input() dividers: string[];
  //The loading state of the list
  @Input() loading: boolean;
  //The headers to show for the list
  @Input() headerFields?: string[];
  //The greeking data displayed for each element.
  @Input() greekingData?: WexGreeking.Rect[];
  //The number of default elements to display. Default: DEFAULT_NUM_GREEKED_ELEMENTS
  @Input() greekedElementCount?: number;

  @ContentChild(TemplateRef) itemTemplate: Query;

  public get greekedElements(): undefined[] {
    return new Array(this.greekedElementCount || WexList.DEFAULT_NUM_GREEKED_ELEMENTS);
  }

  public get hasNoItems(): boolean {
    const hasNoItems = (itemList: any[]) => !(this.loading || _.size(itemList) > 0);

    if (this.isGrouped) {
      return this.itemLists.every(hasNoItems);
    }
    else {
      return hasNoItems(this.items);
    }
  }

  public get isGreekingVisible(): boolean {
    return this.loading && !!this.greekingData;
  }

  public get isGrouped(): boolean {
    return !!this.dividers;
  }

  public getListForDivider(dividerIndex: number): any[] {
    if(this.isGrouped && _.isNumber(dividerIndex) && dividerIndex < this.itemLists.length) {
      return this.itemLists[dividerIndex];
    }
    else {
      return null;
    }
  }
}
