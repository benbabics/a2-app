(function () {
    "use strict";

    var $ionicPopup,
        CommonService,
        globals = {
            GENERAL: {
                ERRORS: {
                    "UNKNOWN_EXCEPTION": "ERROR: cause unknown."
                }
            }
        },
        popupDeferred,
        $rootScope,
        navBar,
        rootNavView,
        viewActive,
        viewEntering,
        activeNavView,
        embeddedActiveView,
        embeddedEnteringView,
        cachedNavView,
        cachedActiveView;

    describe("A Common Service", function () {

        beforeEach(function () {

            module("app.shared.dependencies");

            // mock dependencies
            $ionicPopup = jasmine.createSpyObj("$ionicPopup", ["alert"]);

            module(function ($provide) {
                $provide.value("$ionicPopup", $ionicPopup);
                $provide.value("globals", globals);
            });

            module("app.shared");

            inject(function ($q, _CommonService_, _$rootScope_, $compile) {
                $rootScope = _$rootScope_;
                popupDeferred = $q.defer();

                CommonService = _CommonService_;

                navBar = $compile("<ion-nav-bar class='bar-wex'></ion-nav-bar>")($rootScope);
                rootNavView = $compile("<ion-nav-view class='nav-view-root'></ion-nav-view>")($rootScope);
                activeNavView = $compile("<ion-nav-view nav-view='active'></ion-nav-view>")($rootScope);
                cachedNavView = $compile("<ion-nav-view nav-view='cached'></ion-nav-view>")($rootScope);

                viewActive = $compile("<ion-view nav-view='active'></ion-view>")($rootScope);
                viewEntering = $compile("<ion-view nav-view='entering'></ion-view>")($rootScope);
                embeddedActiveView = $compile("<ion-view nav-view='active'></ion-view>")($rootScope);
                embeddedEnteringView = $compile("<ion-view nav-view='entering'></ion-view>")($rootScope);
                cachedActiveView = $compile("<ion-view nav-view='active'></ion-view>")($rootScope);

                angular.element(document.body).append(navBar);
                angular.element(document.body).append(rootNavView);

                $rootScope.$digest();
            });

            $ionicPopup.alert.and.returnValue(popupDeferred.promise);
            popupDeferred.resolve();
        });

        afterEach(function () {
            navBar.remove();
            rootNavView.remove();

            $rootScope.$digest();
        });

        describe("has a displayAlert function that", function () {

            describe("when options are NOT provided", function () {

                beforeEach(function () {
                    CommonService.displayAlert();
                });

                it("should call $ionicPopup.alert with the default cssClass", function () {
                    expect($ionicPopup.alert).toHaveBeenCalledWith({cssClass: "wex-alert-popup"});
                });

            });

            describe("when options.title is provided", function () {

                var options = {
                    title: "Test Title"
                };

                beforeEach(function () {
                    CommonService.displayAlert(options);
                });

                it("should call $ionicPopup.alert with the correct options", function () {
                    expect($ionicPopup.alert).toHaveBeenCalledWith({title: "Test Title", cssClass: "wex-alert-popup"});
                });

            });

            describe("when options.subTitle is provided", function () {

                var options = {
                    subTitle: "Test SubTitle"
                };

                beforeEach(function () {
                    CommonService.displayAlert(options);
                });

                it("should call $ionicPopup.alert with the correct options", function () {
                    expect($ionicPopup.alert).toHaveBeenCalledWith({subTitle: "Test SubTitle", cssClass: "wex-alert-popup"});
                });

            });

            describe("when options.cssClass is provided", function () {

                var options = {
                    cssClass: "wex-alert-dialog"
                };

                beforeEach(function () {
                    CommonService.displayAlert(options);
                });

                it("should call $ionicPopup.alert with the correct options", function () {
                    expect($ionicPopup.alert).toHaveBeenCalledWith({cssClass: "wex-alert-dialog"});
                });

            });

            describe("when options.content is provided", function () {

                var options = {
                    content: "Test Content"
                };

                beforeEach(function () {
                    CommonService.displayAlert(options);
                });

                it("should call $ionicPopup.alert with the correct options", function () {
                    expect($ionicPopup.alert).toHaveBeenCalledWith({template: "Test Content", cssClass: "wex-alert-popup"});
                });

            });

            describe("when options.buttonText is provided", function () {

                var options = {
                    buttonText: "Button Text"
                };

                beforeEach(function () {
                    CommonService.displayAlert(options);
                });

                it("should call $ionicPopup.alert with the correct options", function () {
                    expect($ionicPopup.alert).toHaveBeenCalledWith({okText: "Button Text", cssClass: "wex-alert-popup"});
                });

            });

            describe("when options.buttonCssClass is provided", function () {

                var options = {
                    buttonCssClass: "wex-alert-button"
                };

                beforeEach(function () {
                    CommonService.displayAlert(options);
                });

                it("should call $ionicPopup.alert with the correct options", function () {
                    expect($ionicPopup.alert).toHaveBeenCalledWith({okType: "wex-alert-button", cssClass: "wex-alert-popup"});
                });

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

        describe("has a getErrorMessage function that", function () {

            var errorObjectArg,
                errorMessageResult;

            describe("when the error object param is a string", function () {

                beforeEach(function () {
                    errorObjectArg = "There was a specific error";

                    errorMessageResult = CommonService.getErrorMessage(errorObjectArg);
                });

                it("should return the error object param", function () {
                    expect(errorObjectArg).toEqual(errorMessageResult);
                });

            });

            describe("when the error object param is a failed response object", function () {

                describe("when the response object has error and error_description properties", function () {

                    beforeEach(function () {
                        errorObjectArg = {
                            data: {
                                error: "There is a type for this error",
                                error_description: "There is a description for this error"
                            }
                        };

                        errorMessageResult = CommonService.getErrorMessage(errorObjectArg);
                    });

                    it("should return the error property in the error message", function () {
                        expect(errorMessageResult).toMatch(errorObjectArg.data.error  + ": " + errorObjectArg.data.error_description);
                    });

                });

                describe("when the response object has an error property", function () {

                    beforeEach(function () {
                        errorObjectArg = {
                            data: {
                                error: "There is a type for this error"
                            }
                        };

                        errorMessageResult = CommonService.getErrorMessage(errorObjectArg);
                    });

                    it("should return the error property in the error message", function () {
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

                        errorMessageResult = CommonService.getErrorMessage(errorObjectArg);
                    });

                    it("should return the error_description property in the error message", function () {
                        expect(errorMessageResult).toMatch(errorObjectArg.data.error_description);
                    });

                });

                describe("when the response object does not have an error or an error_description property", function () {

                    beforeEach(function () {
                        errorObjectArg = {};

                        errorMessageResult = CommonService.getErrorMessage(errorObjectArg);
                    });

                    it("should return an Unknown Exception error message", function () {
                        expect(errorMessageResult).toEqual("ERROR: cause unknown.");
                    });

                });

                describe("when the response object has a data property that is null", function () {

                    beforeEach(function () {
                        errorObjectArg = {
                            data: null
                        };

                        errorMessageResult = CommonService.getErrorMessage(errorObjectArg);
                    });

                    it("should return an Unknown Exception error message", function () {
                        expect(errorMessageResult).toEqual("ERROR: cause unknown.");
                    });

                });

            });

            describe("when the error object param is NOT a string or a failed response object", function () {

                beforeEach(function () {
                    errorObjectArg = {};

                    errorMessageResult = CommonService.getErrorMessage(errorObjectArg);
                });

                it("should return an Unknown Exception error message", function () {
                    expect(errorMessageResult).toEqual("ERROR: cause unknown.");
                });

            });

        });

        describe("has a pageHasNavBar function that", function () {

            describe("when the nav bar is hidden", function () {

                beforeEach(function () {
                    navBar.addClass("hide");

                    $rootScope.$digest();
                });

                it("should return false", function () {
                    expect(CommonService.pageHasNavBar()).toBeFalsy();
                });
            });

            describe("when the nav bar is NOT hidden", function () {

                beforeEach(function () {
                    navBar.removeClass("hide");

                    $rootScope.$digest();
                });

                it("should return true", function () {
                    expect(CommonService.pageHasNavBar()).toBeTruthy();
                });
            });

            describe("when there is no nav bar", function () {

                beforeEach(function () {
                    navBar.remove();

                    $rootScope.$digest();
                });

                it("should return false", function () {
                    expect(CommonService.pageHasNavBar()).toBeFalsy();
                });
            });
        });

        describe("has a getActiveNavView function that", function () {

            describe("when there is a nav view", function () {

                it("should return the nav view", function () {
                    expect(CommonService.getActiveNavView()).toEqual(rootNavView);
                });
            });

            describe("when there is NOT a nav view", function () {

                beforeEach(function () {
                    rootNavView.remove();

                    $rootScope.$digest();
                });

                it("should return null", function () {
                    expect(CommonService.getActiveNavView()).toEqual(null);
                });
            });
        });

        describe("has a getActiveView function that", function () {

            describe("when there is an active view on the root nav view", function () {

                beforeEach(function () {
                    rootNavView.append(viewActive);

                    $rootScope.$digest();
                });

                afterEach(function () {
                    viewActive.remove();

                    $rootScope.$digest();
                });

                it("should return the active view", function () {
                    expect(CommonService.getActiveView()).toEqual(viewActive);
                });

                describe("when there is also a cached nav view with an active view", function () {

                    beforeEach(function () {
                        cachedNavView.append(cachedActiveView);
                        rootNavView.append(cachedNavView);

                        $rootScope.$digest();
                    });

                    afterEach(function () {
                        cachedNavView.remove();

                        $rootScope.$digest();
                    });

                    it("should return the non-cached active view", function () {
                        expect(CommonService.getActiveView()).toEqual(viewActive);
                    });
                });
            });

            describe("when there is an entering view on the root nav view", function () {

                beforeEach(function () {
                    rootNavView.append(viewEntering);

                    $rootScope.$digest();
                });

                afterEach(function () {
                    viewEntering.remove();

                    $rootScope.$digest();
                });

                it("should return the entering view", function () {
                    expect(CommonService.getActiveView()).toEqual(viewEntering);
                });

                describe("when there is also a cached nav view with an active view", function () {

                    beforeEach(function () {
                        cachedNavView.append(cachedActiveView);
                        rootNavView.append(cachedNavView);

                        $rootScope.$digest();
                    });

                    afterEach(function () {
                        cachedNavView.remove();

                        $rootScope.$digest();
                    });

                    it("should return the non-cached entering view", function () {
                        expect(CommonService.getActiveView()).toEqual(viewEntering);
                    });
                });
            });

            describe("when there is an active nav view in the root nav view", function () {

                beforeEach(function () {
                    rootNavView.append(activeNavView);

                    $rootScope.$digest();
                });

                afterEach(function () {
                    activeNavView.remove();

                    $rootScope.$digest();
                });

                describe("when there is an active view in the child active nav view", function () {

                    beforeEach(function () {
                        activeNavView.append(embeddedActiveView);

                        $rootScope.$digest();
                    });

                    afterEach(function () {
                        embeddedActiveView.remove();

                        $rootScope.$digest();
                    });

                    it("should return the embedded active view", function () {
                        expect(CommonService.getActiveView()).toEqual(embeddedActiveView);
                    });

                    describe("when there is also a cached nav view with an active view", function () {

                        beforeEach(function () {
                            cachedNavView.append(cachedActiveView);
                            rootNavView.append(cachedNavView);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            cachedNavView.remove();

                            $rootScope.$digest();
                        });

                        it("should return the non-cached embedded active view", function () {
                            expect(CommonService.getActiveView()).toEqual(embeddedActiveView);
                        });
                    });
                });

                describe("when there is an entering view in the child active nav view", function () {

                    beforeEach(function () {
                        activeNavView.append(viewEntering);

                        $rootScope.$digest();
                    });

                    afterEach(function () {
                        viewEntering.remove();

                        $rootScope.$digest();
                    });

                    it("should return the embedded entering view", function () {
                        expect(CommonService.getActiveView()).toEqual(viewEntering);
                    });

                    describe("when there is also a cached nav view with an active view", function () {

                        beforeEach(function () {
                            cachedNavView.append(cachedActiveView);
                            rootNavView.append(cachedNavView);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            cachedNavView.remove();

                            $rootScope.$digest();
                        });

                        it("should return the non-cached embedded entering view", function () {
                            expect(CommonService.getActiveView()).toEqual(viewEntering);
                        });
                    });
                });
            });
        });
    });

})();