import { WexIfPlatformDirective } from "../wex-if-platform/wex-if-platform";
import { Directive, TemplateRef, ViewContainerRef, OnInit } from "@angular/core";
import { WexPlatform } from "../../providers";
import { Value } from "../../decorators/value";

@Directive({
  selector: "[wexIfPlatformAndroid]"
})
export class WexIfPlatformAndroidDirective extends WexIfPlatformDirective implements OnInit {

  @Value("PLATFORM")
  private static readonly PLATFORM: any;

  constructor(
    templateRef: TemplateRef<any>,
    viewContainer: ViewContainerRef,
    platform: WexPlatform
  ) {
    super(templateRef, viewContainer, platform);
  }

  ngOnInit() {
    this.wexIfPlatform = WexIfPlatformAndroidDirective.PLATFORM.ANDROID;
  }
}
