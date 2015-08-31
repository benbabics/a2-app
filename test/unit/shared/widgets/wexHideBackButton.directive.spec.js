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
            spyOn(CommonService, "findCachedBackButton");
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

        it("should set pageActive to false", function () {
            expect(wexHideBackButton.scope.pageActive).toEqual(false);
        });

        it("should set a scope event listener for $ionicView.afterEnter with onEnter", function () {
            expect(wexHideBackButton.scope.$on).toHaveBeenCalledWith(
                "$ionicView.afterEnter",
                wexHideBackButton.scope.onEnter
            );
        });

        it("should set a scope event listener for $destroy with onLeave", function () {
            expect(wexHideBackButton.scope.$on).toHaveBeenCalledWith("$destroy", wexHideBackButton.scope.onLeave);
        });

        it("should set a scope event listener for userLoggedOut with onLogOut", function () {
            expect(wexHideBackButton.scope.$on).toHaveBeenCalledWith("userLoggedOut", wexHideBackButton.scope.onLogOut);
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

            beforeEach(function () {
                this.pageActive = TestUtils.getRandomBoolean();
            });

            describe("when the hide state hasn't been applied", function() {

                beforeEach(function () {
                    wexHideBackButton.scope.hideStateApplied = false;
                });

                describe("when there is a back button", function () {

                    beforeEach(function () {
                        CommonService.findActiveBackButton.and.returnValue(mockBackButton);
                        CommonService.findCachedBackButton.and.returnValue(mockBackButton);
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
                        CommonService.findCachedBackButton.and.returnValue(null);
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

            beforeEach(function () {
                this.pageActive = TestUtils.getRandomBoolean();
            });

            describe("when the hide state has been applied", function() {

                beforeEach(function () {
                    wexHideBackButton.scope.hideStateApplied = true;
                });

                describe("when there is a back button", function () {

                    beforeEach(function () {
                        CommonService.findActiveBackButton.and.returnValue(mockBackButton);
                        CommonService.findCachedBackButton.and.returnValue(mockBackButton);
                    });

                    describe("when there is a scope on the back button", function () {
                        var result,
                            mockPrevHidden;

                        beforeEach(function () {
                            wexHideBackButton.scope.prevHideState = mockPrevHidden = TestUtils.getRandomBoolean();

                            mockBackButton.isolateScope.and.returnValue(mockBackButtonScope);

                            result = wexHideBackButton.scope.removeHideState();
                        });

                        it("should call WexBackButton.setHidden with prevHideState", function () {
                            expect(mockBackButtonScope.setHidden).toHaveBeenCalledWith(mockPrevHidden);
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
                            expect(wexHideBackButton.scope.removeHideState).toThrow();
                        });
                    });
                });

                describe("when there is NOT a back button", function () {

                    beforeEach(function () {
                        CommonService.findActiveBackButton.and.returnValue(null);
                        CommonService.findCachedBackButton.and.returnValue(null);
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

        describe("has an onEnter function that", function () {

            beforeEach(function () {
                spyOn(wexHideBackButton.scope, "applyHideState");

                wexHideBackButton.scope.onEnter();
            });

            it("should set pageActive to true", function () {
                expect(wexHideBackButton.scope.pageActive).toBeTruthy();
            });

            it("should call applyBackState", function () {
                expect(wexHideBackButton.scope.applyHideState).toHaveBeenCalled();
            });
        });

        describe("has an onLeave function that", function () {

            beforeEach(function () {
                spyOn(wexHideBackButton.scope, "removeHideState");

                wexHideBackButton.scope.onLeave();
            });

            it("should set pageActive to false", function () {
                expect(wexHideBackButton.scope.pageActive).toBeFalsy();
            });

            it("should call removeHideState", function () {
                expect(wexHideBackButton.scope.removeHideState).toHaveBeenCalled();
            });
        });

        describe("has an onLogOut function that", function () {

            beforeEach(function () {
                spyOn(wexHideBackButton.scope, "removeHideState");

                wexHideBackButton.scope.onLogOut();
            });

            it("should set pageActive to false", function () {
                expect(wexHideBackButton.scope.pageActive).toBeFalsy();
            });

            it("should call removeHideState", function () {
                expect(wexHideBackButton.scope.removeHideState).toHaveBeenCalled();
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