(function () {
    "use strict";

    describe("A LoggerUtil service", function () {

        var _,
            LoggerUtil;

        beforeEach(inject(function (___, _LoggerUtil_) {
            _ = ___;
            LoggerUtil = _LoggerUtil_;
        }));

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
                    errorObjectArg = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                    errorMessageResult = LoggerUtil.getErrorMessage(errorObjectArg);
                });

                it("should return the error object param", function () {
                    expect(errorObjectArg).toEqual(errorMessageResult);
                });

            });

            describe("when the error object has a message property", function () {

                beforeEach(function () {
                    errorObjectArg = {
                        message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    };

                    errorMessageResult = LoggerUtil.getErrorMessage(errorObjectArg);
                });

                it("should return the message property in the error object", function () {
                    expect(errorMessageResult).toMatch(LoggerUtil.getErrorMessage(errorObjectArg.message));
                });
            });

            describe("when the error object has a data property", function () {

                beforeEach(function () {
                    errorObjectArg = {
                        data: {
                            error: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        }
                    };

                    errorMessageResult = LoggerUtil.getErrorMessage(errorObjectArg);
                });

                it("should return the expected value", function () {
                    expect(errorMessageResult).toMatch(LoggerUtil.getErrorMessage(errorObjectArg.data));
                });
            });

            describe("when the error object has an error property", function () {

                beforeEach(function () {
                    errorObjectArg = {
                        error: {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        }
                    };

                    errorMessageResult = LoggerUtil.getErrorMessage(errorObjectArg);
                });

                it("should return the expected value", function () {
                    expect(errorMessageResult).toMatch(LoggerUtil.getErrorMessage(errorObjectArg.error));
                });
            });

            describe("when the error object has an error_description property", function () {

                beforeEach(function () {
                    errorObjectArg = {error_description: TestUtils.getRandomStringThatIsAlphaNumeric(10)};

                    errorMessageResult = LoggerUtil.getErrorMessage(errorObjectArg);
                });

                it("should return the expected value", function () {
                    expect(errorMessageResult).toMatch(LoggerUtil.getErrorMessage(errorObjectArg.error_description));
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
