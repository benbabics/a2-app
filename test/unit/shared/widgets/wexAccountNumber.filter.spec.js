(function () {
    "use strict";

    describe("A WEX Account Number Filter", function () {

        var wexAccountNumberFilter;

        beforeEach(function () {

            module("app.shared");

            inject(function ($injector) {
                wexAccountNumberFilter = $injector.get("wexAccountNumberFilter");
            });
        });

        it("should return a properly formatted Account Number", function () {
            expect(wexAccountNumberFilter("1234567890123")).toBe("*********0123");
            expect(wexAccountNumberFilter(null)).toBe("");
            expect(wexAccountNumberFilter("")).toBe("");
        });

    });

})();