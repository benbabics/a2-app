import { Component, Input, Output, ViewChild, EventEmitter, OnChanges } from "@angular/core";
import { MbscCalendarOptions } from "mbsc-calendar";
import { WexPlatform } from "../../providers/platform";

export type CalendarTheme = keyof {
  material,
  ios
};

export namespace CalendarTheme {
  export const Ios: CalendarTheme = "ios";
  export const Material: CalendarTheme = "material";
}

@Component({
  selector: "calendar",
  template: `
  <input [(ngModel)]="date"
  (ngModelChange)="dateChange.next(this.date)"
  type="date"
  mbsc-calendar
  style="visibility:hidden"
  #mbscCalendar="mobiscroll"
  [mbsc-options]="options">
`
}) export class Calendar implements OnChanges {
  @Output() dateChange: EventEmitter<Date> = new EventEmitter<Date>();
  @Input() public date: Date;
  @Input() public minDate?: Date;
  @Input() public maxDate?: Date;

  @ViewChild("mbscCalendar") public ref;
  private get mbscCalendar() {
    return this.ref.instance;
  }

  public options: MbscCalendarOptions;

  public constructor(platform: WexPlatform) {
    let theme, display;
    if (platform.isIos) {
      theme = CalendarTheme.Ios;
      display = "bottom";
    } else {
      theme = CalendarTheme.Material;
      display = "center";
    }

    this.options = { theme, display };
  }

  public ngOnChanges() {
    this.options.min = this.minDate;
    this.options.max = this.maxDate;
    if (this.mbscCalendar) {
      this.mbscCalendar.option(this.options);
    }
  }

  public displayCalendar() {
    this.mbscCalendar.show();
  }
}