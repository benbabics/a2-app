import * as _ from "lodash";
import { Component, Input } from "@angular/core";
import { Model } from "../../models";

type DetailsPropertyDictionary<T> = { [propertyName: string]: T };
type PipeLike = { transform: (...params: any[]) => any };

export type ModelDetailsFieldNameMap = DetailsPropertyDictionary<string>;
export type ModelDetailsFieldOverrideMap = DetailsPropertyDictionary<string>;
export type ModelDetailsFieldPipeList = DetailsPropertyDictionary<PipeLike[]>;

@Component({
  selector: "wex-details-view",
  templateUrl: "wex-details-view.html"
})
export class WexDetailsView {

  private static readonly VALUE_PLACEHOLDER = "--";

  @Input() model: Model<any>;
  @Input() includedFields: string[];
  @Input() mappedFieldNames: ModelDetailsFieldNameMap;
  @Input() fieldOverrides?: ModelDetailsFieldOverrideMap;
  @Input() fieldPipes?: ModelDetailsFieldPipeList;
  @Input() showEmptyFields?: boolean = true;

  public get resolvedPropertyPairs(): [string, any][] {
    return this.includedFields.reduce((pairs: any[], fieldName: string) => {

      let mappedFieldName = _.get<string>(this.mappedFieldNames, fieldName, fieldName);
      let fieldPipes = _.get<PipeLike[]>(this.fieldPipes, fieldName, []);
      let value;

      // if an override is given for this property, use that property instead
      if (_.has(this.fieldOverrides, fieldName)) {
        fieldName = this.fieldOverrides[fieldName];
      }

      // if the same key exists on the model object, use the model's value instead of the detail's value
      if (_.hasIn(this.model, fieldName)) {
        value = this.model[fieldName];
      }
      else {
        value = this.model.details[fieldName];
      }

      // apply pipes (if any) associated with this field
      fieldPipes.forEach((pipe) => value = pipe.transform(value));

      if (value || this.showEmptyFields) {
        pairs.push([mappedFieldName, value || WexDetailsView.VALUE_PLACEHOLDER]);
      }

      return pairs;
    }, []);
  }
}
