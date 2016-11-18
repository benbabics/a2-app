(function () {
    "use strict";

    describe("A WEX Card Number Filter", function () {

        var wexCardNumberFilter;

        beforeEach(inject(function ($injector) {
            wexCardNumberFilter = $injector.get("wexCardNumberFilter");
        }));

        it("should return a properly formatted Card Number", function () {
            expect(wexCardNumberFilter("1234567890123")).toBe("****90123");
            expect(wexCardNumberFilter("12345")).toBe("****12345");
            expect(wexCardNumberFilter("1234")).toBe("****1234");
            expect(wexCardNumberFilter(null)).toBe("");
            expect(wexCardNumberFilter("")).toBe("");
        });

    });

})();