import * as _ from "lodash";
import { TestUtils } from "../test-utils";
import { ElementFinder, promise } from "protractor";

export type PageElementLocator<PageT> = ElementFinder | keyof PageT;

export abstract class Page<T> {

    public abstract init();

    constructor () {
        this.init();
    }

    public fieldValue(field: PageElementLocator<T>): promise.Promise<string> {
        if (field instanceof ElementFinder) {
            return TestUtils.fieldValue(field);
        }
        else {
            return TestUtils.fieldValue(_.get<ElementFinder>(this, field));
        }
    }
}

export namespace Page {

    export function init<T>($class: new() => T): T {
        if (!this.page) {
            this.page = new $class();
        }

        return this.page;
    }
}