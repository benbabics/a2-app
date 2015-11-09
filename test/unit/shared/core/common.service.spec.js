(function () {
    "use strict";

    var _,
        $ionicPopup,
        $ionicPlatform,
        $compile,
        $rootScope,
        $state,
        CommonService,
        globals = {
            GENERAL: {
                ERRORS: {
                    "UNKNOWN_EXCEPTION": "ERROR: cause unknown."
                }
            }
        },
        alertDeferred,
        confirmDeferred,
        alertPromise,
        confirmPromise,
        navBar,
        rootNavView,
        poBoxAcceptableValues = ["PO Box", "P O Box", "POBox", "P OBox", "P.O. Box", "P. O. Box", "P.O.Box", "P. O.Box",
            "PO. Box", "P O. Box", "PO.Box", "P OBox", "P.O Box", "P. O Box", "P.OBox", "P. OBox", "POB", "P.O.B.",
            "POST OFFICE BOX", "Post Office Box"],
        poBoxUnacceptableValues = ["P Box", "P Box", "PBox", "Pb", "PB", "pB", "pb", "Po", "PO", "pO", "po"];

    describe("A Common Service", function () {

        beforeEach(function () {

            module("app.shared.dependencies");

            // mock dependencies
            $ionicPopup = jasmine.createSpyObj("$ionicPopup", ["alert", "confirm"]);

            module(function ($provide) {
                $provide.value("$ionicPopup", $ionicPopup);
                $provide.value("globals", globals);
            });

            module("app.shared");

            inject(function ($q, _CommonService_, _$rootScope_, _$compile_, _$state_, _$ionicPlatform_) {
                $rootScope = _$rootScope_;
                $compile = _$compile_;
                $state = _$state_;
                $ionicPlatform = _$ionicPlatform_;
                alertDeferred = $q.defer();
                confirmDeferred = $q.defer();

                CommonService = _CommonService_;

                _ = CommonService._;

                navBar = $compile("<ion-nav-bar class='bar-wex'></ion-nav-bar>")($rootScope);
                rootNavView = $compile("<ion-nav-view class='nav-view-root'></ion-nav-view>")($rootScope);

                angular.element(document.body).append(navBar);
                angular.element(document.body).append(rootNavView);

                $rootScope.$digest();

                // spies
                spyOn($state, "go").and.callThrough();
                spyOn($ionicPlatform, "registerBackButtonAction").and.callThrough();
            });

            alertPromise = alertDeferred.promise;
            alertPromise.close = jasmine.createSpy("close");

            confirmPromise = confirmDeferred.promise;
            confirmPromise.close = jasmine.createSpy("close");

            $ionicPopup.alert.and.returnValue(alertPromise);
            alertDeferred.resolve();

            $ionicPopup.confirm.and.returnValue(confirmPromise);
            confirmDeferred.resolve();
        });

        afterEach(function () {
            navBar.remove();
            rootNavView.remove();

            $rootScope.$digest();
        });

        describe("has a closeAlert function that", function () {

            describe("should NOT close an alert when none have been displayed", function () {

                beforeEach(function () {
                    CommonService.closeAlert();
                });

                it("should NOT try to close the alert", function () {
                    expect(alertPromise.close).not.toHaveBeenCalled();
                });

            });

            describe("should close an alert when one has been displayed", function () {

                beforeEach(function () {
                    CommonService.displayAlert();

                    CommonService.closeAlert();
                });

                it("should call close the alert", function () {
                    expect(alertPromise.close).toHaveBeenCalledWith();
                });

            });

        });

        describe("has a closeConfirm function that", function () {

            describe("should NOT close a confirm when none have been displayed", function () {

                beforeEach(function () {
                    CommonService.closeConfirm();
                });

                it("should NOT try to close the confirm", function () {
                    expect(confirmPromise.close).not.toHaveBeenCalled();
                });

            });

            describe("should close a confirm when one has been displayed", function () {

                beforeEach(function () {
                    CommonService.displayConfirm();

                    CommonService.closeConfirm();
                });

                it("should call close the confirm", function () {
                    expect(confirmPromise.close).toHaveBeenCalledWith();
                });

            });

        });

        describe("has a closeAllPopups function that", function () {

            describe("should NOT close an alert when none have been displayed", function () {

                beforeEach(function () {
                    CommonService.closeAlert();
                });

                it("should NOT try to close the alert", function () {
                    expect(alertPromise.close).not.toHaveBeenCalled();
                });

            });

            describe("should close an alert when one has been displayed", function () {

                beforeEach(function () {
                    CommonService.displayAlert();

                    CommonService.closeAlert();
                });

                it("should call close the alert", function () {
                    expect(alertPromise.close).toHaveBeenCalledWith();
                });

            });

            describe("should NOT close a confirm when none have been displayed", function () {

                beforeEach(function () {
                    CommonService.closeConfirm();
                });

                it("should NOT try to close the confirm", function () {
                    expect(confirmPromise.close).not.toHaveBeenCalled();
                });

            });

            describe("should close a confirm when one has been displayed", function () {

                beforeEach(function () {
                    CommonService.displayConfirm();

                    CommonService.closeConfirm();
                });

                it("should call close the confirm", function () {
                    expect(confirmPromise.close).toHaveBeenCalledWith();
                });

            });

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

            describe("when options.contentUrl is provided", function () {

                var options = {
                    contentUrl: TestUtils.getRandomStringThatIsAlphaNumeric(20)
                };

                beforeEach(function () {
                    CommonService.displayAlert(options);
                });

                it("should call $ionicPopup.alert with the correct options", function () {
                    expect($ionicPopup.alert).toHaveBeenCalledWith({
                        templateUrl: options.contentUrl,
                        cssClass: "wex-alert-popup"
                    });
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

        describe("has a displayConfirm function that", function () {
            var defaultCssClass = "wex-confirm-popup";

            describe("when options are NOT provided", function () {

                beforeEach(function () {
                    CommonService.displayConfirm();
                });

                it("should call $ionicPopup.confirm with the default cssClass", function () {
                    expect($ionicPopup.confirm).toHaveBeenCalledWith({cssClass: defaultCssClass});
                });

            });

            describe("when options.title is provided", function () {

                var options = {
                    title: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                };

                beforeEach(function () {
                    CommonService.displayConfirm(options);
                });

                it("should call $ionicPopup.alert with the correct options", function () {
                    expect($ionicPopup.confirm).toHaveBeenCalledWith({
                        title: options.title,
                        cssClass: defaultCssClass
                    });
                });

            });

            describe("when options.subTitle is provided", function () {

                var options = {
                    subTitle: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                };

                beforeEach(function () {
                    CommonService.displayConfirm(options);
                });

                it("should call $ionicPopup.confirm with the correct options", function () {
                    expect($ionicPopup.confirm).toHaveBeenCalledWith({
                        subTitle: options.subTitle,
                        cssClass: defaultCssClass
                    });
                });

            });

            describe("when options.cssClass is provided", function () {

                var options = {
                    cssClass: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                };

                beforeEach(function () {
                    CommonService.displayConfirm(options);
                });

                it("should call $ionicPopup.confirm with the correct options", function () {
                    expect($ionicPopup.confirm).toHaveBeenCalledWith({cssClass: options.cssClass});
                });

            });

            describe("when options.content is provided", function () {

                var options = {
                    content: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                };

                beforeEach(function () {
                    CommonService.displayConfirm(options);
                });

                it("should call $ionicPopup.confirm with the correct options", function () {
                    expect($ionicPopup.confirm).toHaveBeenCalledWith({
                        template: options.content,
                        cssClass: defaultCssClass
                    });
                });

            });

            describe("when options.contentUrl is provided", function () {

                var options = {
                    contentUrl: TestUtils.getRandomStringThatIsAlphaNumeric(20)
                };

                beforeEach(function () {
                    CommonService.displayConfirm(options);
                });

                it("should call $ionicPopup.confirm with the correct options", function () {
                    expect($ionicPopup.confirm).toHaveBeenCalledWith({
                        templateUrl: options.contentUrl,
                        cssClass: defaultCssClass
                    });
                });

            });

            describe("when options.okButtonText is provided", function () {

                var options = {
                    okButtonText: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                };

                beforeEach(function () {
                    CommonService.displayConfirm(options);
                });

                it("should call $ionicPopup.confirm with the correct options", function () {
                    expect($ionicPopup.confirm).toHaveBeenCalledWith({
                        okText: options.okButtonText,
                        cssClass: defaultCssClass});
                });

            });

            describe("when options.okButtonCssClass is provided", function () {

                var options = {
                    okButtonCssClass: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                };

                beforeEach(function () {
                    CommonService.displayConfirm(options);
                });

                it("should call $ionicPopup.confirm with the correct options", function () {
                    expect($ionicPopup.confirm).toHaveBeenCalledWith({
                        okType: options.okButtonCssClass,
                        cssClass: defaultCssClass});
                });

            });

            describe("when options.cancelButtonText is provided", function () {

                var options = {
                    cancelButtonText: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                };

                beforeEach(function () {
                    CommonService.displayConfirm(options);
                });

                it("should call $ionicPopup.confirm with the correct options", function () {
                    expect($ionicPopup.confirm).toHaveBeenCalledWith({
                        cancelText: options.cancelButtonText,
                        cssClass: defaultCssClass});
                });

            });

            describe("when options.cancelButtonCssClass is provided", function () {

                var options = {
                    cancelButtonCssClass: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                };

                beforeEach(function () {
                    CommonService.displayConfirm(options);
                });

                it("should call $ionicPopup.confirm with the correct options", function () {
                    expect($ionicPopup.confirm).toHaveBeenCalledWith({
                        cancelType: options.cancelButtonCssClass,
                        cssClass: defaultCssClass});
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
                spyOn($rootScope, "$emit");
            });

            it("should broadcast the app:loadingBegin event when the first call is made.", function () {
                CommonService.loadingBegin();

                expect($rootScope.$emit).toHaveBeenCalledWith("app:loadingBegin");
            });

            it("should not emit the app:loadingBegin event when subsequent calls are made", function () {
                CommonService.loadingBegin();
                CommonService.loadingBegin();

                expect($rootScope.$emit.calls.count()).toBe(1);
            });
        });

        describe("has a loadingComplete function that", function () {
            beforeEach(function () {
                spyOn($rootScope, "$emit");
            });

            it("should not emit the app:loadingComplete event when multiple calls to loadingBegin were made", function () {
                CommonService.loadingBegin();
                CommonService.loadingBegin();
                CommonService.loadingComplete();

                expect($rootScope.$emit).not.toHaveBeenCalledWith("app:loadingComplete");
            });

            it("should emit the app:loadingComplete event when the number of loadingComplete calls equals the number of loadingBegin calls", function () {
                CommonService.loadingBegin();
                CommonService.loadingComplete();

                expect($rootScope.$emit).toHaveBeenCalledWith("app:loadingComplete");
            });
        });

        describe("has a logOut function that", function () {

            beforeEach(function () {
                spyOn($rootScope, "$emit");

                CommonService.logOut();
            });

            it("should emit an app:logout event", function () {
                expect($rootScope.$emit).toHaveBeenCalledWith("app:logout");
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

            describe("when the error object param is an object of the Error class", function () {

                beforeEach(function () {
                    errorObjectArg = {
                        message: "There is a description for this error"
                    };

                    errorMessageResult = CommonService.getErrorMessage(errorObjectArg);
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

                        errorMessageResult = CommonService.getErrorMessage(errorObjectArg);
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

                        errorMessageResult = CommonService.getErrorMessage(errorObjectArg);
                    });

                    it("should return the error_description property in the error object", function () {
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

        describe("has a findViews function that", function () {

            describe("given a predicate that selects for views with a specific state", function () {
                var state = "mockState",
                    predicate = function (view) {
                        return view.attr("nav-view") === state;
                    };

                describe("when there is no view at the root", function () {

                    describe("when firstView is true", function () {

                        it("should return null", function () {
                            expect(CommonService.findViews(predicate, true)).toEqual(null);
                        });
                    });

                    describe("when firstView is false", function () {

                        it("should return an empty array", function () {
                            expect(CommonService.findViews(predicate, false)).toEqual([]);
                        });
                    });

                    describe("when there is a view with a state we aren't looking for on the root", function () {
                        var decoyView;

                        beforeEach(function () {
                            decoyView = createView("decoyState");

                            rootNavView.append(decoyView);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            decoyView.remove();

                            $rootScope.$digest();
                        });

                        describe("when firstView is true", function () {

                            it("should return null", function () {
                                expect(CommonService.findViews(predicate, true)).toEqual(null);
                            });
                        });

                        describe("when firstView is false", function () {

                            it("should return an empty array", function () {
                                expect(CommonService.findViews(predicate, false)).toEqual([]);
                            });
                        });
                    });
                });

                describe("when there is a view with the specified state at the root", function () {
                    var view;

                    beforeEach(function () {
                        view = createView(state);

                        rootNavView.append(view);

                        $rootScope.$digest();
                    });

                    afterEach(function () {
                        view.remove();

                        $rootScope.$digest();
                    });

                    describe("when firstView is true", function () {

                        it("should return the view", function () {
                            expect(CommonService.findViews(predicate, true)).toEqual(view);
                        });
                    });

                    describe("when firstView is false", function () {

                        it("should return an array containing the view", function () {
                            expect(CommonService.findViews(predicate, false)).toEqual([view]);
                        });
                    });

                    describe("when there is a view with a state we aren't looking for on the root", function () {
                        var decoyView;

                        beforeEach(function () {
                            decoyView = createView("decoyState");

                            rootNavView.append(decoyView);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            decoyView.remove();

                            $rootScope.$digest();
                        });

                        describe("when firstView is true", function () {

                            it("should return the specified view", function () {
                                expect(CommonService.findViews(predicate, true)).toEqual(view);
                            });
                        });

                        describe("when firstView is false", function () {

                            it("should return an array containing only the specified view", function () {
                                expect(CommonService.findViews(predicate, false)).toEqual([view]);
                            });
                        });
                    });
                });

                describe("when there is a nav-view with the specified state at the root with an embedded view",
                    function () {

                        var navView,
                            embeddedView;

                        beforeEach(function () {
                            navView = createNavView(state);
                            embeddedView = createView(state, navView);

                            rootNavView.append(navView);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            navView.remove();

                            $rootScope.$digest();
                        });

                        describe("when firstView is true", function () {

                            it("should return the embedded view", function () {
                                expect(CommonService.findViews(predicate, true)).toEqual(embeddedView);
                            });
                        });

                        describe("when firstView is false", function () {

                            it("should return an array containing the embedded view", function () {
                                expect(CommonService.findViews(predicate, false)).toEqual([embeddedView]);
                            });
                        });

                        describe("when there is a view with a state we aren't looking for on the root", function () {
                            var decoyView;

                            beforeEach(function () {
                                decoyView = createView("decoyState");

                                rootNavView.append(decoyView);

                                $rootScope.$digest();
                            });

                            afterEach(function () {
                                decoyView.remove();

                                $rootScope.$digest();
                            });

                            describe("when firstView is true", function () {

                                it("should return the specified view", function () {
                                    expect(CommonService.findViews(predicate, true)).toEqual(embeddedView);
                                });
                            });

                            describe("when firstView is false", function () {

                                it("should return an array containing only the specified view", function () {
                                    expect(CommonService.findViews(predicate, false)).toEqual([embeddedView]);
                                });
                            });
                        });
                    });

                describe("given a navView that is null", function () {

                    describe("when firstView is true", function () {

                        it("should return null", function () {
                            expect(CommonService.findViews(predicate, true, null)).toEqual(null);
                        });
                    });

                    describe("when firstView is false", function () {

                        it("should return an empty array", function () {
                            expect(CommonService.findViews(predicate, false, null)).toEqual([]);
                        });
                    });
                });

                describe("given a valid navView", function () {

                    describe("when there is a view with the specified state in the navView", function () {
                        var view;

                        beforeEach(function () {
                            view = createView(state);

                            rootNavView.append(view);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            view.remove();

                            $rootScope.$digest();
                        });

                        describe("when firstView is true", function () {

                            it("should return the view", function () {
                                expect(CommonService.findViews(predicate, true, rootNavView)).toEqual(view);
                            });
                        });

                        describe("when firstView is false", function () {

                            it("should return an array containing the view", function () {
                                expect(CommonService.findViews(predicate, false, rootNavView)).toEqual([view]);
                            });
                        });
                    });
                });
            });
        });

        describe("has a findViewsMatching function that", function () {

            describe("when searching for a single state", function () {
                var states = [],
                    state1 = "state1";

                beforeEach(function () {
                    states.push(state1);
                });

                afterEach(function () {
                    states.pop();
                });

                describe("when there is no view at the root", function () {

                    describe("when firstView is true", function () {

                        it("should return null", function () {
                            expect(CommonService.findViewsMatching(states, true)).toEqual(null);
                        });
                    });

                    describe("when firstView is false", function () {

                        it("should return an empty array", function () {
                            expect(CommonService.findViewsMatching(states, false)).toEqual([]);
                        });
                    });

                    describe("when there is a view with a state we aren't looking for on the root", function () {
                        var decoyView;

                        beforeEach(function () {
                            decoyView = createView("decoyState");

                            rootNavView.append(decoyView);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            decoyView.remove();

                            $rootScope.$digest();
                        });

                        describe("when firstView is true", function () {

                            it("should return null", function () {
                                expect(CommonService.findViewsMatching(states, true)).toEqual(null);
                            });
                        });

                        describe("when firstView is false", function () {

                            it("should return an empty array", function () {
                                expect(CommonService.findViewsMatching(states, false)).toEqual([]);
                            });
                        });
                    });
                });

                describe("when there is a view with the specified state at the root", function () {
                    var view;

                    beforeEach(function () {
                        view = createView(state1);

                        rootNavView.append(view);

                        $rootScope.$digest();
                    });

                    afterEach(function () {
                        view.remove();

                        $rootScope.$digest();
                    });

                    describe("when firstView is true", function () {

                        it("should return the view", function () {
                            expect(CommonService.findViewsMatching(states, true)).toEqual(view);
                        });
                    });

                    describe("when firstView is false", function () {

                        it("should return an array containing the view", function () {
                            expect(CommonService.findViewsMatching(states, false)).toEqual([view]);
                        });
                    });

                    describe("when there is a view with a state we aren't looking for on the root", function () {
                        var decoyView;

                        beforeEach(function () {
                            decoyView = createView("decoyState");

                            rootNavView.append(decoyView);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            decoyView.remove();

                            $rootScope.$digest();
                        });

                        describe("when firstView is true", function () {

                            it("should return the specified view", function () {
                                expect(CommonService.findViewsMatching(states, true)).toEqual(view);
                            });
                        });

                        describe("when firstView is false", function () {

                            it("should return an array containing only the specified view", function () {
                                expect(CommonService.findViewsMatching(states, false)).toEqual([view]);
                            });
                        });
                    });
                });

                describe("when there is a nav-view with the specified state at the root with an embedded view",
                    function () {

                        var navView,
                            embeddedView;

                        beforeEach(function () {
                            navView = createNavView(state1);
                            embeddedView = createView(state1, navView);

                            rootNavView.append(navView);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            navView.remove();

                            $rootScope.$digest();
                        });

                        describe("when firstView is true", function () {

                            it("should return the embedded view", function () {
                                expect(CommonService.findViewsMatching(states, true)).toEqual(embeddedView);
                            });
                        });

                        describe("when firstView is false", function () {

                            it("should return an array containing the embedded view", function () {
                                expect(CommonService.findViewsMatching(states, false)).toEqual([embeddedView]);
                            });
                        });

                        describe("when there is a view with a state we aren't looking for on the root", function () {
                            var decoyView;

                            beforeEach(function () {
                                decoyView = createView("decoyState");

                                rootNavView.append(decoyView);

                                $rootScope.$digest();
                            });

                            afterEach(function () {
                                decoyView.remove();

                                $rootScope.$digest();
                            });

                            describe("when firstView is true", function () {

                                it("should return the specified view", function () {
                                    expect(CommonService.findViewsMatching(states, true)).toEqual(embeddedView);
                                });
                            });

                            describe("when firstView is false", function () {

                                it("should return an array containing only the specified view", function () {
                                    expect(CommonService.findViewsMatching(states, false)).toEqual([embeddedView]);
                                });
                            });
                        });
                    });

                describe("given a navView that is null", function () {

                    describe("when firstView is true", function () {

                        it("should return null", function () {
                            expect(CommonService.findViewsMatching(states, true, null)).toEqual(null);
                        });
                    });

                    describe("when firstView is false", function () {

                        it("should return an empty array", function () {
                            expect(CommonService.findViewsMatching(states, false, null)).toEqual([]);
                        });
                    });
                });

                describe("given a valid navView", function () {

                    describe("when there is a view with the specified state in the navView", function () {
                        var view;

                        beforeEach(function () {
                            view = createView(state1);

                            rootNavView.append(view);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            view.remove();

                            $rootScope.$digest();
                        });

                        describe("when firstView is true", function () {

                            it("should return the view", function () {
                                expect(CommonService.findViewsMatching(states, true, rootNavView)).toEqual(view);
                            });
                        });

                        describe("when firstView is false", function () {

                            it("should return an array containing the view", function () {
                                expect(CommonService.findViewsMatching(states, false, rootNavView)).toEqual([view]);
                            });
                        });
                    });
                });

                describe("when also searching for a second state", function () {
                    var state2 = "state2";

                    beforeEach(function () {
                        states.push(state2);
                    });

                    afterEach(function () {
                        states.pop();
                    });

                    describe("when views with both specified states are present on the root", function () {
                        var view1, view2;

                        beforeEach(function () {
                            view1 = createView(state1);
                            view2 = createView(state2);

                            rootNavView.append(view1);
                            rootNavView.append(view2);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            view1.remove();
                            view2.remove();

                            $rootScope.$digest();
                        });

                        describe("when firstView is true", function () {

                            it("should return the first view", function () {
                                expect(CommonService.findViewsMatching(states, true)).toEqual(view1);
                            });
                        });

                        describe("when firstView is false", function () {

                            it("should return an array containing the first and second views", function () {
                                expect(CommonService.findViewsMatching(states, false)).toEqual([view1, view2]);
                            });
                        });

                        describe("when there is a view with a state we aren't looking for on the root", function () {
                            var decoyView;

                            beforeEach(function () {
                                decoyView = createView("decoyState");

                                rootNavView.append(decoyView);

                                $rootScope.$digest();
                            });

                            afterEach(function () {
                                decoyView.remove();

                                $rootScope.$digest();
                            });

                            describe("when firstView is true", function () {

                                it("should return the first view", function () {
                                    expect(CommonService.findViewsMatching(states, true)).toEqual(view1);
                                });
                            });

                            describe("when firstView is false", function () {

                                it("should return an array containing the first and second views", function () {
                                    expect(CommonService.findViewsMatching(states, false)).toEqual([view1, view2]);
                                });
                            });
                        });
                    });

                    describe([
                        "when there is a nav-view at the root that has the first specified state with an embedded view",
                        "and there is a nav-view at the root that has the second specified state with an embedded view"
                    ].join(), function () {
                        var navView1,
                            embeddedView1,
                            navView2,
                            embeddedView2;

                        beforeEach(function () {
                            navView1 = createNavView(state1);
                            embeddedView1 = createView(state1, navView1);

                            navView2 = createNavView(state2);
                            embeddedView2 = createView(state2, navView2);

                            rootNavView.append(navView1);
                            rootNavView.append(navView2);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            navView1.remove();
                            navView2.remove();

                            $rootScope.$digest();
                        });

                        describe("when firstView is true", function () {

                            it("should return the first embedded view", function () {
                                expect(CommonService.findViewsMatching(states, true)).toEqual(embeddedView1);
                            });
                        });

                        describe("when firstView is false", function () {

                            it("should return an array containing the first and second embedded views", function () {
                                expect(CommonService.findViewsMatching(states, false)).toEqual([
                                    embeddedView1,
                                    embeddedView2
                                ]);
                            });
                        });

                        describe("when there is a view with a state we aren't looking for on the root", function () {
                            var decoyView;

                            beforeEach(function () {
                                decoyView = createView("decoyState");

                                rootNavView.append(decoyView);

                                $rootScope.$digest();
                            });

                            afterEach(function () {
                                decoyView.remove();

                                $rootScope.$digest();
                            });

                            describe("when firstView is true", function () {

                                it("should return the first embedded view", function () {
                                    expect(CommonService.findViewsMatching(states, true)).toEqual(embeddedView1);
                                });
                            });

                            describe("when firstView is false", function () {

                                it("should return an array containing the first and second embedded views", function () {
                                    expect(CommonService.findViewsMatching(states, false)).toEqual([
                                        embeddedView1,
                                        embeddedView2
                                    ]);
                                });
                            });
                        });
                    });

                    //TODO tests for when there is no stage view on the root nav-view

                    //TODO tests for when there is no active view on the root nav-view

                    //TODO tests for when passing the navView argument
                });
            });
        });

        describe("has a findViewByState function that", function () {
            var state = "mockState";

            describe("when searching for the specified state", function () {

                describe("when there is no view at the root", function () {

                    it("should return null", function () {
                        expect(CommonService.findViewByState(state)).toEqual(null);
                    });

                    describe("when there is a view with a state we aren't looking for on the root", function () {
                        var decoyView;

                        beforeEach(function () {
                            decoyView = createView("decoyState");

                            rootNavView.append(decoyView);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            decoyView.remove();

                            $rootScope.$digest();
                        });

                        it("should return null", function () {
                            expect(CommonService.findViewByState(state)).toEqual(null);
                        });
                    });
                });

                describe("when there is a view with the specified state at the root", function () {
                    var view;

                    beforeEach(function () {
                        view = createView(state);

                        rootNavView.append(view);

                        $rootScope.$digest();
                    });

                    afterEach(function () {
                        view.remove();

                        $rootScope.$digest();
                    });

                    it("should return the view", function () {
                        expect(CommonService.findViewByState(state)).toEqual(view);
                    });

                    describe("when there is a view with a state we aren't looking for on the root", function () {
                        var decoyView;

                        beforeEach(function () {
                            decoyView = createView("decoyState");

                            rootNavView.append(decoyView);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            decoyView.remove();

                            $rootScope.$digest();
                        });

                        it("should return the specified view", function () {
                            expect(CommonService.findViewByState(state)).toEqual(view);
                        });

                    });
                });

                describe("when there is a nav-view with the specified state at the root with an embedded view",
                    function () {

                        var navView,
                            embeddedView;

                        beforeEach(function () {
                            navView = createNavView(state);
                            embeddedView = createView(state, navView);

                            rootNavView.append(navView);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            navView.remove();

                            $rootScope.$digest();
                        });

                        it("should return the embedded view", function () {
                            expect(CommonService.findViewByState(state)).toEqual(embeddedView);
                        });

                        describe("when there is a view with a state we aren't looking for on the root", function () {
                            var decoyView;

                            beforeEach(function () {
                                decoyView = createView("decoyState");

                                rootNavView.append(decoyView);

                                $rootScope.$digest();
                            });

                            afterEach(function () {
                                decoyView.remove();

                                $rootScope.$digest();
                            });

                            it("should return the specified view", function () {
                                expect(CommonService.findViewByState(state)).toEqual(embeddedView);
                            });
                        });
                    });

                describe("given a navView that is null", function () {

                    it("should return null", function () {
                        expect(CommonService.findViewByState(state, null)).toEqual(null);
                    });
                });

                describe("given a valid navView", function () {

                    describe("when there is a view with the specified state in the navView", function () {
                        var view;

                        beforeEach(function () {
                            view = createView(state);

                            rootNavView.append(view);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            view.remove();

                            $rootScope.$digest();
                        });

                        it("should return the view", function () {
                            expect(CommonService.findViewByState(state, rootNavView)).toEqual(view);
                        });
                    });
                });
            });
        });

        describe("has a findViewByStatesInOrder function that", function () {

            describe("when searching for two states", function () {
                var state1 = "state1",
                    state2 = "state2",
                    states = [state1, state2];

                describe("when there is no view at the root", function () {

                    it("should return null", function () {
                        expect(CommonService.findViewByStatesInOrder(states)).toEqual(null);
                    });

                    describe("when there is a view with a state we aren't looking for on the root", function () {
                        var decoyView;

                        beforeEach(function () {
                            decoyView = createView("decoyState");

                            rootNavView.append(decoyView);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            decoyView.remove();

                            $rootScope.$digest();
                        });

                        it("should return null", function () {
                            expect(CommonService.findViewByStatesInOrder(states)).toEqual(null);
                        });
                    });
                });

                describe("when only a view with the first state is present", function () {
                    var view1;

                    beforeEach(function () {
                        view1 = createView(state1);

                        rootNavView.append(view1);

                        $rootScope.$digest();
                    });

                    afterEach(function () {
                        view1.remove();

                        $rootScope.$digest();
                    });

                    it("should return the view", function () {
                        expect(CommonService.findViewByStatesInOrder(states)).toEqual(view1);
                    });

                    describe("when there is a view with a state we aren't looking for on the root", function () {
                        var decoyView;

                        beforeEach(function () {
                            decoyView = createView("decoyState");

                            rootNavView.append(decoyView);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            decoyView.remove();

                            $rootScope.$digest();
                        });

                        it("should return the specified view", function () {
                            expect(CommonService.findViewByStatesInOrder(states)).toEqual(view1);
                        });
                    });
                });

                describe("when only a view with the second state is present", function () {
                    var view2;

                    beforeEach(function () {
                        view2 = createView(state2);

                        rootNavView.append(view2);

                        $rootScope.$digest();
                    });

                    afterEach(function () {
                        view2.remove();

                        $rootScope.$digest();
                    });

                    it("should return the view", function () {
                        expect(CommonService.findViewByStatesInOrder(states)).toEqual(view2);
                    });

                    describe("when there is a view with a state we aren't looking for on the root", function () {
                        var decoyView;

                        beforeEach(function () {
                            decoyView = createView("decoyState");

                            rootNavView.append(decoyView);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            decoyView.remove();

                            $rootScope.$digest();
                        });

                        it("should return the specified view", function () {
                            expect(CommonService.findViewByStatesInOrder(states)).toEqual(view2);
                        });
                    });
                });

                describe("when views with both states are present", function () {
                    var view1, view2;

                    beforeEach(function () {
                        view1 = createView(state1);
                        view2 = createView(state2);

                        rootNavView.append(view1);
                        rootNavView.append(view2);

                        $rootScope.$digest();
                    });

                    afterEach(function () {
                        view1.remove();
                        view2.remove();

                        $rootScope.$digest();
                    });

                    it("should return the first view", function () {
                        expect(CommonService.findViewByStatesInOrder(states)).toEqual(view1);
                    });

                    describe("when there is a view with a state we aren't looking for on the root", function () {
                        var decoyView;

                        beforeEach(function () {
                            decoyView = createView("decoyState");

                            rootNavView.append(decoyView);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            decoyView.remove();

                            $rootScope.$digest();
                        });

                        it("should return the first specified view", function () {
                            expect(CommonService.findViewByStatesInOrder(states)).toEqual(view1);
                        });
                    });
                });

                describe("when there are nav-views with both specified states at the root with embedded views",
                    function () {

                        var navView1,
                            embeddedView1,
                            navView2,
                            embeddedView2;

                        beforeEach(function () {
                            navView1 = createNavView(state1);
                            navView2 = createNavView(state2);

                            rootNavView.append(navView1);
                            rootNavView.append(navView2);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            navView1.remove();
                            navView2.remove();

                            $rootScope.$digest();
                        });

                        describe("when the embedded views contain the same state types", function () {

                            beforeEach(function () {
                                embeddedView1 = createView(state1, navView1);
                                embeddedView2 = createView(state2, navView2);

                                $rootScope.$digest();
                            });

                            it("should return the first embedded view", function () {
                                expect(CommonService.findViewByStatesInOrder(states)).toEqual(embeddedView1);
                            });

                            describe("when there is a view with a state we aren't looking for on the root", function () {
                                var decoyView;

                                beforeEach(function () {
                                    decoyView = createView("decoyState");

                                    rootNavView.append(decoyView);

                                    $rootScope.$digest();
                                });

                                afterEach(function () {
                                    decoyView.remove();

                                    $rootScope.$digest();
                                });

                                it("should return the first specified view", function () {
                                    expect(CommonService.findViewByStatesInOrder(states)).toEqual(embeddedView1);
                                });
                            });
                        });

                        describe("when the embedded views contain 'opposite' state types", function () {

                            beforeEach(function () {
                                embeddedView1 = createView(state2, navView1);
                                embeddedView2 = createView(state1, navView2);

                                $rootScope.$digest();
                            });

                            it("should return the second opposite embedded view", function () {
                                expect(CommonService.findViewByStatesInOrder(states)).toEqual(embeddedView2);
                            });

                            describe("when there is a view with a state we aren't looking for on the root", function () {
                                var decoyView;

                                beforeEach(function () {
                                    decoyView = createView("decoyState");

                                    rootNavView.append(decoyView);

                                    $rootScope.$digest();
                                });

                                afterEach(function () {
                                    decoyView.remove();

                                    $rootScope.$digest();
                                });

                                it("should return the second specified opposite view", function () {
                                    expect(CommonService.findViewByStatesInOrder(states)).toEqual(embeddedView2);
                                });
                            });
                        });
                    });

                describe("given a navView that is null", function () {

                    it("should return null", function () {
                        expect(CommonService.findViewByStatesInOrder(states, null)).toEqual(null);
                    });
                });

                describe("given a valid navView", function () {

                    describe("when only a view with the first state is present", function () {
                        var view1;

                        beforeEach(function () {
                            view1 = createView(state1);

                            rootNavView.append(view1);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            view1.remove();

                            $rootScope.$digest();
                        });

                        it("should return the view", function () {
                            expect(CommonService.findViewByStatesInOrder(states, rootNavView)).toEqual(view1);
                        });

                        describe("when there is a view with a state we aren't looking for on the root", function () {
                            var decoyView;

                            beforeEach(function () {
                                decoyView = createView("decoyState");

                                rootNavView.append(decoyView);

                                $rootScope.$digest();
                            });

                            afterEach(function () {
                                decoyView.remove();

                                $rootScope.$digest();
                            });

                            it("should return the specified view", function () {
                                expect(CommonService.findViewByStatesInOrder(states, rootNavView)).toEqual(view1);
                            });
                        });
                    });

                    //TODO additional tests for when passed a navView
                });

                //TODO tests for when there is only an embedded view for the first state

                //TODO tests for when there is only an embedded view for the second state
            });
        });

        describe("has a getFocusedView function that", function () {

            //TODO figure out a way to test this
            xit("should call findViewByStatesInOrder with the expected values", function () {
            });

            //TODO additional tests
        });

        describe("has a getViewContent function that", function () {

            describe("when the focused view has no content", function () {
                var view;

                beforeEach(function () {
                    view = createView("active", rootNavView);
                });

                afterEach(function () {
                    view.remove();
                });

                it("should return null", function () {
                    expect(CommonService.getViewContent()).toEqual(null);
                });
            });

            describe("when the focused view has content", function () {
                var view,
                    content;

                beforeEach(function () {
                    view = createView("active", rootNavView);
                    content = $compile("<ion-content></ion-content>")($rootScope);

                    view.append(content);

                    $rootScope.$digest();
                });

                afterEach(function () {
                    view.remove();

                    $rootScope.$digest();
                });

                it("should return the content", function () {
                    expect(CommonService.getViewContent()).toEqual(content);
                });
            });

            describe("when passed a null view", function () {

                it("should return null", function () {
                    expect(CommonService.getViewContent(null)).toEqual(null);
                });
            });

            describe("when passed a valid view", function () {
                var view;

                describe("when the view has no content", function () {

                    beforeEach(function () {
                        view = createView("mockState");
                    });

                    afterEach(function () {
                        view.remove();
                    });

                    it("should return null", function () {
                        expect(CommonService.getViewContent(view)).toEqual(null);
                    });
                });

                describe("when the view has content", function () {
                    var content;

                    beforeEach(function () {
                        view = createView("mockState");
                        content = $compile("<ion-content></ion-content>")($rootScope);

                        view.append(content);

                        $rootScope.$digest();
                    });

                    afterEach(function () {
                        view.remove();

                        $rootScope.$digest();
                    });

                    it("should return the content", function () {
                        expect(CommonService.getViewContent(view)).toEqual(content);
                    });
                });
            });
        });

        //TODO
        xdescribe("has a findActiveBackButton function that", function () {
        });

        //TODO
        xdescribe("has a findBackButton function that", function () {
        });

        //TODO
        xdescribe("has a findCachedBackButton function that", function () {
        });

        //TODO
        xdescribe("has a findNavBarByStatesInOrder function that", function () {
        });

        describe("has a getFocusedNavBar function that", function () {

            beforeEach(function () {
                CommonService.getFocusedNavBar();
            });

            //TODO figure out how to test this
            xit("should call findNavBarByStatesInOrder with the expected values", function () {
            });
        });

        describe("has a getUnfocusedNavBar function that", function () {

            beforeEach(function () {
                CommonService.getUnfocusedNavBar();
            });

            //TODO figure out how to test this
            xit("should call findNavBarByStatesInOrder with the expected values", function () {
            });
        });

        describe("has a getUnfocusedView function that", function () {

            describe("when passed a navView", function () {
                var mockNavView;

                beforeEach(function () {
                    mockNavView = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                    CommonService.getUnfocusedView(mockNavView);
                });

                //TODO figure out how to test this
                xit("should call findViewByStatesInOrder with the expected values", function () {
                });
            });

            describe("when NOT passed a navView", function () {
                beforeEach(function () {
                    CommonService.getUnfocusedView();
                });

                //TODO figure out how to test this
                xit("should call findViewByStatesInOrder with the expected values", function () {
                });
            });
        });

        describe("has an isPoBox function that", function () {

            it("should return false when value is null", function () {
                expect(CommonService.isPoBox(null)).toBeFalsy();
            });

            it("should return false when value is an empty string", function () {
                expect(CommonService.isPoBox("")).toBeFalsy();
            });

            it("should return false when value is an object", function () {
                expect(CommonService.isPoBox({})).toBeFalsy();
            });

            it("should return false when value is an array", function () {
                expect(CommonService.isPoBox([])).toBeFalsy();
            });

            it("should return false when value is a boolean", function () {
                expect(CommonService.isPoBox(TestUtils.getRandomBoolean())).toBeFalsy();
            });

            it("should return false when value is a number", function () {
                expect(CommonService.isPoBox(TestUtils.getRandomNumber(0, 100))).toBeFalsy();
            });

            it("should return true for acceptable values", function () {
                _.forEach(poBoxAcceptableValues, function(value) {
                    expect(CommonService.isPoBox(value)).toBeTruthy();
                });
            });

            it("should return false for unacceptable values", function () {
                _.forEach(poBoxUnacceptableValues, function(value) {
                    expect(CommonService.isPoBox(value)).toBeFalsy();
                });
            });

            it("should return false for strings starting with a number", function () {
                var string = TestUtils.getRandomInteger(1, 1000) + TestUtils.getRandomStringThatIsAlphaNumeric(50);

                expect(CommonService.isPoBox(string)).toBeFalsy();
            });
        });
    });

    function createNavView(state) {
        return $compile("<ion-nav-view nav-view='" + state + "'></ion-nav-view>")($rootScope);
    }

    function createView(state, parent) {
        var view = $compile("<ion-view nav-view='" + state + "'></ion-view>")($rootScope);

        if (parent) {
            parent.append(view);
        }

        $rootScope.$digest();

        return view;
    }
})();