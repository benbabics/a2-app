(function () {
    "use strict";

    describe("A FlowUtil service", function () {

        var FlowUtil,
            $rootScope,
            $state,
            mockGlobals = {
                LOGIN_STATE: TestUtils.getRandomStringThatIsAlphaNumeric(10)
            };

        beforeAll(function () {
            this.includeAppDependencies = false;
        });

        beforeEach(function () {

            module(function ($provide, sharedGlobals) {
                $provide.constant("globals", angular.extend({}, sharedGlobals, mockGlobals));
            });

            inject(function (_$rootScope_, _$state_, _FlowUtil_) {
                FlowUtil = _FlowUtil_;
                $state = _$state_;
                $rootScope = _$rootScope_;
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
                    FlowUtil.exitApp();
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
                    FlowUtil.exitApp();
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
                            result = FlowUtil.goToBackState(backButton);
                        });

                        it("should call the back button's goBack function", function () {
                            expect(isolateScope.goBack).toHaveBeenCalledWith();
                        });

                        it("should return true", function () {
                            expect(result).toBeTruthy();
                        });
                    });

                    describe("when the given back button does NOT have an isolate scope", function () {

                        it("should return false", function () {
                            expect(FlowUtil.goToBackState(backButton)).toBeFalsy();
                        });
                    });
                });

                describe("when the given back button is NOT valid", function () {

                    beforeEach(function () {
                        backButton = null;
                    });

                    it("should return false", function () {
                        expect(FlowUtil.goToBackState(backButton)).toBeFalsy();
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
                            result = FlowUtil.goToBackState();
                        });

                        it("should call the back button's goBack function", function () {
                            expect(isolateScope.goBack).toHaveBeenCalledWith();
                        });

                        it("should return true", function () {
                            expect(result).toBeTruthy();
                        });
                    });

                    describe("when the active back button does NOT have an accessible isolate scope", function () {

                        it("should return false", function () {
                            expect(FlowUtil.goToBackState()).toBeFalsy();
                        });
                    });
                });

                describe("when an active back button is NOT found", function () {

                    it("should return false", function () {
                        expect(FlowUtil.goToBackState()).toBeFalsy();
                    });
                });
            });
        });

        describe("has an onPageEnter function that", function () {
            var callback;

            beforeEach(function () {
                callback = jasmine.createSpy("callback");

                spyOn($rootScope, "$on").and.callThrough();
            });

            describe("when given a scope", function () {
                var scope,
                    options,
                    result;

                beforeEach(function () {
                    scope = $rootScope.$new();
                    options = {};
                });

                describe("when the 'global' option is true", function () {

                    beforeEach(function () {
                        options.global = true;
                    });

                    describe("when the 'once' option is true", function () {

                        beforeEach(function () {
                            options.once = true;
                        });

                        beforeEach(function () {
                            result = FlowUtil.onPageEnter(callback, scope, options);
                        });

                        it("should set a listener on scope for $ionicView.enter", function () {
                            expect(scope.$on).toHaveBeenCalledWith("$ionicView.enter", jasmine.any(Function));
                        });

                        it("should set a listener on scope for $ionicView.afterEnter", function () {
                            expect(scope.$on).toHaveBeenCalledWith("$ionicView.afterEnter", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $ionicView.enter", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.enter", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $ionicView.afterEnter", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.afterEnter", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $stateChangeSuccess", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$stateChangeSuccess", jasmine.any(Function));
                        });

                        it("should return an array of remove functions for the listeners", function () {
                            expect(_.isArray(result)).toBeTruthy();
                            expect(result.length).toEqual(5);
                        });

                        describe("when one of the events being listened for is fired", function () {
                            var mockStateInfo;

                            beforeEach(function () {
                                mockStateInfo = {stateName: TestUtils.getRandomStringThatIsAlphaNumeric(10)};

                                $rootScope.$broadcast("$ionicView.enter", mockStateInfo);
                                $rootScope.$digest();
                            });

                            it("should invoke the callback", function () {
                                expect(callback).toHaveBeenCalledWith(mockStateInfo.stateName);
                            });

                            it("should remove all of the listeners", function () {
                                //TODO - Figure out how to test this
                            });

                            describe("when another event is subsequently fired", function () {

                                beforeEach(function () {
                                    $rootScope.$broadcast("$ionicView.afterEnter", mockStateInfo);
                                    $rootScope.$digest();
                                });

                                it("should NOT invoke the callback again", function () {
                                    expect(callback.calls.count()).toEqual(1);
                                });
                            });
                        });
                    });

                    describe("when the 'once' option is false", function () {

                        beforeEach(function () {
                            options.once = false;
                        });

                        beforeEach(function () {
                            result = FlowUtil.onPageEnter(callback, scope, options);
                        });

                        it("should set a listener on scope for $ionicView.enter", function () {
                            expect(scope.$on).toHaveBeenCalledWith("$ionicView.enter", jasmine.any(Function));
                        });

                        it("should set a listener on scope for $ionicView.afterEnter", function () {
                            expect(scope.$on).toHaveBeenCalledWith("$ionicView.afterEnter", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $ionicView.enter", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.enter", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $ionicView.afterEnter", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.afterEnter", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $stateChangeSuccess", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$stateChangeSuccess", jasmine.any(Function));
                        });

                        it("should return an array of remove functions for the listeners", function () {
                            expect(_.isArray(result)).toBeTruthy();
                            expect(result.length).toEqual(5);
                        });

                        describe("when one of the events being listened for is fired", function () {
                            var mockStateInfo;

                            beforeEach(function () {
                                mockStateInfo = {stateName: TestUtils.getRandomStringThatIsAlphaNumeric(10)};

                                scope.$broadcast("$ionicView.enter", mockStateInfo);
                                $rootScope.$digest();
                            });

                            it("should invoke the callback", function () {
                                expect(callback).toHaveBeenCalledWith(mockStateInfo.stateName);
                            });

                            it("should NOT remove all of the listeners", function () {
                                //TODO - Figure out how to test this
                            });

                            describe("when another event is subsequently fired", function () {

                                beforeEach(function () {
                                    scope.$broadcast("$ionicView.afterEnter", mockStateInfo);
                                    $rootScope.$digest();
                                });

                                it("should invoke the callback again", function () {
                                    expect(callback.calls.count()).toEqual(2);
                                });
                            });
                        });
                    });

                    describe("when the 'once' option is undefined", function () {

                        beforeEach(function () {
                            delete options.once;
                        });

                        beforeEach(function () {
                            result = FlowUtil.onPageEnter(callback, scope, options);
                        });

                        it("should set a listener on scope for $ionicView.enter", function () {
                            expect(scope.$on).toHaveBeenCalledWith("$ionicView.enter", jasmine.any(Function));
                        });

                        it("should set a listener on scope for $ionicView.afterEnter", function () {
                            expect(scope.$on).toHaveBeenCalledWith("$ionicView.afterEnter", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $ionicView.enter", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.enter", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $ionicView.afterEnter", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.afterEnter", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $stateChangeSuccess", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$stateChangeSuccess", jasmine.any(Function));
                        });

                        it("should return an array of remove functions for the listeners", function () {
                            expect(_.isArray(result)).toBeTruthy();
                            expect(result.length).toEqual(5);
                        });

                        describe("when one of the events being listened for is fired", function () {
                            var mockStateInfo;

                            beforeEach(function () {
                                mockStateInfo = {stateName: TestUtils.getRandomStringThatIsAlphaNumeric(10)};

                                $rootScope.$broadcast("$ionicView.enter", mockStateInfo);
                                $rootScope.$digest();
                            });

                            it("should invoke the callback", function () {
                                expect(callback).toHaveBeenCalledWith(mockStateInfo.stateName);
                            });

                            it("should remove all of the listeners", function () {
                                //TODO - Figure out how to test this
                            });

                            describe("when another event is subsequently fired", function () {

                                beforeEach(function () {
                                    $rootScope.$broadcast("$ionicView.afterEnter", mockStateInfo);
                                    $rootScope.$digest();
                                });

                                it("should NOT invoke the callback again", function () {
                                    expect(callback.calls.count()).toEqual(1);
                                });
                            });
                        });
                    });
                });

                describe("when the 'global' option is false", function () {

                    beforeEach(function () {
                        options.global = false;
                    });

                    describe("when the 'once' option is true", function () {

                        beforeEach(function () {
                            options.once = true;
                        });

                        beforeEach(function () {
                            result = FlowUtil.onPageEnter(callback, scope, options);
                        });

                        it("should set a listener on scope for $ionicView.enter", function () {
                            expect(scope.$on).toHaveBeenCalledWith("$ionicView.enter", jasmine.any(Function));
                        });

                        it("should set a listener on scope for $ionicView.afterEnter", function () {
                            expect(scope.$on).toHaveBeenCalledWith("$ionicView.afterEnter", jasmine.any(Function));
                        });

                        it("should return an array of remove functions for the listeners", function () {
                            expect(_.isArray(result)).toBeTruthy();
                            expect(result.length).toEqual(2);
                        });

                        describe("when one of the events being listened for is fired", function () {
                            var mockStateInfo;

                            beforeEach(function () {
                                mockStateInfo = {stateName: TestUtils.getRandomStringThatIsAlphaNumeric(10)};

                                scope.$broadcast("$ionicView.enter", mockStateInfo);
                                $rootScope.$digest();
                            });

                            it("should invoke the callback", function () {
                                expect(callback).toHaveBeenCalledWith(mockStateInfo.stateName);
                            });

                            it("should remove all of the listeners", function () {
                                //TODO - Figure out how to test this
                            });

                            describe("when another event is subsequently fired", function () {

                                beforeEach(function () {
                                    scope.$broadcast("$ionicView.afterEnter", mockStateInfo);
                                    $rootScope.$digest();
                                });

                                it("should NOT invoke the callback again", function () {
                                    expect(callback.calls.count()).toEqual(1);
                                });
                            });
                        });
                    });

                    describe("when the 'once' option is false", function () {

                        beforeEach(function () {
                            options.once = false;
                        });

                        beforeEach(function () {
                            result = FlowUtil.onPageEnter(callback, scope, options);
                        });

                        it("should set a listener on scope for $ionicView.enter", function () {
                            expect(scope.$on).toHaveBeenCalledWith("$ionicView.enter", jasmine.any(Function));
                        });

                        it("should set a listener on scope for $ionicView.afterEnter", function () {
                            expect(scope.$on).toHaveBeenCalledWith("$ionicView.afterEnter", jasmine.any(Function));
                        });

                        it("should return an array of remove functions for the listeners", function () {
                            expect(_.isArray(result)).toBeTruthy();
                            expect(result.length).toEqual(2);
                        });

                        describe("when one of the events being listened for is fired", function () {
                            var mockStateInfo;

                            beforeEach(function () {
                                mockStateInfo = {stateName: TestUtils.getRandomStringThatIsAlphaNumeric(10)};

                                scope.$broadcast("$ionicView.enter", mockStateInfo);
                                $rootScope.$digest();
                            });

                            it("should invoke the callback", function () {
                                expect(callback).toHaveBeenCalledWith(mockStateInfo.stateName);
                            });

                            it("should NOT remove all of the listeners", function () {
                                //TODO - Figure out how to test this
                            });

                            describe("when another event is subsequently fired", function () {

                                beforeEach(function () {
                                    scope.$broadcast("$ionicView.afterEnter", mockStateInfo);
                                    $rootScope.$digest();
                                });

                                it("should invoke the callback again", function () {
                                    expect(callback.calls.count()).toEqual(2);
                                });
                            });
                        });
                    });

                    describe("when the 'once' option is undefined", function () {

                        beforeEach(function () {
                            delete options.once;
                        });

                        beforeEach(function () {
                            result = FlowUtil.onPageEnter(callback, scope, options);
                        });

                        it("should set a listener on scope for $ionicView.enter", function () {
                            expect(scope.$on).toHaveBeenCalledWith("$ionicView.enter", jasmine.any(Function));
                        });

                        it("should set a listener on scope for $ionicView.afterEnter", function () {
                            expect(scope.$on).toHaveBeenCalledWith("$ionicView.afterEnter", jasmine.any(Function));
                        });

                        it("should return an array of remove functions for the listeners", function () {
                            expect(_.isArray(result)).toBeTruthy();
                            expect(result.length).toEqual(2);
                        });

                        describe("when one of the events being listened for is fired", function () {
                            var mockStateInfo;

                            beforeEach(function () {
                                mockStateInfo = {stateName: TestUtils.getRandomStringThatIsAlphaNumeric(10)};

                                scope.$broadcast("$ionicView.enter", mockStateInfo);
                                $rootScope.$digest();
                            });

                            it("should invoke the callback", function () {
                                expect(callback).toHaveBeenCalledWith(mockStateInfo.stateName);
                            });

                            it("should remove all of the listeners", function () {
                                //TODO - Figure out how to test this
                            });

                            describe("when another event is subsequently fired", function () {

                                beforeEach(function () {
                                    scope.$broadcast("$ionicView.afterEnter", mockStateInfo);
                                    $rootScope.$digest();
                                });

                                it("should NOT invoke the callback again", function () {
                                    expect(callback.calls.count()).toEqual(1);
                                });
                            });
                        });
                    });
                });

                describe("when the 'global' option is undefined", function () {

                    beforeEach(function () {
                        delete options.global;
                    });

                    describe("when the 'once' option is true", function () {

                        beforeEach(function () {
                            options.once = true;
                        });

                        beforeEach(function () {
                            result = FlowUtil.onPageEnter(callback, scope, options);
                        });

                        it("should set a listener on scope for $ionicView.enter", function () {
                            expect(scope.$on).toHaveBeenCalledWith("$ionicView.enter", jasmine.any(Function));
                        });

                        it("should set a listener on scope for $ionicView.afterEnter", function () {
                            expect(scope.$on).toHaveBeenCalledWith("$ionicView.afterEnter", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $ionicView.enter", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.enter", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $ionicView.afterEnter", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.afterEnter", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $stateChangeSuccess", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$stateChangeSuccess", jasmine.any(Function));
                        });

                        it("should return an array of remove functions for the listeners", function () {
                            expect(_.isArray(result)).toBeTruthy();
                            expect(result.length).toEqual(5);
                        });

                        describe("when one of the events being listened for is fired", function () {
                            var mockStateInfo;

                            beforeEach(function () {
                                mockStateInfo = {stateName: TestUtils.getRandomStringThatIsAlphaNumeric(10)};

                                $rootScope.$broadcast("$ionicView.enter", mockStateInfo);
                                $rootScope.$digest();
                            });

                            it("should invoke the callback", function () {
                                expect(callback).toHaveBeenCalledWith(mockStateInfo.stateName);
                            });

                            it("should remove all of the listeners", function () {
                                //TODO - Figure out how to test this
                            });

                            describe("when another event is subsequently fired", function () {

                                beforeEach(function () {
                                    $rootScope.$broadcast("$ionicView.afterEnter", mockStateInfo);
                                    $rootScope.$digest();
                                });

                                it("should NOT invoke the callback again", function () {
                                    expect(callback.calls.count()).toEqual(1);
                                });
                            });
                        });
                    });

                    describe("when the 'once' option is false", function () {

                        beforeEach(function () {
                            options.once = false;
                        });

                        beforeEach(function () {
                            result = FlowUtil.onPageEnter(callback, scope, options);
                        });

                        it("should set a listener on scope for $ionicView.enter", function () {
                            expect(scope.$on).toHaveBeenCalledWith("$ionicView.enter", jasmine.any(Function));
                        });

                        it("should set a listener on scope for $ionicView.afterEnter", function () {
                            expect(scope.$on).toHaveBeenCalledWith("$ionicView.afterEnter", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $ionicView.enter", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.enter", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $ionicView.afterEnter", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.afterEnter", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $stateChangeSuccess", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$stateChangeSuccess", jasmine.any(Function));
                        });

                        it("should return an array of remove functions for the listeners", function () {
                            expect(_.isArray(result)).toBeTruthy();
                            expect(result.length).toEqual(5);
                        });

                        describe("when one of the events being listened for is fired", function () {
                            var mockStateInfo;

                            beforeEach(function () {
                                mockStateInfo = {stateName: TestUtils.getRandomStringThatIsAlphaNumeric(10)};

                                scope.$broadcast("$ionicView.enter", mockStateInfo);
                                $rootScope.$digest();
                            });

                            it("should invoke the callback", function () {
                                expect(callback).toHaveBeenCalledWith(mockStateInfo.stateName);
                            });

                            it("should NOT remove all of the listeners", function () {
                                //TODO - Figure out how to test this
                            });

                            describe("when another event is subsequently fired", function () {

                                beforeEach(function () {
                                    scope.$broadcast("$ionicView.afterEnter", mockStateInfo);
                                    $rootScope.$digest();
                                });

                                it("should invoke the callback again", function () {
                                    expect(callback.calls.count()).toEqual(2);
                                });
                            });
                        });
                    });

                    describe("when the 'once' option is undefined", function () {

                        beforeEach(function () {
                            delete options.once;
                        });

                        beforeEach(function () {
                            result = FlowUtil.onPageEnter(callback, scope, options);
                        });

                        it("should set a listener on scope for $ionicView.enter", function () {
                            expect(scope.$on).toHaveBeenCalledWith("$ionicView.enter", jasmine.any(Function));
                        });

                        it("should set a listener on scope for $ionicView.afterEnter", function () {
                            expect(scope.$on).toHaveBeenCalledWith("$ionicView.afterEnter", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $ionicView.enter", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.enter", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $ionicView.afterEnter", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.afterEnter", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $stateChangeSuccess", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$stateChangeSuccess", jasmine.any(Function));
                        });

                        it("should return an array of remove functions for the listeners", function () {
                            expect(_.isArray(result)).toBeTruthy();
                            expect(result.length).toEqual(5);
                        });

                        describe("when one of the events being listened for is fired", function () {
                            var mockStateInfo;

                            beforeEach(function () {
                                mockStateInfo = {stateName: TestUtils.getRandomStringThatIsAlphaNumeric(10)};

                                $rootScope.$broadcast("$ionicView.enter", mockStateInfo);
                                $rootScope.$digest();
                            });

                            it("should invoke the callback", function () {
                                expect(callback).toHaveBeenCalledWith(mockStateInfo.stateName);
                            });

                            it("should remove all of the listeners", function () {
                                //TODO - Figure out how to test this
                            });

                            describe("when another event is subsequently fired", function () {

                                beforeEach(function () {
                                    $rootScope.$broadcast("$ionicView.afterEnter", mockStateInfo);
                                    $rootScope.$digest();
                                });

                                it("should NOT invoke the callback again", function () {
                                    expect(callback.calls.count()).toEqual(1);
                                });
                            });
                        });
                    });
                });
            });

            describe("when NOT given a scope", function () {
                var options,
                    result;

                beforeEach(function () {
                    options = {};
                });

                describe("when the 'global' option is true", function () {

                    beforeEach(function () {
                        options.global = true;
                    });

                    describe("when the 'once' option is true", function () {

                        beforeEach(function () {
                            options.once = true;
                        });

                        beforeEach(function () {
                            result = FlowUtil.onPageEnter(callback, null, options);
                        });

                        it("should set a listener on $rootScope for $ionicView.enter", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.enter", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $ionicView.afterEnter", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.afterEnter", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $stateChangeSuccess", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$stateChangeSuccess", jasmine.any(Function));
                        });

                        it("should return an array of remove functions for the listeners", function () {
                            expect(_.isArray(result)).toBeTruthy();
                            expect(result.length).toEqual(3);
                        });

                        describe("when one of the events being listened for is fired", function () {
                            var mockStateInfo;

                            beforeEach(function () {
                                mockStateInfo = {stateName: TestUtils.getRandomStringThatIsAlphaNumeric(10)};

                                $rootScope.$broadcast("$ionicView.enter", mockStateInfo);
                                $rootScope.$digest();
                            });

                            it("should invoke the callback", function () {
                                expect(callback).toHaveBeenCalledWith(mockStateInfo.stateName);
                            });

                            it("should remove all of the listeners", function () {
                                //TODO - Figure out how to test this
                            });

                            describe("when another event is subsequently fired", function () {

                                beforeEach(function () {
                                    $rootScope.$broadcast("$ionicView.afterEnter", mockStateInfo);
                                    $rootScope.$digest();
                                });

                                it("should NOT invoke the callback again", function () {
                                    expect(callback.calls.count()).toEqual(1);
                                });
                            });
                        });
                    });

                    describe("when the 'once' option is false", function () {

                        beforeEach(function () {
                            options.once = false;
                        });

                        beforeEach(function () {
                            result = FlowUtil.onPageEnter(callback, null, options);
                        });

                        it("should set a listener on $rootScope for $ionicView.enter", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.enter", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $ionicView.afterEnter", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.afterEnter", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $stateChangeSuccess", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$stateChangeSuccess", jasmine.any(Function));
                        });

                        it("should return an array of remove functions for the listeners", function () {
                            expect(_.isArray(result)).toBeTruthy();
                            expect(result.length).toEqual(3);
                        });

                        describe("when one of the events being listened for is fired", function () {
                            var mockStateInfo;

                            beforeEach(function () {
                                mockStateInfo = {stateName: TestUtils.getRandomStringThatIsAlphaNumeric(10)};

                                $rootScope.$broadcast("$ionicView.enter", mockStateInfo);
                                $rootScope.$digest();
                            });

                            it("should invoke the callback", function () {
                                expect(callback).toHaveBeenCalledWith(mockStateInfo.stateName);
                            });

                            it("should NOT remove all of the listeners", function () {
                                //TODO - Figure out how to test this
                            });

                            describe("when another event is subsequently fired", function () {

                                beforeEach(function () {
                                    $rootScope.$broadcast("$ionicView.afterEnter", mockStateInfo);
                                    $rootScope.$digest();
                                });

                                it("should invoke the callback again", function () {
                                    expect(callback.calls.count()).toEqual(2);
                                });
                            });
                        });
                    });

                    describe("when the 'once' option is undefined", function () {

                        beforeEach(function () {
                            delete options.once;
                        });

                        beforeEach(function () {
                            result = FlowUtil.onPageEnter(callback, null, options);
                        });

                        it("should set a listener on $rootScope for $ionicView.enter", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.enter", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $ionicView.afterEnter", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.afterEnter", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $stateChangeSuccess", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$stateChangeSuccess", jasmine.any(Function));
                        });

                        it("should return an array of remove functions for the listeners", function () {
                            expect(_.isArray(result)).toBeTruthy();
                            expect(result.length).toEqual(3);
                        });

                        describe("when one of the events being listened for is fired", function () {
                            var mockStateInfo;

                            beforeEach(function () {
                                mockStateInfo = {stateName: TestUtils.getRandomStringThatIsAlphaNumeric(10)};

                                $rootScope.$broadcast("$ionicView.enter", mockStateInfo);
                                $rootScope.$digest();
                            });

                            it("should invoke the callback", function () {
                                expect(callback).toHaveBeenCalledWith(mockStateInfo.stateName);
                            });

                            it("should remove all of the listeners", function () {
                                //TODO - Figure out how to test this
                            });

                            describe("when another event is subsequently fired", function () {

                                beforeEach(function () {
                                    $rootScope.$broadcast("$ionicView.afterEnter", mockStateInfo);
                                    $rootScope.$digest();
                                });

                                it("should NOT invoke the callback again", function () {
                                    expect(callback.calls.count()).toEqual(1);
                                });
                            });
                        });
                    });
                });

                describe("when the 'global' option is false", function () {

                    beforeEach(function () {
                        options.global = false;
                    });

                    describe("when the 'once' option is true", function () {

                        beforeEach(function () {
                            options.once = true;
                        });

                        beforeEach(function () {
                            result = FlowUtil.onPageEnter(callback, null, options);
                        });

                        it("should return an empty array", function () {
                            expect(_.isArray(result)).toBeTruthy();
                            expect(result.length).toEqual(0);
                        });
                    });

                    describe("when the 'once' option is false", function () {

                        beforeEach(function () {
                            options.once = false;
                        });

                        beforeEach(function () {
                            result = FlowUtil.onPageEnter(callback, null, options);
                        });

                        it("should return an empty array", function () {
                            expect(_.isArray(result)).toBeTruthy();
                            expect(result.length).toEqual(0);
                        });
                    });

                    describe("when the 'once' option is undefined", function () {

                        beforeEach(function () {
                            delete options.once;
                        });

                        beforeEach(function () {
                            result = FlowUtil.onPageEnter(callback, null, options);
                        });

                        it("should return an empty array", function () {
                            expect(_.isArray(result)).toBeTruthy();
                            expect(result.length).toEqual(0);
                        });
                    });
                });

                describe("when the 'global' option is undefined", function () {

                    beforeEach(function () {
                        delete options.global;
                    });

                    describe("when the 'once' option is true", function () {

                        beforeEach(function () {
                            options.once = true;
                        });

                        beforeEach(function () {
                            result = FlowUtil.onPageEnter(callback, null, options);
                        });

                        it("should set a listener on $rootScope for $ionicView.enter", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.enter", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $ionicView.afterEnter", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.afterEnter", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $stateChangeSuccess", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$stateChangeSuccess", jasmine.any(Function));
                        });

                        it("should return an array of remove functions for the listeners", function () {
                            expect(_.isArray(result)).toBeTruthy();
                            expect(result.length).toEqual(3);
                        });

                        describe("when one of the events being listened for is fired", function () {
                            var mockStateInfo;

                            beforeEach(function () {
                                mockStateInfo = {stateName: TestUtils.getRandomStringThatIsAlphaNumeric(10)};

                                $rootScope.$broadcast("$ionicView.enter", mockStateInfo);
                                $rootScope.$digest();
                            });

                            it("should invoke the callback", function () {
                                expect(callback).toHaveBeenCalledWith(mockStateInfo.stateName);
                            });

                            it("should remove all of the listeners", function () {
                                //TODO - Figure out how to test this
                            });

                            describe("when another event is subsequently fired", function () {

                                beforeEach(function () {
                                    $rootScope.$broadcast("$ionicView.afterEnter", mockStateInfo);
                                    $rootScope.$digest();
                                });

                                it("should NOT invoke the callback again", function () {
                                    expect(callback.calls.count()).toEqual(1);
                                });
                            });
                        });
                    });

                    describe("when the 'once' option is false", function () {

                        beforeEach(function () {
                            options.once = false;
                        });

                        beforeEach(function () {
                            result = FlowUtil.onPageEnter(callback, null, options);
                        });

                        it("should set a listener on $rootScope for $ionicView.enter", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.enter", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $ionicView.afterEnter", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.afterEnter", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $stateChangeSuccess", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$stateChangeSuccess", jasmine.any(Function));
                        });

                        it("should return an array of remove functions for the listeners", function () {
                            expect(_.isArray(result)).toBeTruthy();
                            expect(result.length).toEqual(3);
                        });

                        describe("when one of the events being listened for is fired", function () {
                            var mockStateInfo;

                            beforeEach(function () {
                                mockStateInfo = {stateName: TestUtils.getRandomStringThatIsAlphaNumeric(10)};

                                $rootScope.$broadcast("$ionicView.enter", mockStateInfo);
                                $rootScope.$digest();
                            });

                            it("should invoke the callback", function () {
                                expect(callback).toHaveBeenCalledWith(mockStateInfo.stateName);
                            });

                            it("should NOT remove all of the listeners", function () {
                                //TODO - Figure out how to test this
                            });

                            describe("when another event is subsequently fired", function () {

                                beforeEach(function () {
                                    $rootScope.$broadcast("$ionicView.afterEnter", mockStateInfo);
                                    $rootScope.$digest();
                                });

                                it("should invoke the callback again", function () {
                                    expect(callback.calls.count()).toEqual(2);
                                });
                            });
                        });
                    });

                    describe("when the 'once' option is undefined", function () {

                        beforeEach(function () {
                            delete options.once;
                        });

                        beforeEach(function () {
                            result = FlowUtil.onPageEnter(callback, null, options);
                        });

                        it("should set a listener on $rootScope for $ionicView.enter", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.enter", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $ionicView.afterEnter", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.afterEnter", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $stateChangeSuccess", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$stateChangeSuccess", jasmine.any(Function));
                        });

                        it("should return an array of remove functions for the listeners", function () {
                            expect(_.isArray(result)).toBeTruthy();
                            expect(result.length).toEqual(3);
                        });

                        describe("when one of the events being listened for is fired", function () {
                            var mockStateInfo;

                            beforeEach(function () {
                                mockStateInfo = {stateName: TestUtils.getRandomStringThatIsAlphaNumeric(10)};

                                $rootScope.$broadcast("$ionicView.enter", mockStateInfo);
                                $rootScope.$digest();
                            });

                            it("should invoke the callback", function () {
                                expect(callback).toHaveBeenCalledWith(mockStateInfo.stateName);
                            });

                            it("should remove all of the listeners", function () {
                                //TODO - Figure out how to test this
                            });

                            describe("when another event is subsequently fired", function () {

                                beforeEach(function () {
                                    $rootScope.$broadcast("$ionicView.afterEnter", mockStateInfo);
                                    $rootScope.$digest();
                                });

                                it("should NOT invoke the callback again", function () {
                                    expect(callback.calls.count()).toEqual(1);
                                });
                            });
                        });
                    });
                });
            });
        });

        describe("has an onPageLeave function that", function () {
            var callback;

            beforeEach(function () {
                callback = jasmine.createSpy("callback");

                spyOn($rootScope, "$on").and.callThrough();
            });

            describe("when given a scope", function () {
                var scope,
                    options,
                    result;

                beforeEach(function () {
                    scope = $rootScope.$new();
                    options = {};
                });

                describe("when the 'global' option is true", function () {

                    beforeEach(function () {
                        options.global = true;
                    });

                    describe("when the 'once' option is true", function () {

                        beforeEach(function () {
                            options.once = true;
                        });

                        beforeEach(function () {
                            result = FlowUtil.onPageLeave(callback, scope, options);
                        });

                        it("should set a listener on scope for $ionicView.leave", function () {
                            expect(scope.$on).toHaveBeenCalledWith("$ionicView.leave", jasmine.any(Function));
                        });

                        it("should set a listener on scope for $ionicView.beforeLeave", function () {
                            expect(scope.$on).toHaveBeenCalledWith("$ionicView.beforeLeave", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $ionicView.leave", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.leave", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $ionicView.beforeLeave", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.beforeLeave", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $stateChangeSuccess", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$stateChangeSuccess", jasmine.any(Function));
                        });

                        it("should return an array of remove functions for the listeners", function () {
                            expect(_.isArray(result)).toBeTruthy();
                            expect(result.length).toEqual(5);
                        });

                        describe("when one of the events being listened for is fired", function () {
                            var mockStateInfo;

                            beforeEach(function () {
                                mockStateInfo = {stateName: TestUtils.getRandomStringThatIsAlphaNumeric(10)};

                                $rootScope.$broadcast("$ionicView.leave", mockStateInfo);
                                $rootScope.$digest();
                            });

                            it("should invoke the callback", function () {
                                expect(callback).toHaveBeenCalledWith(mockStateInfo.stateName);
                            });

                            it("should remove all of the listeners", function () {
                                //TODO - Figure out how to test this
                            });

                            describe("when another event is subsequently fired", function () {

                                beforeEach(function () {
                                    $rootScope.$broadcast("$ionicView.beforeLeave", mockStateInfo);
                                    $rootScope.$digest();
                                });

                                it("should NOT invoke the callback again", function () {
                                    expect(callback.calls.count()).toEqual(1);
                                });
                            });
                        });
                    });

                    describe("when the 'once' option is false", function () {

                        beforeEach(function () {
                            options.once = false;
                        });

                        beforeEach(function () {
                            result = FlowUtil.onPageLeave(callback, scope, options);
                        });

                        it("should set a listener on scope for $ionicView.leave", function () {
                            expect(scope.$on).toHaveBeenCalledWith("$ionicView.leave", jasmine.any(Function));
                        });

                        it("should set a listener on scope for $ionicView.beforeLeave", function () {
                            expect(scope.$on).toHaveBeenCalledWith("$ionicView.beforeLeave", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $ionicView.leave", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.leave", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $ionicView.beforeLeave", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.beforeLeave", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $stateChangeSuccess", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$stateChangeSuccess", jasmine.any(Function));
                        });

                        it("should return an array of remove functions for the listeners", function () {
                            expect(_.isArray(result)).toBeTruthy();
                            expect(result.length).toEqual(5);
                        });

                        describe("when one of the events being listened for is fired", function () {
                            var mockStateInfo;

                            beforeEach(function () {
                                mockStateInfo = {stateName: TestUtils.getRandomStringThatIsAlphaNumeric(10)};

                                scope.$broadcast("$ionicView.leave", mockStateInfo);
                                $rootScope.$digest();
                            });

                            it("should invoke the callback", function () {
                                expect(callback).toHaveBeenCalledWith(mockStateInfo.stateName);
                            });

                            it("should NOT remove all of the listeners", function () {
                                //TODO - Figure out how to test this
                            });

                            describe("when another event is subsequently fired", function () {

                                beforeEach(function () {
                                    scope.$broadcast("$ionicView.beforeLeave", mockStateInfo);
                                    $rootScope.$digest();
                                });

                                it("should invoke the callback again", function () {
                                    expect(callback.calls.count()).toEqual(2);
                                });
                            });
                        });
                    });

                    describe("when the 'once' option is undefined", function () {

                        beforeEach(function () {
                            delete options.once;
                        });

                        beforeEach(function () {
                            result = FlowUtil.onPageLeave(callback, scope, options);
                        });

                        it("should set a listener on scope for $ionicView.leave", function () {
                            expect(scope.$on).toHaveBeenCalledWith("$ionicView.leave", jasmine.any(Function));
                        });

                        it("should set a listener on scope for $ionicView.beforeLeave", function () {
                            expect(scope.$on).toHaveBeenCalledWith("$ionicView.beforeLeave", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $ionicView.leave", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.leave", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $ionicView.beforeLeave", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.beforeLeave", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $stateChangeSuccess", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$stateChangeSuccess", jasmine.any(Function));
                        });

                        it("should return an array of remove functions for the listeners", function () {
                            expect(_.isArray(result)).toBeTruthy();
                            expect(result.length).toEqual(5);
                        });

                        describe("when one of the events being listened for is fired", function () {
                            var mockStateInfo;

                            beforeEach(function () {
                                mockStateInfo = {stateName: TestUtils.getRandomStringThatIsAlphaNumeric(10)};

                                $rootScope.$broadcast("$ionicView.leave", mockStateInfo);
                                $rootScope.$digest();
                            });

                            it("should invoke the callback", function () {
                                expect(callback).toHaveBeenCalledWith(mockStateInfo.stateName);
                            });

                            it("should remove all of the listeners", function () {
                                //TODO - Figure out how to test this
                            });

                            describe("when another event is subsequently fired", function () {

                                beforeEach(function () {
                                    $rootScope.$broadcast("$ionicView.beforeLeave", mockStateInfo);
                                    $rootScope.$digest();
                                });

                                it("should NOT invoke the callback again", function () {
                                    expect(callback.calls.count()).toEqual(1);
                                });
                            });
                        });
                    });
                });

                describe("when the 'global' option is false", function () {

                    beforeEach(function () {
                        options.global = false;
                    });

                    describe("when the 'once' option is true", function () {

                        beforeEach(function () {
                            options.once = true;
                        });

                        beforeEach(function () {
                            result = FlowUtil.onPageLeave(callback, scope, options);
                        });

                        it("should set a listener on scope for $ionicView.leave", function () {
                            expect(scope.$on).toHaveBeenCalledWith("$ionicView.leave", jasmine.any(Function));
                        });

                        it("should set a listener on scope for $ionicView.beforeLeave", function () {
                            expect(scope.$on).toHaveBeenCalledWith("$ionicView.beforeLeave", jasmine.any(Function));
                        });

                        it("should return an array of remove functions for the listeners", function () {
                            expect(_.isArray(result)).toBeTruthy();
                            expect(result.length).toEqual(2);
                        });

                        describe("when one of the events being listened for is fired", function () {
                            var mockStateInfo;

                            beforeEach(function () {
                                mockStateInfo = {stateName: TestUtils.getRandomStringThatIsAlphaNumeric(10)};

                                scope.$broadcast("$ionicView.leave", mockStateInfo);
                                $rootScope.$digest();
                            });

                            it("should invoke the callback", function () {
                                expect(callback).toHaveBeenCalledWith(mockStateInfo.stateName);
                            });

                            it("should remove all of the listeners", function () {
                                //TODO - Figure out how to test this
                            });

                            describe("when another event is subsequently fired", function () {

                                beforeEach(function () {
                                    scope.$broadcast("$ionicView.beforeLeave", mockStateInfo);
                                    $rootScope.$digest();
                                });

                                it("should NOT invoke the callback again", function () {
                                    expect(callback.calls.count()).toEqual(1);
                                });
                            });
                        });
                    });

                    describe("when the 'once' option is false", function () {

                        beforeEach(function () {
                            options.once = false;
                        });

                        beforeEach(function () {
                            result = FlowUtil.onPageLeave(callback, scope, options);
                        });

                        it("should set a listener on scope for $ionicView.leave", function () {
                            expect(scope.$on).toHaveBeenCalledWith("$ionicView.leave", jasmine.any(Function));
                        });

                        it("should set a listener on scope for $ionicView.beforeLeave", function () {
                            expect(scope.$on).toHaveBeenCalledWith("$ionicView.beforeLeave", jasmine.any(Function));
                        });

                        it("should return an array of remove functions for the listeners", function () {
                            expect(_.isArray(result)).toBeTruthy();
                            expect(result.length).toEqual(2);
                        });

                        describe("when one of the events being listened for is fired", function () {
                            var mockStateInfo;

                            beforeEach(function () {
                                mockStateInfo = {stateName: TestUtils.getRandomStringThatIsAlphaNumeric(10)};

                                scope.$broadcast("$ionicView.leave", mockStateInfo);
                                $rootScope.$digest();
                            });

                            it("should invoke the callback", function () {
                                expect(callback).toHaveBeenCalledWith(mockStateInfo.stateName);
                            });

                            it("should NOT remove all of the listeners", function () {
                                //TODO - Figure out how to test this
                            });

                            describe("when another event is subsequently fired", function () {

                                beforeEach(function () {
                                    scope.$broadcast("$ionicView.beforeLeave", mockStateInfo);
                                    $rootScope.$digest();
                                });

                                it("should invoke the callback again", function () {
                                    expect(callback.calls.count()).toEqual(2);
                                });
                            });
                        });
                    });

                    describe("when the 'once' option is undefined", function () {

                        beforeEach(function () {
                            delete options.once;
                        });

                        beforeEach(function () {
                            result = FlowUtil.onPageLeave(callback, scope, options);
                        });

                        it("should set a listener on scope for $ionicView.leave", function () {
                            expect(scope.$on).toHaveBeenCalledWith("$ionicView.leave", jasmine.any(Function));
                        });

                        it("should set a listener on scope for $ionicView.beforeLeave", function () {
                            expect(scope.$on).toHaveBeenCalledWith("$ionicView.beforeLeave", jasmine.any(Function));
                        });

                        it("should return an array of remove functions for the listeners", function () {
                            expect(_.isArray(result)).toBeTruthy();
                            expect(result.length).toEqual(2);
                        });

                        describe("when one of the events being listened for is fired", function () {
                            var mockStateInfo;

                            beforeEach(function () {
                                mockStateInfo = {stateName: TestUtils.getRandomStringThatIsAlphaNumeric(10)};

                                scope.$broadcast("$ionicView.leave", mockStateInfo);
                                $rootScope.$digest();
                            });

                            it("should invoke the callback", function () {
                                expect(callback).toHaveBeenCalledWith(mockStateInfo.stateName);
                            });

                            it("should remove all of the listeners", function () {
                                //TODO - Figure out how to test this
                            });

                            describe("when another event is subsequently fired", function () {

                                beforeEach(function () {
                                    scope.$broadcast("$ionicView.beforeLeave", mockStateInfo);
                                    $rootScope.$digest();
                                });

                                it("should NOT invoke the callback again", function () {
                                    expect(callback.calls.count()).toEqual(1);
                                });
                            });
                        });
                    });
                });

                describe("when the 'global' option is undefined", function () {

                    beforeEach(function () {
                        delete options.global;
                    });

                    describe("when the 'once' option is true", function () {

                        beforeEach(function () {
                            options.once = true;
                        });

                        beforeEach(function () {
                            result = FlowUtil.onPageLeave(callback, scope, options);
                        });

                        it("should set a listener on scope for $ionicView.leave", function () {
                            expect(scope.$on).toHaveBeenCalledWith("$ionicView.leave", jasmine.any(Function));
                        });

                        it("should set a listener on scope for $ionicView.beforeLeave", function () {
                            expect(scope.$on).toHaveBeenCalledWith("$ionicView.beforeLeave", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $ionicView.leave", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.leave", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $ionicView.beforeLeave", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.beforeLeave", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $stateChangeSuccess", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$stateChangeSuccess", jasmine.any(Function));
                        });

                        it("should return an array of remove functions for the listeners", function () {
                            expect(_.isArray(result)).toBeTruthy();
                            expect(result.length).toEqual(5);
                        });

                        describe("when one of the events being listened for is fired", function () {
                            var mockStateInfo;

                            beforeEach(function () {
                                mockStateInfo = {stateName: TestUtils.getRandomStringThatIsAlphaNumeric(10)};

                                $rootScope.$broadcast("$ionicView.leave", mockStateInfo);
                                $rootScope.$digest();
                            });

                            it("should invoke the callback", function () {
                                expect(callback).toHaveBeenCalledWith(mockStateInfo.stateName);
                            });

                            it("should remove all of the listeners", function () {
                                //TODO - Figure out how to test this
                            });

                            describe("when another event is subsequently fired", function () {

                                beforeEach(function () {
                                    $rootScope.$broadcast("$ionicView.beforeLeave", mockStateInfo);
                                    $rootScope.$digest();
                                });

                                it("should NOT invoke the callback again", function () {
                                    expect(callback.calls.count()).toEqual(1);
                                });
                            });
                        });
                    });

                    describe("when the 'once' option is false", function () {

                        beforeEach(function () {
                            options.once = false;
                        });

                        beforeEach(function () {
                            result = FlowUtil.onPageLeave(callback, scope, options);
                        });

                        it("should set a listener on scope for $ionicView.leave", function () {
                            expect(scope.$on).toHaveBeenCalledWith("$ionicView.leave", jasmine.any(Function));
                        });

                        it("should set a listener on scope for $ionicView.beforeLeave", function () {
                            expect(scope.$on).toHaveBeenCalledWith("$ionicView.beforeLeave", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $ionicView.leave", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.leave", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $ionicView.beforeLeave", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.beforeLeave", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $stateChangeSuccess", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$stateChangeSuccess", jasmine.any(Function));
                        });

                        it("should return an array of remove functions for the listeners", function () {
                            expect(_.isArray(result)).toBeTruthy();
                            expect(result.length).toEqual(5);
                        });

                        describe("when one of the events being listened for is fired", function () {
                            var mockStateInfo;

                            beforeEach(function () {
                                mockStateInfo = {stateName: TestUtils.getRandomStringThatIsAlphaNumeric(10)};

                                scope.$broadcast("$ionicView.leave", mockStateInfo);
                                $rootScope.$digest();
                            });

                            it("should invoke the callback", function () {
                                expect(callback).toHaveBeenCalledWith(mockStateInfo.stateName);
                            });

                            it("should NOT remove all of the listeners", function () {
                                //TODO - Figure out how to test this
                            });

                            describe("when another event is subsequently fired", function () {

                                beforeEach(function () {
                                    scope.$broadcast("$ionicView.beforeLeave", mockStateInfo);
                                    $rootScope.$digest();
                                });

                                it("should invoke the callback again", function () {
                                    expect(callback.calls.count()).toEqual(2);
                                });
                            });
                        });
                    });

                    describe("when the 'once' option is undefined", function () {

                        beforeEach(function () {
                            delete options.once;
                        });

                        beforeEach(function () {
                            result = FlowUtil.onPageLeave(callback, scope, options);
                        });

                        it("should set a listener on scope for $ionicView.leave", function () {
                            expect(scope.$on).toHaveBeenCalledWith("$ionicView.leave", jasmine.any(Function));
                        });

                        it("should set a listener on scope for $ionicView.beforeLeave", function () {
                            expect(scope.$on).toHaveBeenCalledWith("$ionicView.beforeLeave", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $ionicView.leave", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.leave", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $ionicView.beforeLeave", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.beforeLeave", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $stateChangeSuccess", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$stateChangeSuccess", jasmine.any(Function));
                        });

                        it("should return an array of remove functions for the listeners", function () {
                            expect(_.isArray(result)).toBeTruthy();
                            expect(result.length).toEqual(5);
                        });

                        describe("when one of the events being listened for is fired", function () {
                            var mockStateInfo;

                            beforeEach(function () {
                                mockStateInfo = {stateName: TestUtils.getRandomStringThatIsAlphaNumeric(10)};

                                $rootScope.$broadcast("$ionicView.leave", mockStateInfo);
                                $rootScope.$digest();
                            });

                            it("should invoke the callback", function () {
                                expect(callback).toHaveBeenCalledWith(mockStateInfo.stateName);
                            });

                            it("should remove all of the listeners", function () {
                                //TODO - Figure out how to test this
                            });

                            describe("when another event is subsequently fired", function () {

                                beforeEach(function () {
                                    $rootScope.$broadcast("$ionicView.beforeLeave", mockStateInfo);
                                    $rootScope.$digest();
                                });

                                it("should NOT invoke the callback again", function () {
                                    expect(callback.calls.count()).toEqual(1);
                                });
                            });
                        });
                    });
                });
            });

            describe("when NOT given a scope", function () {
                var options,
                    result;

                beforeEach(function () {
                    options = {};
                });

                describe("when the 'global' option is true", function () {

                    beforeEach(function () {
                        options.global = true;
                    });

                    describe("when the 'once' option is true", function () {

                        beforeEach(function () {
                            options.once = true;
                        });

                        beforeEach(function () {
                            result = FlowUtil.onPageLeave(callback, null, options);
                        });

                        it("should set a listener on $rootScope for $ionicView.leave", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.leave", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $ionicView.beforeLeave", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.beforeLeave", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $stateChangeSuccess", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$stateChangeSuccess", jasmine.any(Function));
                        });

                        it("should return an array of remove functions for the listeners", function () {
                            expect(_.isArray(result)).toBeTruthy();
                            expect(result.length).toEqual(3);
                        });

                        describe("when one of the events being listened for is fired", function () {
                            var mockStateInfo;

                            beforeEach(function () {
                                mockStateInfo = {stateName: TestUtils.getRandomStringThatIsAlphaNumeric(10)};

                                $rootScope.$broadcast("$ionicView.leave", mockStateInfo);
                                $rootScope.$digest();
                            });

                            it("should invoke the callback", function () {
                                expect(callback).toHaveBeenCalledWith(mockStateInfo.stateName);
                            });

                            it("should remove all of the listeners", function () {
                                //TODO - Figure out how to test this
                            });

                            describe("when another event is subsequently fired", function () {

                                beforeEach(function () {
                                    $rootScope.$broadcast("$ionicView.beforeLeave", mockStateInfo);
                                    $rootScope.$digest();
                                });

                                it("should NOT invoke the callback again", function () {
                                    expect(callback.calls.count()).toEqual(1);
                                });
                            });
                        });
                    });

                    describe("when the 'once' option is false", function () {

                        beforeEach(function () {
                            options.once = false;
                        });

                        beforeEach(function () {
                            result = FlowUtil.onPageLeave(callback, null, options);
                        });

                        it("should set a listener on $rootScope for $ionicView.leave", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.leave", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $ionicView.beforeLeave", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.beforeLeave", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $stateChangeSuccess", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$stateChangeSuccess", jasmine.any(Function));
                        });

                        it("should return an array of remove functions for the listeners", function () {
                            expect(_.isArray(result)).toBeTruthy();
                            expect(result.length).toEqual(3);
                        });

                        describe("when one of the events being listened for is fired", function () {
                            var mockStateInfo;

                            beforeEach(function () {
                                mockStateInfo = {stateName: TestUtils.getRandomStringThatIsAlphaNumeric(10)};

                                $rootScope.$broadcast("$ionicView.leave", mockStateInfo);
                                $rootScope.$digest();
                            });

                            it("should invoke the callback", function () {
                                expect(callback).toHaveBeenCalledWith(mockStateInfo.stateName);
                            });

                            it("should NOT remove all of the listeners", function () {
                                //TODO - Figure out how to test this
                            });

                            describe("when another event is subsequently fired", function () {

                                beforeEach(function () {
                                    $rootScope.$broadcast("$ionicView.beforeLeave", mockStateInfo);
                                    $rootScope.$digest();
                                });

                                it("should invoke the callback again", function () {
                                    expect(callback.calls.count()).toEqual(2);
                                });
                            });
                        });
                    });

                    describe("when the 'once' option is undefined", function () {

                        beforeEach(function () {
                            delete options.once;
                        });

                        beforeEach(function () {
                            result = FlowUtil.onPageLeave(callback, null, options);
                        });

                        it("should set a listener on $rootScope for $ionicView.leave", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.leave", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $ionicView.beforeLeave", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.beforeLeave", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $stateChangeSuccess", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$stateChangeSuccess", jasmine.any(Function));
                        });

                        it("should return an array of remove functions for the listeners", function () {
                            expect(_.isArray(result)).toBeTruthy();
                            expect(result.length).toEqual(3);
                        });

                        describe("when one of the events being listened for is fired", function () {
                            var mockStateInfo;

                            beforeEach(function () {
                                mockStateInfo = {stateName: TestUtils.getRandomStringThatIsAlphaNumeric(10)};

                                $rootScope.$broadcast("$ionicView.leave", mockStateInfo);
                                $rootScope.$digest();
                            });

                            it("should invoke the callback", function () {
                                expect(callback).toHaveBeenCalledWith(mockStateInfo.stateName);
                            });

                            it("should remove all of the listeners", function () {
                                //TODO - Figure out how to test this
                            });

                            describe("when another event is subsequently fired", function () {

                                beforeEach(function () {
                                    $rootScope.$broadcast("$ionicView.beforeLeave", mockStateInfo);
                                    $rootScope.$digest();
                                });

                                it("should NOT invoke the callback again", function () {
                                    expect(callback.calls.count()).toEqual(1);
                                });
                            });
                        });
                    });
                });

                describe("when the 'global' option is false", function () {

                    beforeEach(function () {
                        options.global = false;
                    });

                    describe("when the 'once' option is true", function () {

                        beforeEach(function () {
                            options.once = true;
                        });

                        beforeEach(function () {
                            result = FlowUtil.onPageLeave(callback, null, options);
                        });

                        it("should return an empty array", function () {
                            expect(_.isArray(result)).toBeTruthy();
                            expect(result.length).toEqual(0);
                        });
                    });

                    describe("when the 'once' option is false", function () {

                        beforeEach(function () {
                            options.once = false;
                        });

                        beforeEach(function () {
                            result = FlowUtil.onPageLeave(callback, null, options);
                        });

                        it("should return an empty array", function () {
                            expect(_.isArray(result)).toBeTruthy();
                            expect(result.length).toEqual(0);
                        });
                    });

                    describe("when the 'once' option is undefined", function () {

                        beforeEach(function () {
                            delete options.once;
                        });

                        beforeEach(function () {
                            result = FlowUtil.onPageLeave(callback, null, options);
                        });

                        it("should return an empty array", function () {
                            expect(_.isArray(result)).toBeTruthy();
                            expect(result.length).toEqual(0);
                        });
                    });
                });

                describe("when the 'global' option is undefined", function () {

                    beforeEach(function () {
                        delete options.global;
                    });

                    describe("when the 'once' option is true", function () {

                        beforeEach(function () {
                            options.once = true;
                        });

                        beforeEach(function () {
                            result = FlowUtil.onPageLeave(callback, null, options);
                        });

                        it("should set a listener on $rootScope for $ionicView.leave", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.leave", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $ionicView.beforeLeave", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.beforeLeave", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $stateChangeSuccess", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$stateChangeSuccess", jasmine.any(Function));
                        });

                        it("should return an array of remove functions for the listeners", function () {
                            expect(_.isArray(result)).toBeTruthy();
                            expect(result.length).toEqual(3);
                        });

                        describe("when one of the events being listened for is fired", function () {
                            var mockStateInfo;

                            beforeEach(function () {
                                mockStateInfo = {stateName: TestUtils.getRandomStringThatIsAlphaNumeric(10)};

                                $rootScope.$broadcast("$ionicView.leave", mockStateInfo);
                                $rootScope.$digest();
                            });

                            it("should invoke the callback", function () {
                                expect(callback).toHaveBeenCalledWith(mockStateInfo.stateName);
                            });

                            it("should remove all of the listeners", function () {
                                //TODO - Figure out how to test this
                            });

                            describe("when another event is subsequently fired", function () {

                                beforeEach(function () {
                                    $rootScope.$broadcast("$ionicView.beforeLeave", mockStateInfo);
                                    $rootScope.$digest();
                                });

                                it("should NOT invoke the callback again", function () {
                                    expect(callback.calls.count()).toEqual(1);
                                });
                            });
                        });
                    });

                    describe("when the 'once' option is false", function () {

                        beforeEach(function () {
                            options.once = false;
                        });

                        beforeEach(function () {
                            result = FlowUtil.onPageLeave(callback, null, options);
                        });

                        it("should set a listener on $rootScope for $ionicView.leave", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.leave", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $ionicView.beforeLeave", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.beforeLeave", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $stateChangeSuccess", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$stateChangeSuccess", jasmine.any(Function));
                        });

                        it("should return an array of remove functions for the listeners", function () {
                            expect(_.isArray(result)).toBeTruthy();
                            expect(result.length).toEqual(3);
                        });

                        describe("when one of the events being listened for is fired", function () {
                            var mockStateInfo;

                            beforeEach(function () {
                                mockStateInfo = {stateName: TestUtils.getRandomStringThatIsAlphaNumeric(10)};

                                $rootScope.$broadcast("$ionicView.leave", mockStateInfo);
                                $rootScope.$digest();
                            });

                            it("should invoke the callback", function () {
                                expect(callback).toHaveBeenCalledWith(mockStateInfo.stateName);
                            });

                            it("should NOT remove all of the listeners", function () {
                                //TODO - Figure out how to test this
                            });

                            describe("when another event is subsequently fired", function () {

                                beforeEach(function () {
                                    $rootScope.$broadcast("$ionicView.beforeLeave", mockStateInfo);
                                    $rootScope.$digest();
                                });

                                it("should invoke the callback again", function () {
                                    expect(callback.calls.count()).toEqual(2);
                                });
                            });
                        });
                    });

                    describe("when the 'once' option is undefined", function () {

                        beforeEach(function () {
                            delete options.once;
                        });

                        beforeEach(function () {
                            result = FlowUtil.onPageLeave(callback, null, options);
                        });

                        it("should set a listener on $rootScope for $ionicView.leave", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.leave", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $ionicView.beforeLeave", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.beforeLeave", jasmine.any(Function));
                        });

                        it("should set a listener on $rootScope for $stateChangeSuccess", function () {
                            expect($rootScope.$on).toHaveBeenCalledWith("$stateChangeSuccess", jasmine.any(Function));
                        });

                        it("should return an array of remove functions for the listeners", function () {
                            expect(_.isArray(result)).toBeTruthy();
                            expect(result.length).toEqual(3);
                        });

                        describe("when one of the events being listened for is fired", function () {
                            var mockStateInfo;

                            beforeEach(function () {
                                mockStateInfo = {stateName: TestUtils.getRandomStringThatIsAlphaNumeric(10)};

                                $rootScope.$broadcast("$ionicView.leave", mockStateInfo);
                                $rootScope.$digest();
                            });

                            it("should invoke the callback", function () {
                                expect(callback).toHaveBeenCalledWith(mockStateInfo.stateName);
                            });

                            it("should remove all of the listeners", function () {
                                //TODO - Figure out how to test this
                            });

                            describe("when another event is subsequently fired", function () {

                                beforeEach(function () {
                                    $rootScope.$broadcast("$ionicView.beforeLeave", mockStateInfo);
                                    $rootScope.$digest();
                                });

                                it("should NOT invoke the callback again", function () {
                                    expect(callback.calls.count()).toEqual(1);
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}());
