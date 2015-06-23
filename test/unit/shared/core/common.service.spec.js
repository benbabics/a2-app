(function () {
    "use strict";

    var CommonService,
        $rootScope;

    describe("A Common Service", function () {

        beforeEach(function () {

            module("app.shared");

            inject(function (_CommonService_, _$rootScope_) {
                $rootScope = _$rootScope_;

                CommonService = _CommonService_;
            });

        });

        describe("has a maskAccountNumber function that", function () {

            describe("when provided a valid Account Number", function () {

                it("should return a properly formatted Account Number", function () {
                    expect(CommonService.maskAccountNumber("1234567890123")).toBe("*********0123");
                });

            });

            describe("when provided a null Account Number", function () {

                it("should return an empty string", function () {
                    expect(CommonService.maskAccountNumber(null)).toBe("");
                });

            });

            describe("when provided an empty Account Number", function () {

                it("should return an empty string", function () {
                    expect(CommonService.maskAccountNumber("")).toBe("");
                });

            });

            describe("when provided an undefined Account Number", function () {

                it("should return an empty string", function () {
                    expect(CommonService.maskAccountNumber(undefined)).toBe("");
                });

            });
        });

        describe("has a loadingBegin function that", function () {
            beforeEach(function () {
                spyOn($rootScope, "$broadcast");
            });

            it("should broadcast the loadingBegin event when the first call is made.", function () {
                CommonService.loadingBegin();

                expect($rootScope.$broadcast).toHaveBeenCalledWith("loadingBegin");
            });

            it("should not broadcast the loadingBegin event when subsequent calls are made", function () {
                CommonService.loadingBegin();
                CommonService.loadingBegin();

                expect($rootScope.$broadcast.calls.count()).toBe(1);
            });
        });

        describe("has a loadingEnd function that", function () {
            beforeEach(function () {
                spyOn($rootScope, "$broadcast");
            });

            it("should not broadcast the loadingComplete event when multiple calls to loadingBegin were made", function () {
                CommonService.loadingBegin();
                CommonService.loadingBegin();
                CommonService.loadingComplete();

                expect($rootScope.$broadcast).not.toHaveBeenCalledWith("loadingComplete");
            });

            it("should broadcast the loadingComplete event when the number of loadingComplete calls equals the number of loadingBegin calls", function () {
                CommonService.loadingBegin();
                CommonService.loadingComplete();

                expect($rootScope.$broadcast).toHaveBeenCalledWith("loadingComplete");
            });
        });

        describe("has a fieldHasError function that", function () {

            describe("when the field is not defined", function () {
                var field;

                it("should return false", function () {
                    expect(CommonService.fieldHasError(field)).toBeFalsy();
                });
            });

            describe("when the field is null", function () {
                var field = null;

                it("should return false", function () {
                    expect(CommonService.fieldHasError(field)).toBeFalsy();
                });
            });

            describe("when the field is a valid object", function () {
                var field = {};

                describe("when field.$error is undefined", function () {
                    it("should return false", function () {
                        expect(CommonService.fieldHasError(field)).toBeFalsy();
                    });
                });

                describe("when field.$error is null", function () {
                    beforeAll(function () {
                        field.$error = null;
                    });

                    it("should return false", function () {
                        expect(CommonService.fieldHasError(field)).toBeFalsy();
                    });
                });

                describe("when field.$error is a valid object", function () {
                    beforeAll(function () {
                        field.$error = {};
                    });

                    describe("when field.$error is empty", function () {
                        it("should return false", function () {
                            expect(CommonService.fieldHasError(field)).toBeFalsy();
                        });
                    });

                    describe("when field.$error contains properties", function () {
                        beforeAll(function () {
                            field.$error.mockProperty = "Mock property value";
                        });

                        it("should return true", function () {
                            expect(CommonService.fieldHasError(field)).toBeTruthy();
                        });
                    });
                });
            });
        });

    });

})();