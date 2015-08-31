(function () {
    "use strict";

    var $rootScope,
        $compile,
        CommonService,
        wexHideBackButton,
        mockHide,
        mockBackButton,
        mockBackButtonScope;

    describe("A Wex Hide Back Button Directive", function () {

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
            mockBackButtonScope = jasmine.createSpyObj("WexBackButton", ["isHidden", "setHidden"]);

            mockHide = TestUtils.getRandomBoolean();

            wexHideBackButton = createWexHideBackButton({hide: mockHide});
        });

        it("should set prevHideState to null", function () {
            expect(wexHideBackButton.scope.prevHideState).toEqual(null);
        });

        it("should set hideStateApplied to false", function () {
            expect(wexHideBackButton.scope.hideStateApplied).toEqual(false);
        });

        it("should set appliedBackButtonHideScope to null", function () {
            expect(wexHideBackButton.scope.appliedBackButtonHideScope).toEqual(null);
        });

        it("should set a scope event listener for $ionicView.afterEnter with applyHideState", function () {
            expect(wexHideBackButton.scope.$on).toHaveBeenCalledWith(
                "$ionicView.afterEnter",
                wexHideBackButton.scope.applyHideState
            );
        });

        it("should set a scope event listener for $destroy with removeHideState", function () {
            expect(wexHideBackButton.scope.$on).toHaveBeenCalledWith(
                "$destroy",
                wexHideBackButton.scope.removeHideState
            );
        });

        it("should set a scope event listener for userLoggedOut with removeHideState", function () {
            expect(wexHideBackButton.scope.$on).toHaveBeenCalledWith(
                "userLoggedOut",
                wexHideBackButton.scope.removeHideState
            );
        });

        it("should set a scope event listener for $ionicView.beforeLeave with removeHideState", function () {
            expect(wexHideBackButton.scope.$on).toHaveBeenCalledWith(
                "$ionicView.beforeLeave",
                wexHideBackButton.scope.removeHideState
            );
        });

        describe("when a hide value is provided", function () {

            beforeEach(function () {
                wexHideBackButton = createWexHideBackButton({hide: mockHide});
            });

            it("should set wexHideBackButton to the provided value", function () {
                expect(wexHideBackButton.scope.wexHideBackButton).toEqual(mockHide);
            });
        });

        describe("when a hide value is NOT provided", function () {

            beforeEach(function () {
                wexHideBackButton = createWexHideBackButton();
            });

            it("wexHideBackButton should be falsy", function () {
                expect(wexHideBackButton.scope.wexHideBackButton).toBeFalsy();
            });
        });

        describe("has an applyHideState function that", function () {

            describe("when the hide state hasn't been applied", function() {

                beforeEach(function () {
                    wexHideBackButton.scope.hideStateApplied = false;
                });

                describe("when there is a back button", function () {

                    beforeEach(function () {
                        CommonService.findActiveBackButton.and.returnValue(mockBackButton);
                    });

                    describe("when there is a scope on the back button", function () {
                        var result,
                            mockButtonHidden;

                        beforeEach(function () {
                            mockButtonHidden = TestUtils.getRandomBoolean();

                            mockBackButton.isolateScope.and.returnValue(mockBackButtonScope);
                            mockBackButtonScope.isHidden.and.returnValue(mockButtonHidden);

                            result = wexHideBackButton.scope.applyHideState();
                        });

                        it("should set prevHideState to the button's hide state", function () {
                            expect(wexHideBackButton.scope.prevHideState).toEqual(mockButtonHidden);
                        });

                        it("should call WexBackButton.setHidden with the hide state", function () {
                            expect(mockBackButtonScope.setHidden).toHaveBeenCalledWith(mockHide);
                        });

                        it("should set hideStateApplied to true", function () {
                            expect(wexHideBackButton.scope.hideStateApplied).toEqual(true);
                        });

                        it("should set appliedBackButtonHideScope to the button's scope", function () {
                            expect(wexHideBackButton.scope.appliedBackButtonHideScope).toEqual(mockBackButtonScope);
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
                            expect(wexHideBackButton.scope.applyHideState).toThrow();
                        });
                    });
                });

                describe("when there is NOT a back button", function () {

                    beforeEach(function () {
                        CommonService.findActiveBackButton.and.returnValue(null);
                    });

                    it("should throw an error", function () {
                        expect(wexHideBackButton.scope.applyHideState).toThrow();
                    });
                });
            });

            describe("when the hide state has been applied", function () {

                beforeEach(function () {
                    wexHideBackButton.scope.hideStateApplied = true;
                });

                it("should return false", function () {
                    expect(wexHideBackButton.scope.applyHideState()).toBeFalsy();
                });
            });
        });

        describe("has a removeHideState function that", function () {

            describe("when the hide state has been applied", function() {

                beforeEach(function () {
                    wexHideBackButton.scope.hideStateApplied = true;
                });

                describe("when there is a back button scope", function () {
                    var result,
                        mockPrevHidden;

                    beforeEach(function () {
                        wexHideBackButton.scope.appliedBackButtonHideScope = mockBackButtonScope;
                        wexHideBackButton.scope.prevHideState = mockPrevHidden = TestUtils.getRandomBoolean();

                        result = wexHideBackButton.scope.removeHideState();
                    });


                    it("should call WexBackButton.setHidden with prevHideState", function () {
                        expect(mockBackButtonScope.setHidden).toHaveBeenCalledWith(mockPrevHidden);
                    });

                    it("should set hideStateApplied to false", function () {
                        expect(wexHideBackButton.scope.hideStateApplied).toEqual(false);
                    });

                    it("should set appliedBackButtonHideScope to null", function () {
                        expect(wexHideBackButton.scope.appliedBackButtonHideScope).toEqual(null);
                    });

                    it("should return true", function () {
                        expect(result).toBeTruthy();
                    });
                });

                describe("when there is NOT a back button scope", function () {

                    beforeEach(function () {
                        wexHideBackButton.scope.appliedBackButtonHideScope = null;
                    });

                    it("should throw an error", function () {
                        expect(wexHideBackButton.scope.removeHideState).toThrow();
                    });
                });
            });

            describe("when the back state has NOT been applied", function () {

                beforeEach(function () {
                    wexHideBackButton.scope.hideStateApplied = false;
                });

                it("should return false", function () {
                    expect(wexHideBackButton.scope.removeHideState()).toBeFalsy();
                });
            });
        });
    });

    function createWexHideBackButton(options) {
        var scope = $rootScope.$new(),
            element;

        options = options || {};
        scope.hide = options.hide;

        var markup = [];

        markup.push("<div wex-hide-back-button");
        if (scope.hide) {
            markup.push("='hide'");
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