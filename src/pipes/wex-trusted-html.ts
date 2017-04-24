import { Injectable, Pipe} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({
  name: "wexTrustedHtml"
})
@Injectable()
export class WexTrustedHtmlPipe {

  constructor(private sanitizer: DomSanitizer) { }

  public transform(value: any) {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
