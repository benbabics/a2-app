(function () {
    "use strict";

    describe("A WEX Default Date Time Format filter", function () {
        var filter,
            $filter;

        beforeEach(inject(function ($injector, _$filter_) {
            $filter = _$filter_;

            filter = $injector.get("wexDefaultDateTimeFormatFilter");
        }));

        it("should format a date to the expected string", function () {
            var date = TestUtils.getRandomDate();

            expect(filter(date)).toEqual($filter("amDateFormat")(date, "MM/DD/YYYY hh:mm:ss A"));
        });
    });
}());