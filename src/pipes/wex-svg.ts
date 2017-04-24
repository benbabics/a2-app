import * as _ from "lodash";
import { Injectable, Pipe } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({
  name: "wexSvg"
})
@Injectable()
export class WexSvgPipe {

  private static readonly DOCTYPE_REGEX = /<!DOCTYPE([^>]*\[[^\]]*]|[^>]*)>/g;

  constructor(private sanitizer: DomSanitizer) { }

  public transform(value: any) {
    value = String(value);

    return this.sanitizer.bypassSecurityTrustHtml(_.replace(value, WexSvgPipe.DOCTYPE_REGEX, ""));
  }
}
