(function () {
    "use strict";

    var _,
        $rootScope,
        $compile,
        $state,
        $ionicHistory,
        $interval,
        wexBackButton;

    describe("A Wex Back Button Directive", function () {

        beforeEach(function () {
            //mock dependencies:
            $state = jasmine.createSpyObj("$state", ["go"]);
            $ionicHistory = jasmine.createSpyObj("$ionicHistory", ["goBack", "backView"]);

            module(function ($provide) {
                $provide.value("$state", $state);
                $provide.value("$ionicHistory", $ionicHistory);
            });

            inject(function (___, _$rootScope_, _$compile_, _$interval_) {
                _ = ___;
                $rootScope = _$rootScope_;
                $compile = _$compile_;
                $interval = _$interval_;
            });

            wexBackButton = createWexBackButton();
        });

        afterEach(function() {
            wexBackButton.element.remove();
        });

        describe("when a backState value is provided", function () {
            var mockState;

            beforeEach(function () {
                mockState = TestUtils.getRandomNumberWithLength(10);
                wexBackButton = createWexBackButton({backState: mockState});
            });

            afterEach(function() {
                wexBackButton.element.remove();
            });

            it("should set the backState to the provided value", function () {
                expect(wexBackButton.scope.backState).toEqual(mockState);
            });
        });

        describe("when a backState value is NOT provided", function () {

            beforeEach(function () {
                wexBackButton = createWexBackButton();
            });

            afterEach(function() {
                wexBackButton.element.remove();
            });

            it("the backState should be falsy", function () {
                expect(wexBackButton.scope.backState).toBeFalsy();
            });
        });

        describe("when a hide value is provided", function () {
            var mockHide;

            beforeEach(function () {
                mockHide = TestUtils.getRandomBoolean();
                wexBackButton = createWexBackButton({hide: mockHide});
            });

            afterEach(function() {
                wexBackButton.element.remove();
            });

            it("should set hide to a getter function returning the provided value", function () {
                expect(wexBackButton.scope.hide()).toEqual(mockHide);
            });
        });

        describe("when a hide value is NOT provided", function () {

            beforeEach(function () {
                wexBackButton = createWexBackButton();
            });

            afterEach(function() {
                wexBackButton.element.remove();
            });

            it("should set hide to a function returning false", function () {
                expect(wexBackButton.scope.hide()).toBeFalsy();
            });
        });

        describe("when a backParams value is provided", function () {
            var backParams;

            beforeEach(function () {
                backParams = {
                    property: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                };
                wexBackButton = createWexBackButton({backParams: backParams});
            });

            afterEach(function() {
                wexBackButton.element.remove();
            });

            it("should set backParams to a getter function returning the provided value", function () {
                expect(wexBackButton.scope.backParams()).toEqual(backParams);
            });
        });

        describe("when a backParams value is NOT provided", function () {

            beforeEach(function () {
                wexBackButton = createWexBackButton();
            });

            afterEach(function() {
                wexBackButton.element.remove();
            });

            it("should set hide to a function returning null", function () {
                expect(wexBackButton.scope.backParams()).toEqual(null);
            });
        });

        describe("when a backOptions value is provided", function () {
            var backOptions;

            beforeEach(function () {
                backOptions = {
                    property: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                };
                wexBackButton = createWexBackButton({backOptions: backOptions});
            });

            afterEach(function() {
                wexBackButton.element.remove();
            });

            it("should set backOptions to a getter function returning the provided value", function () {
                expect(wexBackButton.scope.backOptions()).toEqual(backOptions);
            });
        });

        describe("when a backOptions value is NOT provided", function () {

            beforeEach(function () {
                wexBackButton = createWexBackButton();
            });

            afterEach(function() {
                wexBackButton.element.remove();
            });

            it("should set hide to a function returning null", function () {
                expect(wexBackButton.scope.backOptions()).toEqual(null);
            });
        });

        describe("has a getOverrideBackState function that", function () {

            describe("when there is an override back state specified", function () {
                var mockState;

                beforeEach(function () {
                    wexBackButton.scope.backState = mockState = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                });

                it("should return the override state", function () {
                    expect(wexBackButton.scope.getOverrideBackState()).toEqual(mockState);
                });
            });

            describe("when there is NO override back state specified", function () {

                beforeEach(function () {
                    delete wexBackButton.scope.backState;
                });

                it("should return a falsy value", function () {
                    expect(wexBackButton.scope.getOverrideBackState()).toBeFalsy();
                });
            });
        });

        describe("has a goBack function that", function () {

            describe("when there is an override back state specified", function () {
                var mockState,
                    backParams,
                    backOptions;

                beforeEach(function () {
                    backParams = {
                        property: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    };
                    backOptions = {
                        property: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    };
                    wexBackButton.scope.backState = mockState = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                    wexBackButton.scope.backParams = _.constant(backParams);
                    wexBackButton.scope.backOptions = _.constant(backOptions);

                    wexBackButton.scope.goBack();
                });

                it("should call $state.go with the expected values", function () {
                    expect($state.go).toHaveBeenCalledWith(mockState, backParams, backOptions);
                });
            });

            describe("when there is NO override back state specified", function () {

                beforeEach(function () {
                    delete wexBackButton.scope.backState;

                    wexBackButton.scope.goBack();
                });

                it("should call $ionicHistory.goBack", function () {
                    expect($ionicHistory.goBack).toHaveBeenCalledWith();
                });
            });
        });

        describe("has an isHidden function that", function () {

            describe("when a hide value is provided", function () {
                var mockHide;

                beforeEach(function () {
                    mockHide = TestUtils.getRandomBoolean();
                    wexBackButton = createWexBackButton({hide: mockHide});
                });

                afterEach(function() {
                    wexBackButton.element.remove();
                });

                it("should return the provided value", function () {
                    expect(wexBackButton.scope.isHidden()).toEqual(mockHide);
                });
            });

            describe("when a hide value is NOT provided", function () {

                beforeEach(function () {
                    wexBackButton = createWexBackButton();
                });

                afterEach(function() {
                    wexBackButton.element.remove();
                });

                it("should return false", function () {
                    expect(wexBackButton.scope.isHidden()).toBeFalsy();
                });
            });
        });

        describe("has an overrideBackState function that", function () {

            describe("when passed a back state string", function () {
                var mockState;

                beforeEach(function () {
                    mockState = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                });

                describe("when passed params", function () {
                    var params;

                    beforeEach(function () {
                        params = {
                            property: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };
                    });

                    describe("when passed options", function () {
                        var options;

                        beforeEach(function () {
                            options = {
                                property: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            };
                        });

                        beforeEach(function () {
                            wexBackButton.scope.overrideBackState(mockState, params, options);
                        });

                        it("should set backState to the provided value", function () {
                            expect(wexBackButton.scope.backState).toEqual(mockState);
                        });

                        it("should set backParams to a getter returning the provided value", function () {
                            expect(wexBackButton.scope.backParams()).toEqual(params);
                        });

                        it("should set backOptions to a getter returning the provided value", function () {
                            expect(wexBackButton.scope.backOptions()).toEqual(options);
                        });
                    });

                    describe("when NOT passed options", function () {

                        beforeEach(function () {
                            wexBackButton.scope.overrideBackState(mockState, params);
                        });

                        it("should set backState to the provided value", function () {
                            expect(wexBackButton.scope.backState).toEqual(mockState);
                        });

                        it("should set backParams to a getter returning the provided value", function () {
                            expect(wexBackButton.scope.backParams()).toEqual(params);
                        });

                        it("should set backOptions to a getter returning undefined", function () {
                            expect(wexBackButton.scope.backOptions()).toBeUndefined();
                        });
                    });
                });

                describe("when NOT passed params", function () {

                    beforeEach(function () {
                        wexBackButton.scope.overrideBackState(mockState);
                    });

                    it("should set backState to the provided value", function () {
                        expect(wexBackButton.scope.backState).toEqual(mockState);
                    });

                    it("should set backParams to a getter returning undefined", function () {
                        expect(wexBackButton.scope.backParams()).toBeUndefined();
                    });

                    it("should set backOptions to a getter returning undefined", function () {
                        expect(wexBackButton.scope.backOptions()).toBeUndefined();
                    });
                });
            });

            describe("when passed a number", function () {

                beforeEach(function () {
                    wexBackButton.scope.overrideBackState(TestUtils.getRandomNumber(0, 100));
                });

                it("should set backState to null", function () {
                    expect(wexBackButton.scope.backState).toEqual(null);
                });
            });

            describe("when passed an object", function () {

                beforeEach(function () {
                    wexBackButton.scope.overrideBackState({});
                });

                it("should set backState to null", function () {
                    expect(wexBackButton.scope.backState).toEqual(null);
                });
            });

            describe("when passed null", function () {

                beforeEach(function () {
                    wexBackButton.scope.overrideBackState(null);
                });

                it("should set backState to null", function () {
                    expect(wexBackButton.scope.backState).toEqual(null);
                });
            });

            describe("when passed undefined", function () {

                beforeEach(function () {
                    wexBackButton.scope.overrideBackState(undefined);
                });

                it("should set backState to null", function () {
                    expect(wexBackButton.scope.backState).toEqual(null);
                });
            });
        });

        describe("has an pageHasBack function that", function () {

            describe("when the back button is hidden", function () {

                beforeEach(function () {
                    wexBackButton = createWexBackButton({hide: true});
                });

                afterEach(function() {
                    wexBackButton.element.remove();
                });

                it("should return false", function () {
                    expect(wexBackButton.scope.pageHasBack()).toBeFalsy();
                });
            });

            describe("when the back button is NOT hidden", function () {

                beforeEach(function () {
                    wexBackButton = createWexBackButton({hide: false});
                });

                afterEach(function() {
                    wexBackButton.element.remove();
                });

                describe("when there is a back state", function () {

                    beforeEach(function () {
                        wexBackButton.scope.backState = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                    });

                    it("should return true", function () {
                        expect(wexBackButton.scope.pageHasBack()).toBeTruthy();
                    });
                });

                describe("when there is a back view in the history", function () {

                    beforeEach(function () {
                        var mockObject = {
                            mockField: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        $ionicHistory.backView.and.returnValue(mockObject);
                    });

                    it("should return true", function () {
                        expect(wexBackButton.scope.pageHasBack()).toBeTruthy();
                    });
                });

                describe("when there is no back state nor a back view in the history", function () {

                    beforeEach(function () {
                        delete wexBackButton.scope.backState;
                        $ionicHistory.backView.and.returnValue(null);
                    });

                    it("should return false", function () {
                        expect(wexBackButton.scope.pageHasBack()).toBeFalsy();
                    });
                });
            });
        });

        describe("has an setHidden function that", function () {

            describe("when passed a truthy value", function () {

                beforeEach(function () {
                    wexBackButton.scope.setHidden(true);
                });

                it("should set hide to a getter returning true", function () {
                    expect(wexBackButton.scope.hide()).toBeTruthy();
                });
            });

            describe("when passed a falsy value", function () {

                beforeEach(function () {
                    wexBackButton.scope.setHidden(false);
                });

                it("should set hide to a getter returning false", function () {
                    expect(wexBackButton.scope.hide()).toBeFalsy();
                });
            });

            describe("when there is a header bar controller", function () {
                var mockController;

                beforeEach(function () {
                    mockController = jasmine.createSpyObj("$ionicHeaderBar", ["align"]);

                    wexBackButton.scope.backButtonElem.controller = jasmine.createSpy();
                    wexBackButton.scope.backButtonElem.controller.and.returnValue(mockController);

                    wexBackButton.scope.setHidden(TestUtils.getRandomBoolean());
                });

                it("should call headerController.align after 35ms", function () {
                    $interval.flush(35);
                    $rootScope.$digest();

                    expect(mockController.align).toHaveBeenCalledWith();
                });
            });
        });
    });

    function createWexBackButton(options) {
        var scope = $rootScope.$new(),
            element;

        options = options || {};
        angular.extend(scope, options);

        var markup = [];

        markup.push("<wex-back-button");
        if (scope.backState) {
            markup.push(" back-state='{{backState}}'");
        }
        if (scope.backParams) {
            markup.push(" back-params='backParams'");
        }
        if (scope.backOptions) {
            markup.push(" back-options='backOptions'");
        }
        if (scope.hide) {
            markup.push(" hide='hide'");
        }
        markup.push(">");
        markup.push("</wex-back-button>");

        element = $compile(markup.join(""))(scope);
        $rootScope.$digest();

        return {
            element: element,
            scope  : element.isolateScope()
        };
    }
})();