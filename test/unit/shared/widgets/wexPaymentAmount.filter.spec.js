(function () {
    "use strict";

    describe("A WEX Payment Amount filter", function () {
        var filter;

        beforeEach(inject(function ($injector) {
            filter = $injector.get("wexPaymentAmountFilter");
        }));

        describe("when the amount is 0", function () {
            var amount = 0;

            it("should return 0", function () {
                expect(filter(amount)).toEqual(0);
            });
        });

        describe("when the amount is NOT 0", function () {
            var amount = TestUtils.getRandomNumber(1, 1000);

            it("should return the amount divided by 100", function () {
                expect(filter(amount)).toEqual(amount / 100);
            });
        });
    });
}());