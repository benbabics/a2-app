(function () {
    "use strict";

    var $rootScope,
        $compile,
        $interval,
        ElementUtil,
        wexBackState,
        mockState,
        mockBackButton,
        mockBackButtonScope,
        params,
        options;

    describe("A Wex Back State Directive", function () {

        beforeEach(function () {
            //mock dependencies:
            ElementUtil = jasmine.createSpyObj("ElementUtil", ["findActiveBackButton"]);
            mockBackButton = jasmine.createSpyObj("jqLite", ["isolateScope"]);
            mockBackButtonScope = jasmine.createSpyObj("WexBackButton", ["getOverrideBackState", "overrideBackState"]);
            mockState = TestUtils.getRandomStringThatIsAlphaNumeric(10);
            params = {
                property: TestUtils.getRandomStringThatIsAlphaNumeric(10)
            };
            options = {
                property: TestUtils.getRandomStringThatIsAlphaNumeric(10)
            };

            module("app.shared", function ($provide) {
                $provide.value("ElementUtil", ElementUtil);
            });
            module("app.html");

            inject(function (_$rootScope_, _$compile_, _$interval_) {
                $rootScope = _$rootScope_;
                $compile = _$compile_;
                $interval = _$interval_;
            });

            //spies:
            spyOn($rootScope, "$on");

            wexBackState = createWexBackState({
                backState: mockState,
                backParams: params,
                backOptions: options
            });
        });

        it("should set prevState to null", function () {
            expect(wexBackState.vm.prevState).toEqual(null);
        });

        it("should set stateApplied to false", function () {
            expect(wexBackState.vm.stateApplied).toEqual(false);
        });

        it("should set backButtonScope to null", function () {
            expect(wexBackState.vm.backButtonScope).toEqual(null);
        });

        it("should set activeViewState to null", function () {
            expect(wexBackState.vm.activeViewState).toEqual(null);
        });

        it("should set a scope event listener for $ionicView.afterEnter", function () {
            expect(wexBackState.scope.$on).toHaveBeenCalledWith("$ionicView.afterEnter", jasmine.any(Function));
        });

        it("should set a root scope event listener for $stateChangeSuccess", function () {
            expect($rootScope.$on).toHaveBeenCalledWith("$stateChangeSuccess", jasmine.any(Function));
        });

        describe("when a back state value is provided", function () {

            beforeEach(function () {
                wexBackState = createWexBackState({backState: mockState});
            });

            it("should set wexBackState to the provided value", function () {
                expect(wexBackState.vm.wexBackState).toEqual(mockState);
            });
        });

        describe("when a back state value is NOT provided", function () {

            beforeEach(function () {
                wexBackState = createWexBackState();
            });

            it("wexBackState should be falsy", function () {
                expect(wexBackState.vm.wexBackState).toBeFalsy();
            });
        });

        describe("when a backParams value is provided", function () {
            var backParams;

            beforeEach(function () {
                backParams = {
                    property: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                };
                wexBackState = createWexBackState({backParams: backParams});
            });

            it("should set backParams to the provided value", function () {
                expect(wexBackState.vm.wexBackParams).toEqual(backParams);
            });
        });

        describe("when a backParams value is NOT provided", function () {

            beforeEach(function () {
                wexBackState = createWexBackState();
            });

            it("should set backParams to null", function () {
                expect(wexBackState.vm.wexBackParams).toEqual(null);
            });
        });

        describe("when a backOptions value is provided", function () {
            var backOptions;

            beforeEach(function () {
                backOptions = {
                    property: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                };
                wexBackState = createWexBackState({backOptions: backOptions});
            });

            it("should set backOptions to the provided value", function () {
                expect(wexBackState.vm.wexBackOptions).toEqual(backOptions);
            });
        });

        describe("when a backOptions value is NOT provided", function () {

            beforeEach(function () {
                wexBackState = createWexBackState();
            });

            it("should set backOptions to null", function () {
                expect(wexBackState.vm.wexBackOptions).toEqual(null);
            });
        });

        describe("has an applyBackState function that", function () {

            describe("when there is a back button", function () {

                beforeEach(function () {
                    ElementUtil.findActiveBackButton.and.returnValue(mockBackButton);
                });

                describe("when there is a scope on the back button", function () {
                    var mockOverrideState;

                    beforeEach(function () {
                        mockOverrideState = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        mockBackButton.isolateScope.and.returnValue(mockBackButtonScope);
                        mockBackButtonScope.getOverrideBackState.and.returnValue(mockOverrideState);

                        wexBackState.vm.applyBackState();
                    });

                    it("should set prevState to the button's override back state", function () {
                        expect(wexBackState.vm.prevState).toEqual(mockOverrideState);
                    });

                    it("should call WexBackButton.overrideBackState with the expected values", function () {
                        expect(mockBackButtonScope.overrideBackState).toHaveBeenCalledWith(mockState, params, options);
                    });

                    it("should set backButtonScope to the button's scope", function () {
                        expect(wexBackState.vm.backButtonScope).toEqual(mockBackButtonScope);
                    });
                });

                describe("when there is NOT a scope on the back button", function () {

                    beforeEach(function () {
                        mockBackButton.isolateScope.and.returnValue(null);

                        wexBackState.vm.applyBackState();
                    });

                    describe("when there is a scope on the back button after 500ms", function () {
                        var mockOverrideState;

                        beforeEach(function () {
                            mockOverrideState = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                            mockBackButton.isolateScope.and.returnValue(mockBackButtonScope);
                            mockBackButtonScope.getOverrideBackState.and.returnValue(mockOverrideState);

                            $interval.flush(500);
                            $rootScope.$digest();
                        });

                        it("should set prevState to the button's override back state", function () {
                            expect(wexBackState.vm.prevState).toEqual(mockOverrideState);
                        });

                        it("should call WexBackButton.overrideBackState with the expected values", function () {
                            expect(mockBackButtonScope.overrideBackState).toHaveBeenCalledWith(mockState, params, options);
                        });

                        it("should set backButtonScope to the button's scope", function () {
                            expect(wexBackState.vm.backButtonScope).toEqual(mockBackButtonScope);
                        });
                    });
                });
            });

            describe("when there is NOT a back button", function () {

                beforeEach(function () {
                    ElementUtil.findActiveBackButton.and.returnValue(null);
                });

                it("should throw an error", function () {
                    expect(wexBackState.vm.applyBackState).toThrow();
                });
            });
        });

        describe("has an onEnter function that", function () {
            var stateName;

            beforeEach(function () {
                stateName = TestUtils.getRandomStringThatIsAlphaNumeric(10);
            });

            describe("when a back state is defined", function () {

                beforeEach(function () {
                    wexBackState = createWexBackState({backState: mockState});
                    spyOn(wexBackState.vm, "applyBackState");
                });

                describe("when a back state has NOT been applied", function() {

                    beforeEach(function () {
                        wexBackState.vm.stateApplied = false;

                        wexBackState.vm.onEnter(stateName);
                    });

                    it("should set stateApplied to true", function () {
                        expect(wexBackState.vm.stateApplied).toEqual(true);
                    });

                    it("should set activeViewState to the current state name", function () {
                        expect(wexBackState.vm.activeViewState).toEqual(stateName);
                    });

                    it("should call applyBackState", function () {
                        expect(wexBackState.vm.applyBackState).toHaveBeenCalledWith();
                    });
                });

                describe("when a back state has been applied", function() {

                    beforeEach(function () {
                        wexBackState.vm.stateApplied = true;

                        wexBackState.vm.onEnter(stateName);
                    });

                    it("should NOT set activeViewState to the current state name", function () {
                        expect(wexBackState.vm.activeViewState).not.toEqual(stateName);
                    });

                    it("should NOT call applyBackState", function () {
                        expect(wexBackState.vm.applyBackState).not.toHaveBeenCalled();
                    });
                });
            });

            describe("when the back state is NOT defined", function () {

                beforeEach(function () {
                    wexBackState = createWexBackState();
                    spyOn(wexBackState.vm, "applyBackState");

                    wexBackState.vm.onEnter(stateName);
                });

                it("should NOT set stateApplied to true", function () {
                    expect(wexBackState.vm.stateApplied).toBeFalsy();
                });

                it("should NOT set activeViewState to the current state name", function () {
                    expect(wexBackState.vm.activeViewState).not.toEqual(stateName);
                });

                it("should NOT call applyBackState", function () {
                    expect(wexBackState.vm.applyBackState).not.toHaveBeenCalled();
                });
            });
        });

        describe("has an onLeave function that", function () {
            var stateName;

            beforeEach(function () {
                stateName = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                spyOn(wexBackState.vm, "removeBackState");
            });

            describe("when the current state name matches the activeViewState", function () {

                beforeEach(function () {
                    wexBackState.vm.activeViewState = stateName;
                });

                describe("when a back state has been applied", function() {

                    beforeEach(function () {
                        wexBackState.vm.stateApplied = true;

                        wexBackState.vm.onLeave(stateName);
                    });

                    it("should call removeBackState", function () {
                        expect(wexBackState.vm.removeBackState).toHaveBeenCalledWith();
                    });

                    it("should set stateApplied to false", function () {
                        expect(wexBackState.vm.stateApplied).toEqual(false);
                    });

                    it("should set activeViewState to null", function () {
                        expect(wexBackState.vm.activeViewState).toEqual(null);
                    });
                });

                describe("when a back state has NOT been applied", function() {

                    beforeEach(function () {
                        wexBackState.vm.stateApplied = false;

                        wexBackState.vm.onLeave(stateName);
                    });

                    it("should NOT call removeBackState", function () {
                        expect(wexBackState.vm.removeBackState).not.toHaveBeenCalled();
                    });

                    it("should NOT set activeViewState to null", function () {
                        expect(wexBackState.vm.activeViewState).not.toEqual(null);
                    });
                });
            });

            describe("when the current state name does NOT match the activeViewState", function () {

                beforeEach(function () {
                    wexBackState.vm.activeViewState = stateName = TestUtils.getRandomStringThatIsAlphaNumeric(5);

                    wexBackState.vm.onLeave(stateName);
                });

                it("should NOT call removeBackState", function () {
                    expect(wexBackState.vm.removeBackState).not.toHaveBeenCalled();
                });

                it("should NOT set activeViewState to null", function () {
                    expect(wexBackState.vm.activeViewState).not.toEqual(null);
                });
            });
        });

        describe("has a removeBackState function that", function () {

            describe("when there is a back button scope", function () {
                var mockPrevState;

                beforeEach(function () {
                    wexBackState.vm.backButtonScope = mockBackButtonScope;
                    wexBackState.vm.prevState = mockPrevState =
                        TestUtils.getRandomStringThatIsAlphaNumeric(10);

                    wexBackState.vm.removeBackState();
                });

                it("should call WexBackButton.overrideBackState with prevState", function () {
                    expect(mockBackButtonScope.overrideBackState).toHaveBeenCalledWith(mockPrevState);
                });

                it("should set backButtonScope to null", function () {
                    expect(wexBackState.vm.backButtonScope).toEqual(null);
                });
            });

            describe("when there is NOT a back button scope", function () {

                beforeEach(function () {
                    wexBackState.vm.backButtonScope = null;
                });

                it("should throw an error", function () {
                    expect(wexBackState.vm.removeBackState).toThrow();
                });
            });
        });
    });

    function createWexBackState(options) {
        var scope = $rootScope.$new(),
            element;

        options = options || {};
        angular.extend(scope, options);

        var markup = [];

        markup.push("<div wex-back-state");
        if (scope.backState) {
            markup.push("='{{backState}}'");
        }
        if (scope.backParams) {
            markup.push(" wex-back-params='backParams'");
        }
        if (scope.backOptions) {
            markup.push(" wex-back-options='backOptions'");
        }
        markup.push(">");
        markup.push("</div>");

        element = $compile(markup.join(""))(scope);
        $rootScope.$digest();

        return {
            element: element,
            scope  : scope,
            vm     : scope.wexBackState
        };
    }
})();