(function () {
    "use strict";

    describe("A WEX Truncate String Filter", function () {

        var wexTruncateStringFilter;

        beforeEach(inject(function($injector) {
            wexTruncateStringFilter = $injector.get("wexTruncateStringFilter");
        }));

        describe("properly truncates a string that", function () {
            it("should work with default settings", function () {
                expect( wexTruncateStringFilter("12345") ).toBe( "12***" );
            });

            it("should work with a defined limit and character", function () {
                expect( wexTruncateStringFilter("123457890", 5) ).toBe( "1234*****" );
                expect( wexTruncateStringFilter("123457890", 5, "@") ).toBe( "1234@@@@@" );
            });
        });

    });

})();
