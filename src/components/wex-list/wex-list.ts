import * as _ from "lodash";
import { Component, Input, TemplateRef, ContentChild, Query } from "@angular/core";
import { Value } from "../../decorators/value";

@Component({
  selector: "wex-list",
  templateUrl: "wex-list.html"
})
export class WexList {

  @Value("COMPONENTS.LIST") CONSTANTS: any;

  @Input() items: any[];
  @Input() loading: boolean;
  @Input() headerFields: string[];

  @ContentChild(TemplateRef) itemTemplate: Query;

  public get hasNoRecords(): boolean {
    return !(this.loading || _.size(this.items) > 0);
  }
}
