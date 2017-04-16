import { Injectable } from "@angular/core";
import { WexBanner } from "../wex-banner/wex-banner";

@Injectable()
export class WexAppBannerController {

  public text: string;
  public bannerStyle: WexBanner.Style;

  public get hasContent(): boolean {
    return !!this.text;
  }

  public clear() {
    this.text = "";
    this.bannerStyle = null;
  }

  public error(text: string) {
    this.text = text;
    this.bannerStyle = WexBanner.Style.Error;
  }

  public success(text: string) {
    this.text = text;
    this.bannerStyle = WexBanner.Style.Success;
  }

  public warning(text: string) {
    this.text = text;
    this.bannerStyle = WexBanner.Style.Warning;
  }
}
