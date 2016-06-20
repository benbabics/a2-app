(function () {
    "use strict";

    describe("A WEX SVG filter", function () {
        var _,
            filter,
            $filter,
            svgSrc;

        beforeEach(function () {

            module("app.shared");

            inject(function (___, _$filter_) {
                _ = ___;
                $filter = _$filter_;

                filter = $filter("wexSvg");
            });

            svgSrc = "<svg>" + TestUtils.getRandomStringThatIsAlphaNumeric(20) + "</svg>";
        });

        describe("when the SVG source has a DOCTYPE", function () {
            var result;

            beforeEach(function () {
                svgSrc = "<!DOCTYPE>" + svgSrc;

                result = filter(svgSrc);
            });

            it("should call the wexTrustedHtml filter", function () {
                //TODO - Figure out how to test this
                //expect($filter).toHaveBeenCalledWith(svgSrc);
            });

            it("should return the expected value with the DOCTYPE stripped out", function () {
                var transformedSrc = _.replace(svgSrc, /<!DOCTYPE([^>]*\[[^\]]*]|[^>]*)>/g, "");

                expect("" + result).toEqual(transformedSrc);
                expect("" + result).not.toContain("<!DOCTYPE>");
            });
        });

        describe("when the SVG source does NOT have a DOCTYPE", function () {
            var result;

            beforeEach(function () {
                result = filter(svgSrc);
            });

            it("should call the wexTrustedHtml filter", function () {
                //TODO - Figure out how to test this
                //expect($filter).toHaveBeenCalledWith(svgSrc);
            });

            it("should return the expected value", function () {
                expect("" + result).toEqual(svgSrc);
            });
        });
    });
}());
