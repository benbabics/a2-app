(function () {
    "use strict";

    describe("An AccountUtil service", function () {

        var AccountUtil;

        beforeEach(function () {

            module("app.shared");

            inject(function (_AccountUtil_) {
                AccountUtil = _AccountUtil_;
            });
        });

        describe("has a maskAccountNumber function that", function () {

            describe("when provided a valid Account Number", function () {

                it("should return a properly formatted Account Number", function () {
                    expect(AccountUtil.maskAccountNumber("1234567890123")).toBe("*********0123");
                });

            });

            describe("when provided a null Account Number", function () {

                it("should return an empty string", function () {
                    expect(AccountUtil.maskAccountNumber(null)).toBe("");
                });

            });

            describe("when provided an empty Account Number", function () {

                it("should return an empty string", function () {
                    expect(AccountUtil.maskAccountNumber("")).toBe("");
                });

            });

            describe("when provided an undefined Account Number", function () {

                it("should return an empty string", function () {
                    expect(AccountUtil.maskAccountNumber(undefined)).toBe("");
                });

            });
        });
    });
})();
