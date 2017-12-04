import { Component, Input } from "@angular/core";
import * as _ from "lodash";

@Component({
  selector: "resizable-svg",
  template: `
  <div *ngIf="imageReady" style="width: 100%; height: 100%" [ngStyle]="{ 'background' : imageDataUrl }"></div>
  <div style="text-align: right;" [actionIndicator]="!imageReady"></div>
`
}) export class ResizableSvg {
  @Input() imageData: any;

  public get imageDataUrl(): string {
    return `url('data:image/svg+xml;utf8,${encodeURI(this.imageData)}') no-repeat right`;
  }

  public get imageReady(): boolean {
    return !_.isNil(this.imageData);
  }
}
