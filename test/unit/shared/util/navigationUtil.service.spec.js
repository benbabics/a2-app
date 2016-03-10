(function () {
    "use strict";

    describe("A NavigationUtil service", function () {

        var NavigationUtil,
            $state,
            mockGlobals = {
                LOGIN_STATE: TestUtils.getRandomStringThatIsAlphaNumeric(10)
            };

        beforeEach(function () {

            module("app.shared");

            module(function ($provide, sharedGlobals) {
                $provide.constant("globals", angular.extend({}, sharedGlobals, mockGlobals));
            });

            inject(function (_$state_, _NavigationUtil_) {
                NavigationUtil = _NavigationUtil_;
                $state = _$state_;
            });

            spyOn($state, "go").and.callThrough();
        });

        describe("has an exitApp function that", function () {

            beforeEach(function () {
                $state.go.and.stub();
            });

            describe("when on a platform that supports app self-termination", function () {

                beforeEach(function () {
                    navigator.app = jasmine.createSpyObj("navigator.app", ["exitApp"]);
                });

                beforeEach(function () {
                    NavigationUtil.exitApp();
                });

                it("should call navigator.app.exitApp()", function () {
                    expect(navigator.app.exitApp).toHaveBeenCalledWith();
                });

                it("should redirect to the login state", function () {
                    expect($state.go).toHaveBeenCalledWith(mockGlobals.LOGIN_STATE);
                });
            });

            describe("when NOT on a platform that supports app self-termination", function () {

                beforeEach(function () {
                    delete navigator.app;
                });

                beforeEach(function () {
                    NavigationUtil.exitApp();
                });

                it("should redirect to the login state", function () {
                    expect($state.go).toHaveBeenCalledWith(mockGlobals.LOGIN_STATE);
                });
            });
        });

        describe("has a goToBackState function that", function () {
            var backButton,
                isolateScope,
                result;

            beforeEach(function () {
                backButton = jasmine.createSpyObj("BackButton", ["isolateScope"]);
                isolateScope = jasmine.createSpyObj("IsolateScope", ["goBack"]);
            });

            describe("when given a back button", function () {

                describe("when the given back button is valid", function () {

                    describe("when the given back button has an isolate scope", function () {

                        beforeEach(function () {
                            backButton.isolateScope.and.returnValue(isolateScope);
                        });

                        beforeEach(function () {
                            result = NavigationUtil.goToBackState(backButton);
                        });

                        it("should call the back button's goBack function", function () {
                            expect(isolateScope.goBack).toHaveBeenCalledWith();
                        });

                        it("should return true", function () {
                            expect(result).toBeTruthy();
                        });
                    });

                    describe("when the given back button does NOT have an isolate scope", function () {

                        it("should throw an error", function () {
                            expect(function () {
                                NavigationUtil.goToBackState(backButton);
                            }).toThrowError("Couldn't find the back button to go the back state");
                        });
                    });
                });

                describe("when the given back button is NOT valid", function () {

                    beforeEach(function () {
                        backButton = null;
                    });

                    it("should throw an error", function () {
                        expect(function () {
                            NavigationUtil.goToBackState(backButton);
                        }).toThrowError("Couldn't find the back button to go the back state");
                    });
                });
            });

            describe("when NOT given a back button", function () {

                xdescribe("when an active back button is found", function () {

                    beforeEach(function () {
                        //TODO - figure out how to set this test up
                    });

                    describe("when the active back button has an accessible isolate scope", function () {

                        beforeEach(function () {
                            backButton.isolateScope.and.returnValue(isolateScope);
                        });

                        beforeEach(function () {
                            result = NavigationUtil.goToBackState();
                        });

                        it("should call the back button's goBack function", function () {
                            expect(isolateScope.goBack).toHaveBeenCalledWith();
                        });

                        it("should return true", function () {
                            expect(result).toBeTruthy();
                        });
                    });

                    describe("when the active back button does NOT have an accessible isolate scope", function () {

                        it("should throw an error", function () {
                            expect(NavigationUtil.goToBackState).toThrowError("Couldn't find the back button to go the back state");
                        });
                    });
                });

                describe("when an active back button is NOT found", function () {

                    it("should throw an error", function () {
                        expect(NavigationUtil.goToBackState).toThrowError("Couldn't find the back button to go the back state");
                    });
                });
            });
        });
    });
})();
