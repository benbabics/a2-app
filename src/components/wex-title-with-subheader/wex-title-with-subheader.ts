import { Component, Input, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "wex-title-with-subheader",
  templateUrl: "wex-title-with-subheader.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WexTitleWithSubheader {
  @Input("title") title: string;
  @Input("subheader") subheader: string;
}
