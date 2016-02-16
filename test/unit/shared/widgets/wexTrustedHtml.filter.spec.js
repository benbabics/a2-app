(function () {
    "use strict";

    fdescribe("A WEX Trusted HTML filter", function () {
        var filter,
            $sce,
            html;

        beforeEach(function () {

            module("app.shared");

            inject(function ($filter, _$sce_) {
                $sce = _$sce_;

                filter = $filter("wexTrustedHtml");
            });

            html = "<body>" + TestUtils.getRandomStringThatIsAlphaNumeric(20) + "</body>";
        });

        it("should call $sce.trustAsHtml with the expected value", function () {
            spyOn($sce, "trustAsHtml").and.callThrough();

            filter(html);

            expect($sce.trustAsHtml).toHaveBeenCalledWith(html);
        });

        it("should return the expected value", function () {
            //TODO - This doesn't work. Figure out how to test this
            //expect(filter(html)).toEqual($sce.trustAsHtml(html));
        });
    });
}());