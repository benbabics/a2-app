import { WexAppBannerController } from "../wex-app-banner-controller/wex-app-banner-controller";
import { WexBanner } from "../wex-banner/wex-banner";
import { Component } from "@angular/core";

@Component({
  selector: "wex-app-banner",
  templateUrl: "../wex-banner/wex-banner.html"
})
export class WexAppBanner extends WexBanner {

  constructor(private wexAppBannerController: WexAppBannerController) {
    super();
  }

  public get text(): string {
    return this.wexAppBannerController.text;
  }

  public get bannerStyle(): WexBanner.Style {
    return this.wexAppBannerController.bannerStyle;
  }
}
