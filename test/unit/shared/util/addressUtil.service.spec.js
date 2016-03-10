(function () {
    "use strict";

    describe("An AddressUtil service", function () {

        var _,
            AddressUtil,
            poBoxAcceptableValues = ["PO Box", "P O Box", "POBox", "P OBox", "P.O. Box", "P. O. Box", "P.O.Box", "P. O.Box",
                "PO. Box", "P O. Box", "PO.Box", "P OBox", "P.O Box", "P. O Box", "P.OBox", "P. OBox", "POB", "P.O.B.",
                "POST OFFICE BOX", "Post Office Box"],
            poBoxUnacceptableValues = ["P Box", "P Box", "PBox", "Pb", "PB", "pB", "pb", "Po", "PO", "pO", "po"];

        beforeEach(function () {

            module("app.shared");

            inject(function (___, _AddressUtil_) {
                _ = ___;
                AddressUtil = _AddressUtil_;
            });
        });

        describe("has an isPoBox function that", function () {

            it("should return false when value is null", function () {
                expect(AddressUtil.isPoBox(null)).toBeFalsy();
            });

            it("should return false when value is an empty string", function () {
                expect(AddressUtil.isPoBox("")).toBeFalsy();
            });

            it("should return false when value is an object", function () {
                expect(AddressUtil.isPoBox({})).toBeFalsy();
            });

            it("should return false when value is an array", function () {
                expect(AddressUtil.isPoBox([])).toBeFalsy();
            });

            it("should return false when value is a boolean", function () {
                expect(AddressUtil.isPoBox(TestUtils.getRandomBoolean())).toBeFalsy();
            });

            it("should return false when value is a number", function () {
                expect(AddressUtil.isPoBox(TestUtils.getRandomNumber(0, 100))).toBeFalsy();
            });

            it("should return true for acceptable values", function () {
                _.forEach(poBoxAcceptableValues, function(value) {
                    expect(AddressUtil.isPoBox(value)).toBeTruthy();
                });
            });

            it("should return false for unacceptable values", function () {
                _.forEach(poBoxUnacceptableValues, function(value) {
                    expect(AddressUtil.isPoBox(value)).toBeFalsy();
                });
            });

            it("should return false for strings starting with a number", function () {
                var string = TestUtils.getRandomInteger(1, 1000) + TestUtils.getRandomStringThatIsAlphaNumeric(50);

                expect(AddressUtil.isPoBox(string)).toBeFalsy();
            });
        });
    });
})();
