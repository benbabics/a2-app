(function () {
    "use strict";

    describe("A LoggerUtil service", function () {

        var _,
            LoggerUtil;

        beforeEach(function () {

            module("app.shared");

            inject(function (___, _LoggerUtil_) {
                _ = ___;
                LoggerUtil = _LoggerUtil_;
            });
        });

        describe("has a getErrorMessage function that", function () {

            var errorObjectArg,
                errorMessageResult;

            describe("when the error object param is an array", function () {

                beforeEach(function () {
                    errorObjectArg = _.times(TestUtils.getRandomInteger(1, 10), function () {
                        return {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };
                    });

                    errorMessageResult = LoggerUtil.getErrorMessage(errorObjectArg);
                });

                it("should return the expected message", function () {
                    var expectedError = _.reduce(errorObjectArg, function (message, error) {
                        return message + "\n- " + LoggerUtil.getErrorMessage(error);
                    }, "");

                    expect(errorMessageResult).toEqual(expectedError);
                });
            });

            describe("when the error object param is a string", function () {

                beforeEach(function () {
                    errorObjectArg = "There was a specific error";

                    errorMessageResult = LoggerUtil.getErrorMessage(errorObjectArg);
                });

                it("should return the error object param", function () {
                    expect(errorObjectArg).toEqual(errorMessageResult);
                });

            });

            describe("when the error object param is an object of the Error class", function () {

                beforeEach(function () {
                    errorObjectArg = {
                        message: "There is a description for this error"
                    };

                    errorMessageResult = LoggerUtil.getErrorMessage(errorObjectArg);
                });

                it("should return the message property in the error object", function () {
                    expect(errorMessageResult).toMatch(errorObjectArg.message);
                });

            });

            describe("when the error object param is a failed response object", function () {

                describe("when the response object has an error property", function () {

                    beforeEach(function () {
                        errorObjectArg = {
                            data: {
                                error: "There is a type for this error"
                            }
                        };

                        errorMessageResult = LoggerUtil.getErrorMessage(errorObjectArg);
                    });

                    it("should return the error property in the error object", function () {
                        expect(errorMessageResult).toMatch(errorObjectArg.data.error);
                    });

                });

                describe("when the response object has an error_description property", function () {

                    beforeEach(function () {
                        errorObjectArg = {
                            data: {
                                error_description: "There is a description for this error"
                            }
                        };

                        errorMessageResult = LoggerUtil.getErrorMessage(errorObjectArg);
                    });

                    it("should return the error_description property in the error object", function () {
                        expect(errorMessageResult).toMatch(errorObjectArg.data.error_description);
                    });

                });

                describe("when the response object does not have an error or an error_description property", function () {

                    beforeEach(function () {
                        errorObjectArg = {};

                        errorMessageResult = LoggerUtil.getErrorMessage(errorObjectArg);
                    });

                    it("should return an Unknown Exception error message", function () {
                        expect(errorMessageResult).toEqual("ERROR: cause unknown.");
                    });

                });

            });

            describe("when the error object param is NOT a string or a failed response object", function () {

                beforeEach(function () {
                    errorObjectArg = {};

                    errorMessageResult = LoggerUtil.getErrorMessage(errorObjectArg);
                });

                it("should return an Unknown Exception error message", function () {
                    expect(errorMessageResult).toEqual("ERROR: cause unknown.");
                });

            });

            describe("when the error object param is null", function () {

                beforeEach(function () {
                    errorObjectArg = null;

                    errorMessageResult = LoggerUtil.getErrorMessage(errorObjectArg);
                });

                it("should return an Unknown Exception error message", function () {
                    expect(errorMessageResult).toEqual("ERROR: cause unknown.");
                });

            });

            describe("when the error object param is undefined", function () {

                beforeEach(function () {
                    errorObjectArg = undefined;

                    errorMessageResult = LoggerUtil.getErrorMessage(errorObjectArg);
                });

                it("should return an Unknown Exception error message", function () {
                    expect(errorMessageResult).toEqual("ERROR: cause unknown.");
                });

            });
        });
    });
})();
