(function () {
    "use strict";

    var DataExtractorResponseInterceptor;

    describe("A DataExtractor Response Interceptor", function () {

        beforeEach(function () {

            module("app.shared");

            inject(function (_DataExtractorResponseInterceptor_) {
                DataExtractorResponseInterceptor = _DataExtractorResponseInterceptor_;
            });

        });

        describe("has a response function that", function () {

            var responseResult,
                data,
                operation;

            describe("when the data is NOT empty", function () {

                describe("when the data is an object", function () {

                    describe("when data holds a data array", function () {

                        describe("when the response contains a totalResults property", function () {

                            beforeEach(function () {
                                data = {
                                    data        : [
                                        {
                                            property1: "value1",
                                            property2: "value2",
                                            property3: "value3"
                                        },
                                        {
                                            property1: "value1",
                                            property2: "value2",
                                            property3: "value3"
                                        },
                                        {
                                            property1: "value1",
                                            property2: "value2",
                                            property3: "value3"
                                        }
                                    ],
                                    totalResults: 3
                                };

                                responseResult = DataExtractorResponseInterceptor.response(data, operation);
                            });

                            it("should set the result with the data", function () {
                                var expectedResult;

                                expectedResult = data.data;
                                expectedResult.totalResults = data.totalResults;

                                expect(responseResult).toEqual(jasmine.objectContaining(expectedResult));
                            });

                        });

                        describe("when the response does NOT contain a totalResults property", function () {

                            beforeEach(function () {
                                data = {
                                    data: [
                                        {
                                            property1: "value1",
                                            property2: "value2",
                                            property3: "value3"
                                        }
                                    ]
                                };

                                responseResult = DataExtractorResponseInterceptor.response(data, operation);
                            });

                            it("should set the result with the data", function () {
                                expect(responseResult).toEqual(jasmine.objectContaining(data.data));
                            });

                        });

                    });

                    describe("when data does NOT hold a data array", function () {

                        beforeEach(function () {
                            data = {
                                property1: "value1",
                                property2: "value2",
                                property3: "value3"
                            };

                            responseResult = DataExtractorResponseInterceptor.response(data, operation);
                        });

                        it("should set the result with the data", function () {
                            expect(responseResult).toEqual(jasmine.objectContaining(data));
                        });

                    });

                    describe("when data contains a message property", function () {

                        beforeEach(function () {
                            data = {
                                property1: "value1",
                                property2: "value2",
                                property3: "value3",
                                message  : "Some Message"
                            };

                            responseResult = DataExtractorResponseInterceptor.response(data, operation);
                        });

                        it("should set the message property on the result", function () {
                            expect(responseResult.message).toEqual(data.message);
                        });

                    });

                    describe("when data does NOT contain a message property", function () {

                        beforeEach(function () {
                            data = {
                                property1: "value1",
                                property2: "value2",
                                property3: "value3"
                            };

                            responseResult = DataExtractorResponseInterceptor.response(data, operation);
                        });

                        it("should set the message property on the result to null", function () {
                            expect(responseResult.message).toBeNull();
                        });

                    });

                });

                describe("when the data is NOT an object", function () {

                    beforeEach(function () {
                        data = TestUtils.getRandomStringThatIsAlphaNumeric(50);

                        responseResult = DataExtractorResponseInterceptor.response(data, operation);
                    });

                    it("should set the result to the data", function () {
                        expect(responseResult).toEqual(data);
                    });
                });

            });

            describe("when the data is null", function () {

                beforeEach(function () {
                    data = null;
                });

                describe("when the operation is getList", function () {

                    beforeEach(function () {
                        operation = "getList";

                        responseResult = DataExtractorResponseInterceptor.response(data, operation);
                    });

                    it("should return an array with an empty object", function () {
                        expect(responseResult).toEqual([{}]);
                    });
                });

                describe("when the operation is NOT getList", function () {

                    beforeEach(function () {
                        operation = "get";

                        responseResult = DataExtractorResponseInterceptor.response(data, operation);
                    });

                    it("should return an empty object", function () {
                        expect(responseResult).toEqual({});
                    });
                });

            });

            describe("when the data is undefined", function () {

                beforeEach(function () {
                    data = undefined;
                });

                describe("when the operation is getList", function () {

                    beforeEach(function () {
                        operation = "getList";

                        responseResult = DataExtractorResponseInterceptor.response(data, operation);
                    });

                    it("should return an array with an empty object", function () {
                        expect(responseResult).toEqual([{}]);
                    });
                });

                describe("when the operation is NOT getList", function () {

                    beforeEach(function () {
                        operation = "get";

                        responseResult = DataExtractorResponseInterceptor.response(data, operation);
                    });

                    it("should return an empty object", function () {
                        expect(responseResult).toEqual({});
                    });
                });

            });

            describe("when the data is empty", function () {

                beforeEach(function () {
                    data = {};
                });

                describe("when the operation is getList", function () {

                    beforeEach(function () {
                        operation = "getList";

                        responseResult = DataExtractorResponseInterceptor.response(data, operation);
                    });

                    it("should return an array with an empty object", function () {
                        expect(responseResult).toEqual([{}]);
                    });
                });

                describe("when the operation is NOT getList", function () {

                    beforeEach(function () {
                        operation = "get";

                        responseResult = DataExtractorResponseInterceptor.response(data, operation);
                    });

                    it("should return an empty object", function () {
                        expect(responseResult).toEqual({});
                    });
                });

            });

        });

    });

})();