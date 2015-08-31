(function () {
    "use strict";

    var $rootScope,
        $compile,
        CommonService,
        wexBackState,
        mockState,
        mockBackButton,
        mockBackButtonScope;

    describe("A Wex Back State Directive", function () {

        beforeEach(function () {
            module("app.shared");
            module("app.html");

            inject(function (_$rootScope_, _$compile_, _CommonService_) {
                $rootScope = _$rootScope_;
                $compile = _$compile_;
                CommonService = _CommonService_;
            });

            spyOn(CommonService, "findActiveBackButton");
            mockBackButton = jasmine.createSpyObj("jqLite", ["isolateScope"]);
            mockBackButtonScope = jasmine.createSpyObj("WexBackButton", ["getOverrideBackState", "overrideBackState"]);

            mockState = TestUtils.getRandomStringThatIsAlphaNumeric(10);

            wexBackState = createWexBackState({backState: mockState});
        });

        it("should set prevBackState to null", function () {
            expect(wexBackState.scope.prevBackState).toEqual(null);
        });

        it("should set backStateApplied to false", function () {
            expect(wexBackState.scope.backStateApplied).toEqual(false);
        });

        it("should set appliedBackButtonBackScope to null", function () {
            expect(wexBackState.scope.appliedBackButtonBackScope).toEqual(null);
        });

        it("should set a scope event listener for $ionicView.afterEnter with applyBackState", function () {
            expect(wexBackState.scope.$on).toHaveBeenCalledWith(
                "$ionicView.afterEnter",
                wexBackState.scope.applyBackState
            );
        });

        it("should set a scope event listener for $destroy with removeBackState", function () {
            expect(wexBackState.scope.$on).toHaveBeenCalledWith("$destroy", wexBackState.scope.removeBackState);
        });

        it("should set a scope event listener for userLoggedOut with removeBackState", function () {
            expect(wexBackState.scope.$on).toHaveBeenCalledWith("userLoggedOut", wexBackState.scope.removeBackState);
        });

        describe("when a back state value is provided", function () {

            beforeEach(function () {
                wexBackState = createWexBackState({backState: mockState});
            });

            it("should set wexBackState to the provided value", function () {
                expect(wexBackState.scope.wexBackState).toEqual(mockState);
            });
        });

        describe("when a back state value is NOT provided", function () {

            beforeEach(function () {
                wexBackState = createWexBackState();
            });

            it("wexBackState should be falsy", function () {
                expect(wexBackState.scope.wexBackState).toBeFalsy();
            });
        });

        describe("has an applyBackState function that", function () {

            describe("when the back state hasn't been applied", function() {

                beforeEach(function () {
                    wexBackState.scope.backStateApplied = false;
                });

                describe("when a back state value is provided", function () {

                    beforeEach(function () {
                        wexBackState = createWexBackState({backState: mockState});
                    });

                    describe("when there is a back button", function () {

                        beforeEach(function () {
                            CommonService.findActiveBackButton.and.returnValue(mockBackButton);
                        });

                        describe("when there is a scope on the back button", function () {
                            var result,
                                mockOverrideState;

                            beforeEach(function () {
                                mockOverrideState = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                                mockBackButton.isolateScope.and.returnValue(mockBackButtonScope);
                                mockBackButtonScope.getOverrideBackState.and.returnValue(mockOverrideState);

                                result = wexBackState.scope.applyBackState();
                            });

                            it("should set prevBackState to the button's override back state", function () {
                                expect(wexBackState.scope.prevBackState).toEqual(mockOverrideState);
                            });

                            it("should call WexBackButton.overrideBackState with the back state", function () {
                                expect(mockBackButtonScope.overrideBackState).toHaveBeenCalledWith(mockState);
                            });

                            it("should set backStateApplied to true", function () {
                                expect(wexBackState.scope.backStateApplied).toEqual(true);
                            });

                            it("should set appliedBackButtonBackScope to the button's scope", function () {
                                expect(wexBackState.scope.appliedBackButtonBackScope).toEqual(mockBackButtonScope);
                            });

                            it("should return true", function () {
                                expect(result).toBeTruthy();
                            });
                        });

                        describe("when there is NOT a scope on the back button", function () {

                            beforeEach(function () {
                                mockBackButton.isolateScope.and.returnValue(null);
                            });

                            it("should throw an error", function () {
                                expect(wexBackState.scope.applyBackState).toThrow();
                            });
                        });
                    });

                    describe("when there is NOT a back button", function () {

                        beforeEach(function () {
                            CommonService.findActiveBackButton.and.returnValue(null);
                        });

                        it("should throw an error", function () {
                            expect(wexBackState.scope.applyBackState).toThrow();
                        });
                    });
                });

                describe("when a back state value is NOT provided", function () {

                    beforeEach(function () {
                        wexBackState = createWexBackState();
                    });

                    it("should throw an error", function () {
                        expect(wexBackState.scope.applyBackState).toThrow();
                    });
                });
            });

            describe("when the back state has been applied", function () {

                beforeEach(function () {
                    wexBackState.scope.backStateApplied = true;
                });

                it("should return false", function () {
                    expect(wexBackState.scope.applyBackState()).toBeFalsy();
                });
            });
        });

        describe("has a removeBackState function that", function () {

            describe("when the back state has been applied", function() {

                beforeEach(function () {
                    wexBackState.scope.backStateApplied = true;
                });

                describe("when there is a back button scope", function () {
                    var result,
                        mockPrevState;

                    beforeEach(function () {
                        wexBackState.scope.appliedBackButtonBackScope = mockBackButtonScope;
                        wexBackState.scope.prevBackState = mockPrevState =
                            TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        result = wexBackState.scope.removeBackState();
                    });

                    it("should call WexBackButton.overrideBackState with prevBackState", function () {
                        expect(mockBackButtonScope.overrideBackState).toHaveBeenCalledWith(mockPrevState);
                    });

                    it("should set backStateApplied to false", function () {
                        expect(wexBackState.scope.backStateApplied).toEqual(false);
                    });

                    it("should set appliedBackButtonBackScope to null", function () {
                        expect(wexBackState.scope.appliedBackButtonBackScope).toEqual(null);
                    });

                    it("should return true", function () {
                        expect(result).toBeTruthy();
                    });
                });

                describe("when there is NOT a back button scope", function () {

                    beforeEach(function () {
                        wexBackState.scope.appliedBackButtonBackScope = null;
                    });

                    it("should throw an error", function () {
                        expect(wexBackState.scope.removeBackState).toThrow();
                    });
                });
            });

            describe("when the back state has NOT been applied", function () {

                beforeEach(function () {
                    wexBackState.scope.backStateApplied = false;
                });

                it("should return false", function () {
                    expect(wexBackState.scope.removeBackState()).toBeFalsy();
                });
            });
        });
    });

    function createWexBackState(options) {
        var scope = $rootScope.$new(),
            element;

        options = options || {};
        scope.backState = options.backState;

        var markup = [];

        markup.push("<div wex-back-state");
        if (scope.backState) {
            markup.push("='{{backState}}'");
        }
        markup.push(">");
        markup.push("</div>");

        spyOn(scope, "$on");

        element = $compile(markup.join(""))(scope);
        $rootScope.$digest();

        return {
            element: element,
            scope  : scope
        };
    }
})();