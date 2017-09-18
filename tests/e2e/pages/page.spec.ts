import * as _ from "lodash";
import { ElementFinder, promise } from "protractor";

export type PageElementLocator<PageT> = ElementFinder | keyof PageT;

export abstract class Page<T> {

    public fieldValue(field: PageElementLocator<T>): promise.Promise<string> {
        if (field instanceof ElementFinder) {
            return Page.FieldValue(field);
        }
        else {
            return Page.FieldValue(_.get<ElementFinder>(this, field));
        }
    }
}

export namespace Page {

    export function FieldValue(field: ElementFinder): promise.Promise<string> {
        return field.getAttribute("value");
    }

    export function Init<T>($class: new() => T): T {
        if (!this.page) {
            this.page = new $class();
        }

        return this.page;
    }
}