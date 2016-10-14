(function () {
    "use strict";

    var HttpResponseReporterInterceptor,
        $rootScope,
        MOCK_REMOTE_REQUEST_CONFIG = {
            method: "POST",
            url: "http://somedomain.com/someendpoint"
        },
        MOCK_LOCAL_REQUEST_CONFIG = {
            method: "GET",
            url: "app/somefolder/somefile.html"
        },
        mockResponse = {
            status: "",
            config: {
                url: ""
            }
        };

    describe("An HTTP Response Reporter Interceptor", function () {

        beforeEach(function () {

            module("app.shared.network");

            inject(function (_HttpResponseReporterInterceptor_, _$rootScope_) {
                HttpResponseReporterInterceptor = _HttpResponseReporterInterceptor_;
                $rootScope = _$rootScope_;
            });

            // set up spies
            spyOn($rootScope, "$emit").and.callThrough();
        });

        describe("has a responseError function that", function () {

            describe("when the response is from a remote request", function () {

                var errorResult;

                beforeEach(function () {
                    mockResponse.config = MOCK_REMOTE_REQUEST_CONFIG;
                });

                describe("when the status code is 404", function () {

                    beforeEach(function () {
                        mockResponse.status = 404;

                        errorResult = HttpResponseReporterInterceptor.responseError(mockResponse);
                        $rootScope.$digest();
                    });

                    it("should emit an event that a server error occurred", function () {
                        expect($rootScope.$emit).toHaveBeenCalledWith("network:serverConnectionError");
                    });

                    it("should return true", function () {
                        expect(errorResult).toBeTruthy();
                    });
                });

                describe("when the status code is 503", function () {

                    beforeEach(function () {
                        mockResponse.status = 503;

                        errorResult = HttpResponseReporterInterceptor.responseError(mockResponse);
                        $rootScope.$digest();
                    });

                    it("should emit an event that a server error occurred", function () {
                        expect($rootScope.$emit).toHaveBeenCalledWith("network:serverConnectionError");
                    });

                    it("should return true", function () {
                        expect(errorResult).toBeTruthy();
                    });
                });

                describe("when the status code is NOT 404 OR 503", function () {

                    beforeEach(function () {
                        mockResponse.status = 500;

                        errorResult = HttpResponseReporterInterceptor.responseError(mockResponse);
                        $rootScope.$digest();
                    });

                    it("should NOT emit an event that a server error occurred", function () {
                        expect($rootScope.$emit).not.toHaveBeenCalledWith("network:serverConnectionError");
                    });

                    it("should return true", function () {
                        expect(errorResult).toBeTruthy();
                    });

                });
            });

            describe("when the response is NOT from a remote request", function () {

                var errorResult;

                beforeEach(function () {
                    mockResponse.config = MOCK_LOCAL_REQUEST_CONFIG;
                });

                describe("when the status code is 404", function () {

                    beforeEach(function () {
                        mockResponse.status = 404;

                        errorResult = HttpResponseReporterInterceptor.responseError(mockResponse);
                        $rootScope.$digest();
                    });

                    it("should NOT emit an event that a server error occurred", function () {
                        expect($rootScope.$emit).not.toHaveBeenCalledWith("network:serverConnectionError");
                    });

                    it("should return true", function () {
                        expect(errorResult).toBeTruthy();
                    });
                });

                describe("when the status code is 503", function () {

                    beforeEach(function () {
                        mockResponse.status = 503;

                        errorResult = HttpResponseReporterInterceptor.responseError(mockResponse);
                        $rootScope.$digest();
                    });

                    it("should NOT emit an event that a server error occurred", function () {
                        expect($rootScope.$emit).not.toHaveBeenCalledWith("network:serverConnectionError");
                    });

                    it("should return true", function () {
                        expect(errorResult).toBeTruthy();
                    });
                });

                describe("when the status code is NOT 404 OR 503", function () {

                    beforeEach(function () {
                        mockResponse.status = 500;

                        errorResult = HttpResponseReporterInterceptor.responseError(mockResponse);
                        $rootScope.$digest();
                    });

                    it("should NOT emit an event that a server error occurred", function () {
                        expect($rootScope.$emit).not.toHaveBeenCalledWith("network:serverConnectionError");
                    });

                    it("should return true", function () {
                        expect(errorResult).toBeTruthy();
                    });

                });
            });
        });

        describe("has a response function that", function () {

            var passedResponse;

            beforeEach(function () {
                mockResponse.status = 200;
                mockResponse.data = "Here is some data";
            });

            describe("when the response is from a remote request", function () {

                beforeEach(function () {
                    mockResponse.config = MOCK_REMOTE_REQUEST_CONFIG;

                    passedResponse = HttpResponseReporterInterceptor.response(mockResponse.data, mockResponse);
                });

                it("should emit an event that a server error occurred", function () {
                    expect($rootScope.$emit).toHaveBeenCalledWith("network:serverConnectionSuccess");
                });

                it("should pass on the response object without modifying it", function () {
                    expect(passedResponse).toEqual(mockResponse.data);
                });
            });

            describe("when the response is NOT from a remote request", function () {

                beforeEach(function () {
                    mockResponse.config = MOCK_LOCAL_REQUEST_CONFIG;

                    passedResponse = HttpResponseReporterInterceptor.response(mockResponse.data, mockResponse);
                });

                it("should NOT emit an event that a server error occurred", function () {
                    expect($rootScope.$emit).not.toHaveBeenCalledWith("network:serverConnectionSuccess");
                });

                it("should pass on the response object without modifying it", function () {
                    expect(passedResponse).toEqual(mockResponse.data);
                });
            });


        });

    });

})();