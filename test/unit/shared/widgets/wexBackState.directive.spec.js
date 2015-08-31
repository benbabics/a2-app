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
            spyOn(CommonService, "findCachedBackButton");
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

        it("should set pageActive to false", function () {
            expect(wexBackState.scope.pageActive).toEqual(false);
        });

        it("should set a scope event listener for $ionicView.afterEnter with onEnter", function () {
            expect(wexBackState.scope.$on).toHaveBeenCalledWith("$ionicView.afterEnter", wexBackState.scope.onEnter);
        });

        it("should set a scope event listener for $destroy with onLeave", function () {
            expect(wexBackState.scope.$on).toHaveBeenCalledWith("$destroy", wexBackState.scope.onLeave);
        });

        it("should set a scope event listener for userLoggedOut with onLogOut", function () {
            expect(wexBackState.scope.$on).toHaveBeenCalledWith("userLoggedOut", wexBackState.scope.onLogOut);
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

            beforeEach(function () {
                this.pageActive = TestUtils.getRandomBoolean();
            });

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
                            CommonService.findCachedBackButton.and.returnValue(mockBackButton);
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
                            CommonService.findCachedBackButton.and.returnValue(null);
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

            beforeEach(function () {
                this.pageActive = TestUtils.getRandomBoolean();
            });

            describe("when the back state has been applied", function() {

                beforeEach(function () {
                    wexBackState.scope.backStateApplied = true;
                });

                describe("when there is a back button", function () {

                    beforeEach(function () {
                        CommonService.findActiveBackButton.and.returnValue(mockBackButton);
                        CommonService.findCachedBackButton.and.returnValue(mockBackButton);
                    });

                    describe("when there is a scope on the back button", function () {
                        var result,
                            mockPrevState;

                        beforeEach(function () {
                            wexBackState.scope.prevBackState = mockPrevState =
                                TestUtils.getRandomStringThatIsAlphaNumeric(10);

                            mockBackButton.isolateScope.and.returnValue(mockBackButtonScope);

                            result = wexBackState.scope.removeBackState();
                        });

                        it("should call WexBackButton.overrideBackState with prevBackState", function () {
                            expect(mockBackButtonScope.overrideBackState).toHaveBeenCalledWith(mockPrevState);
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
                            expect(wexBackState.scope.removeBackState).toThrow();
                        });
                    });
                });

                describe("when there is NOT a back button", function () {

                    beforeEach(function () {
                        CommonService.findActiveBackButton.and.returnValue(null);
                        CommonService.findCachedBackButton.and.returnValue(null);
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

        describe("has an onEnter function that", function () {

            beforeEach(function () {
                spyOn(wexBackState.scope, "applyBackState");

                wexBackState.scope.onEnter();
            });

            it("should set pageActive to true", function () {
                expect(wexBackState.scope.pageActive).toBeTruthy();
            });

            it("should call applyBackState", function () {
                expect(wexBackState.scope.applyBackState).toHaveBeenCalled();
            });
        });

        describe("has an onLeave function that", function () {

            beforeEach(function () {
                spyOn(wexBackState.scope, "removeBackState");

                wexBackState.scope.onLeave();
            });

            it("should set pageActive to false", function () {
                expect(wexBackState.scope.pageActive).toBeFalsy();
            });

            it("should call removeBackState", function () {
                expect(wexBackState.scope.removeBackState).toHaveBeenCalled();
            });
        });

        describe("has an onLogOut function that", function () {

            beforeEach(function () {
                spyOn(wexBackState.scope, "removeBackState");

                wexBackState.scope.onLogOut();
            });

            it("should set pageActive to false", function () {
                expect(wexBackState.scope.pageActive).toBeFalsy();
            });

            it("should call removeBackState", function () {
                expect(wexBackState.scope.removeBackState).toHaveBeenCalled();
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