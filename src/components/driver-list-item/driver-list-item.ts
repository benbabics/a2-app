import { Component, Input } from "@angular/core";
import { Driver } from "@angular-wex/models";
import { NameUtils } from "../../utils/name-utils";

@Component({
  selector: "driver-list-item",
  templateUrl: "./driver-list-item.html"
}) export class DriverListItem {
  @Input() driver: Driver;

  public getFullName(driver: Driver): string {
    return NameUtils.PrintableName(driver.details.lastName, driver.details.firstName);
  }
}