(function () {
    "use strict";

    var $rootScope,
        $compile,
        $interval,
        ElementUtil,
        FlowUtil,
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
            FlowUtil = jasmine.createSpyObj("FlowUtil", ["onPageEnter", "onPageLeave"]);
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
                $provide.value("FlowUtil", FlowUtil);
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

        it("should set backButtonScope to null", function () {
            expect(wexBackState.vm.backButtonScope).toEqual(null);
        });

        it("should call FlowUtil.onPageEnter with the expected values", function () {
            expect(FlowUtil.onPageEnter).toHaveBeenCalledWith(jasmine.any(Function), wexBackState.scope, {global: false, once: false});
        });

        it("should call FlowUtil.onPageLeave with the expected values", function () {
            expect(FlowUtil.onPageLeave).toHaveBeenCalledWith(jasmine.any(Function), wexBackState.scope, {once: false});
        });

        describe("when the scope is destroyed", function () {

            beforeEach(function () {
                wexBackState.scope.$broadcast("$destroy");
                $rootScope.$digest();
            });

            it("should remove all listeners", function () {
                //TODO - Figure out how to test this
            });
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

            describe("when a back state is defined", function () {

                beforeEach(function () {
                    wexBackState = createWexBackState({backState: mockState});
                    spyOn(wexBackState.vm, "applyBackState");
                });

                xdescribe("when the active state is NOT the current state", function () {

                    beforeEach(function () {
                        //TODO - Figure out how to test this

                        wexBackState.vm.onEnter();
                    });

                    describe("when there is a previously active back state", function () {

                        it("should call onLeave on the previous back state", function () {
                            //TODO - Figure out how to test this
                        });
                    });

                    it("should set activeBackState to the current state", function () {
                        //TODO - Figure out how to test this
                    });

                    it("should call applyBackState", function () {
                        expect(wexBackState.vm.applyBackState).toHaveBeenCalledWith();
                    });
                });

                xdescribe("when the active state is the current state", function () {

                    beforeEach(function () {
                        //TODO - Figure out how to test this

                        wexBackState.vm.onEnter();
                    });

                    it("should NOT set activeBackState to the current state", function () {
                        //TODO - Figure out how to test this
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

                    wexBackState.vm.onEnter();
                });

                xdescribe("when the active state is NOT the current state", function () {

                    beforeEach(function () {
                        //TODO - Figure out how to test this

                        wexBackState.vm.onEnter();
                    });

                    describe("when there is a previously active back state", function () {

                        it("should call onLeave on the previous back state", function () {
                            //TODO - Figure out how to test this
                        });
                    });

                    it("should set activeBackState to the current state", function () {
                        //TODO - Figure out how to test this
                    });

                    it("should NOT call applyBackState", function () {
                        expect(wexBackState.vm.applyBackState).not.toHaveBeenCalled();
                    });
                });

                xdescribe("when the active state is the current state", function () {

                    beforeEach(function () {
                        //TODO - Figure out how to test this

                        wexBackState.vm.onEnter();
                    });

                    it("should NOT set activeBackState to the current state", function () {
                        //TODO - Figure out how to test this
                    });

                    it("should NOT call applyBackState", function () {
                        expect(wexBackState.vm.applyBackState).not.toHaveBeenCalled();
                    });
                });
            });
        });

        describe("has an onLeave function that", function () {

            describe("when a back state is defined", function () {

                beforeEach(function () {
                    wexBackState = createWexBackState({backState: mockState});
                    spyOn(wexBackState.vm, "removeBackState");
                });

                xdescribe("when the active state is the current state", function () {

                    beforeEach(function () {
                        //TODO - Figure out how to test this

                        wexBackState.vm.onLeave();
                    });

                    it("should set activeBackState to null", function () {
                        //TODO - Figure out how to test this
                    });

                    it("should call removeBackState", function () {
                        expect(wexBackState.vm.removeBackState).toHaveBeenCalledWith();
                    });
                });

                xdescribe("when the active state is NOT the current state", function () {

                    beforeEach(function () {
                        //TODO - Figure out how to test this

                        wexBackState.vm.onLeave();
                    });

                    it("should NOT call removeBackState", function () {
                        expect(wexBackState.vm.removeBackState).not.toHaveBeenCalled();
                    });
                });
            });

            describe("when the back state is NOT defined", function () {

                beforeEach(function () {
                    wexBackState = createWexBackState();
                    spyOn(wexBackState.vm, "applyBackState");

                    wexBackState.vm.onLeave();
                });

                xdescribe("when the active state is the current state", function () {

                    beforeEach(function () {
                        //TODO - Figure out how to test this

                        wexBackState.vm.onLeave();
                    });

                    it("should set activeBackState to null", function () {
                        //TODO - Figure out how to test this
                    });

                    it("should NOT call removeBackState", function () {
                        expect(wexBackState.vm.removeBackState).not.toHaveBeenCalled();
                    });
                });

                xdescribe("when the active state is NOT the current state", function () {

                    beforeEach(function () {
                        //TODO - Figure out how to test this

                        wexBackState.vm.onLeave();
                    });

                    it("should NOT call removeBackState", function () {
                        expect(wexBackState.vm.removeBackState).not.toHaveBeenCalled();
                    });
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
