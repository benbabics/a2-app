import { Component, Input } from "@angular/core";

type WexBannerStyle = keyof {
  Success,
  Error,
  Warning
};

@Component({
  selector: "wex-banner",
  templateUrl: "wex-banner.html"
})
export class WexBanner {

  @Input() text: string;
  @Input() bannerStyle: WexBannerStyle;

  public get icon(): string[] {
    switch(this.bannerStyle) {
      case WexBanner.Style.Success:
        return ["fa", "fa-check"];
      case WexBanner.Style.Warning:
        return ["fa", "fa-exclamation-triangle"];
      case WexBanner.Style.Error:
        return ["fa", "fa-times"];
      default:
        return null;
    }
  }
}

export namespace WexBanner {
  export type Style = WexBannerStyle;

  export namespace Style {
    export const Success: Style = "Success";
    export const Error: Style = "Error";
    export const Warning: Style = "Warning";
  }
}
