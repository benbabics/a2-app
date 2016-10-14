(function () {
    "use strict";

    describe("A WEX CardSuffix Filter", function () {

        var wexCardSuffixFilter;

        beforeEach(function () {

            module("app.shared");

            inject(function ($injector) {
                wexCardSuffixFilter = $injector.get("wexCardSuffixFilter");
            });
        });

        it("should return a properly formatted Card Suffix number", function () {
            expect(wexCardSuffixFilter("12345")).toBe("1234-5");
            expect(wexCardSuffixFilter(null)).toBe("");
            expect(wexCardSuffixFilter("")).toBe("");
        });

    });

})();