import { Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";
import { WexPlatform } from "../../providers";


@Directive({
  selector: "[wexIfPlatform]"
})
export class WexIfPlatformDirective {

  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private platform: WexPlatform
  ) { }

  @Input() public set wexIfPlatform(platform: string) {
    if (this.platform.isOs(platform) && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    }
    else if (!this.platform.isOs(platform) && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
