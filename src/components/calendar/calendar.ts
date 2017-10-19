import { Component, Input, Output, ViewChild, EventEmitter } from "@angular/core";
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
  #mbscCalendar="mobiscroll">
`
}) export class Calendar {
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

  public displayCalendar() {
    if (this.mbscCalendar) {
      this.options.min = this.minDate;
      this.options.max = this.maxDate;
      this.mbscCalendar.option(this.options);
    }

    this.mbscCalendar.show();
  }
}
