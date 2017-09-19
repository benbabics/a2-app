import * as _ from "lodash";
import { ElementFinder, promise } from "protractor";

export namespace TestUtils {

    export type TemplateFunction = (...params) => void;
    export type TestTemplate = TemplateFunction & { paramNames: string[] };

    export function createTestTemplate(paramNames: string[], templateFunction: TemplateFunction): TestTemplate {
        return _.merge(templateFunction, { paramNames });
    };

    export function executeTestTemplate(template: TestTemplate, params: any) {
        let args: any[] = [];

        template.paramNames.forEach((paramName: string) => {
            args.push(params[paramName]);
        });

        template(...args);
    };

    export function fieldValue(field: ElementFinder): promise.Promise<string> {
        return field.getAttribute("value");
    }

    export function testTemplate(paramNames: string[], templateFunction: TemplateFunction, ...params: any[]): TemplateFunction {
        if (params.length === 0) {
            throw new Error("SYNTAX ERROR: Test template was not supplied any parameters and will not be executed.");
        }

        let template = createTestTemplate(paramNames, templateFunction);

        return () => {
            params.forEach((params: any) => describe("should behave such that", () => executeTestTemplate(template, params)));
        };
    };
}