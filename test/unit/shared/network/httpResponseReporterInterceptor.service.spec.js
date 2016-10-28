(function () {
    "use strict";

    var HttpResponseReporterInterceptor,
        Network,
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

            //create mock dependencies
            Network = jasmine.createSpyObj("Network", ["isServerConnectionError"]);

            module(function ($provide) {
                $provide.value("Network", Network);
            });

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

                describe("when the status code is a server connection error", function () {

                    beforeEach(function () {
                        Network.isServerConnectionError.and.returnValue(true);

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

                describe("when the status code is NOT a server connection error", function () {

                    beforeEach(function () {
                        Network.isServerConnectionError.and.returnValue(false);

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

                describe("when the status code is a server connection error", function () {

                    beforeEach(function () {
                        Network.isServerConnectionError.and.returnValue(true);

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

                describe("when the status code is NOT a server connection error", function () {

                    beforeEach(function () {
                        Network.isServerConnectionError.and.returnValue(false);

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