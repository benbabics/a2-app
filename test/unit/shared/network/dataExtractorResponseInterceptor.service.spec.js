(function () {
    "use strict";

    var DataExtractorResponseInterceptor;

    describe("A DataExtractor Response Interceptor", function () {

        beforeEach(function () {

            module("app.shared.network");

            inject(function (_DataExtractorResponseInterceptor_) {
                DataExtractorResponseInterceptor = _DataExtractorResponseInterceptor_;
            });

        });

        describe("has a response function that", function () {

            var responseResult,
                data,
                operation;

            describe("when the data is NOT empty", function () {

                describe("when data holds a nested data array", function () {

                    describe("when the first object in the array contains a searchResults property", function () {

                        beforeEach(function () {
                            data = {
                                data: [
                                    {
                                        searchResults: [
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
                                    }
                                ]
                            };

                            responseResult = DataExtractorResponseInterceptor.response(data, operation);
                        });

                        it("should set the result with the data", function () {
                            var expectedResult;

                            expectedResult = data.data[0].searchResults;
                            expectedResult.totalResults = data.data[0].totalResults;

                            expect(responseResult).toEqual(jasmine.objectContaining(expectedResult));
                        });

                    });

                    describe("when the first object in the array does NOT contain a searchResults property", function () {

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
                            expect(responseResult).toEqual(jasmine.objectContaining(data.data[0]));
                        });

                    });

                });

                describe("when data does NOT hold a nested data array", function () {

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
                            message: "Some Message"
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