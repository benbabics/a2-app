(function () {
    "use strict";

    describe("A WEX Default Date Format filter", function () {
        var filter,
            $filter;

        beforeEach(function () {

            module("app.shared");

            inject(function ($injector, _$filter_) {
                $filter = _$filter_;

                filter = $injector.get("wexDefaultDateFormatFilter");
            });
        });

        it("should format a date to the expected string", function () {
            var date = TestUtils.getRandomDate();

            expect(filter(date)).toEqual($filter("amDateFormat")(date, "MM/DD/YYYY"));
        });
    });
}());