import { Component, Input } from "@angular/core";

interface _Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

@Component({
  selector: "[wexGreeking]",
  templateUrl: "wex-greeking.html"
})
export class WexGreeking {

  @Input("wexGreeking") rects: WexGreeking.Rect[];

  public calculateStyle(rect: WexGreeking.Rect): any {
    return {
      "left.%": rect.left,
      "top.%": rect.top,
      "right.%": 100 - rect.right,
      "bottom.%": 100 - rect.bottom
    };
  }
}

export namespace WexGreeking {
  export type Rect = _Rect;
}
