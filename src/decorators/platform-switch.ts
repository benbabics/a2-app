import * as _ from "lodash";
import { Constants } from "../app/app.constants";

export function PlatformSwitch(platformValues: any): Function {
  return (target: any, propertyKey: string) => {
    //set the value of the property to the value of the specified constant
    target[propertyKey] = _.get(platformValues, Constants.PLATFORM);
  };
}
