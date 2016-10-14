(function () {
    "use strict";

    var $rootScope,
        $compile,
        $interval,
        ElementUtil,
        wexHideBackButton,
        mockHide,
        mockBackButton,
        mockBackButtonScope;

    describe("A Wex Hide Back Button Directive", function () {

        beforeEach(function () {
            //mock dependencies:
            ElementUtil = jasmine.createSpyObj("ElementUtil", ["findActiveBackButton"]);
            mockBackButton = jasmine.createSpyObj("jqLite", ["isolateScope"]);
            mockBackButtonScope = jasmine.createSpyObj("WexBackButton", ["isHidden", "setHidden"]);
            mockHide = TestUtils.getRandomBoolean();

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

            wexHideBackButton = createWexHideBackButton({hide: mockHide});
        });

        it("should set prevState to null", function () {
            expect(wexHideBackButton.vm.prevState).toEqual(null);
        });

        it("should set stateApplied to false", function () {
            expect(wexHideBackButton.vm.stateApplied).toEqual(false);
        });

        it("should set backButtonScope to null", function () {
            expect(wexHideBackButton.vm.backButtonScope).toEqual(null);
        });

        it("should set activeViewState to null", function () {
            expect(wexHideBackButton.vm.activeViewState).toEqual(null);
        });

        it("should set a scope event listener for $ionicView.afterEnter", function () {
            expect(wexHideBackButton.scope.$on).toHaveBeenCalledWith("$ionicView.afterEnter", jasmine.any(Function));
        });

        it("should set a root scope event listener for $stateChangeSuccess", function () {
            expect($rootScope.$on).toHaveBeenCalledWith("$stateChangeSuccess", jasmine.any(Function));
        });

        describe("when a hide value is provided", function () {

            beforeEach(function () {
                wexHideBackButton = createWexHideBackButton({hide: mockHide});
            });

            it("should set wexHideBackButton to the provided value", function () {
                expect(wexHideBackButton.vm.wexHideBackButton).toEqual(mockHide);
            });
        });

        describe("when a hide value is NOT provided", function () {

            beforeEach(function () {
                wexHideBackButton = createWexHideBackButton();
            });

            it("wexHideBackButton should be falsy", function () {
                expect(wexHideBackButton.vm.wexHideBackButton).toBeFalsy();
            });
        });

        describe("has an applyHideState function that", function () {

            describe("when there is a back button", function () {

                beforeEach(function () {
                    ElementUtil.findActiveBackButton.and.returnValue(mockBackButton);
                });

                describe("when there is a scope on the back button", function () {
                    var mockButtonHidden;

                    beforeEach(function () {
                        mockButtonHidden = TestUtils.getRandomBoolean();

                        mockBackButton.isolateScope.and.returnValue(mockBackButtonScope);
                        mockBackButtonScope.isHidden.and.returnValue(mockButtonHidden);

                        wexHideBackButton.vm.applyHideState();
                    });

                    it("should set prevState to the button's hide state", function () {
                        expect(wexHideBackButton.vm.prevState).toEqual(mockButtonHidden);
                    });

                    it("should call WexBackButton.setHidden with the hide state", function () {
                        expect(mockBackButtonScope.setHidden).toHaveBeenCalledWith(mockHide);
                    });

                    it("should set backButtonScope to the button's scope", function () {
                        expect(wexHideBackButton.vm.backButtonScope).toEqual(mockBackButtonScope);
                    });
                });

                describe("when there is NOT a scope on the back button", function () {

                    beforeEach(function () {
                        mockBackButton.isolateScope.and.returnValue(null);

                        wexHideBackButton.vm.applyHideState();
                    });

                    describe("when there is a scope on the back button after 500ms", function () {
                        var mockButtonHidden;

                        beforeEach(function() {
                            mockButtonHidden = TestUtils.getRandomBoolean();

                            mockBackButton.isolateScope.and.returnValue(mockBackButtonScope);
                            mockBackButtonScope.isHidden.and.returnValue(mockButtonHidden);

                            $interval.flush(500);
                            $rootScope.$digest();
                        });

                        it("should set prevState to the button's hide state", function () {
                            expect(wexHideBackButton.vm.prevState).toEqual(mockButtonHidden);
                        });

                        it("should call WexBackButton.setHidden with the hide state", function () {
                            expect(mockBackButtonScope.setHidden).toHaveBeenCalledWith(mockHide);
                        });

                        it("should set backButtonScope to the button's scope", function () {
                            expect(wexHideBackButton.vm.backButtonScope).toEqual(mockBackButtonScope);
                        });
                    });
                });
            });

            describe("when there is NOT a back button", function () {

                beforeEach(function () {
                    ElementUtil.findActiveBackButton.and.returnValue(null);
                });

                it("should throw an error", function () {
                    expect(wexHideBackButton.vm.applyHideState).toThrow();
                });
            });
        });

        describe("has an onEnter function that", function () {
            var stateName;

            beforeEach(function () {
                stateName = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                spyOn(wexHideBackButton.vm, "applyHideState");
            });

            describe("when a hide state has NOT been applied", function () {

                beforeEach(function () {
                    wexHideBackButton.vm.stateApplied = false;

                    wexHideBackButton.vm.onEnter(stateName);
                });

                it("should set stateApplied to true", function () {
                    expect(wexHideBackButton.vm.stateApplied).toEqual(true);
                });

                it("should set activeViewState to the current state name", function () {
                    expect(wexHideBackButton.vm.activeViewState).toEqual(stateName);
                });

                it("should call applyHideState", function () {
                    expect(wexHideBackButton.vm.applyHideState).toHaveBeenCalledWith();
                });
            });

            describe("when a back state has been applied", function () {

                beforeEach(function () {
                    wexHideBackButton.vm.stateApplied = true;

                    wexHideBackButton.vm.onEnter(stateName);
                });

                it("should NOT set activeViewState to the current state name", function () {
                    expect(wexHideBackButton.vm.activeViewState).not.toEqual(stateName);
                });

                it("should NOT call applyHideState", function () {
                    expect(wexHideBackButton.vm.applyHideState).not.toHaveBeenCalled();
                });
            });
        });

        describe("has an onLeave function that", function () {
            var stateName;

            beforeEach(function () {
                stateName = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                spyOn(wexHideBackButton.vm, "removeHideState");
            });

            describe("when the current state name matches the activeViewState", function () {

                beforeEach(function () {
                    wexHideBackButton.vm.activeViewState = stateName;
                });

                describe("when a hide state has been applied", function() {

                    beforeEach(function () {
                        wexHideBackButton.vm.stateApplied = true;

                        wexHideBackButton.vm.onLeave(stateName);
                    });

                    it("should call removeHideState", function () {
                        expect(wexHideBackButton.vm.removeHideState).toHaveBeenCalledWith();
                    });

                    it("should set stateApplied to false", function () {
                        expect(wexHideBackButton.vm.stateApplied).toEqual(false);
                    });

                    it("should set activeViewState to null", function () {
                        expect(wexHideBackButton.vm.activeViewState).toEqual(null);
                    });
                });

                describe("when a back state has NOT been applied", function() {

                    beforeEach(function () {
                        wexHideBackButton.vm.stateApplied = false;

                        wexHideBackButton.vm.onLeave(stateName);
                    });

                    it("should NOT call removeHideState", function () {
                        expect(wexHideBackButton.vm.removeHideState).not.toHaveBeenCalled();
                    });

                    it("should NOT set activeViewState to null", function () {
                        expect(wexHideBackButton.vm.activeViewState).not.toEqual(null);
                    });
                });
            });

            describe("when the current state name does NOT match the activeViewState", function () {

                beforeEach(function () {
                    wexHideBackButton.vm.activeViewState = stateName = TestUtils.getRandomStringThatIsAlphaNumeric(5);

                    wexHideBackButton.vm.onLeave(stateName);
                });

                it("should NOT call removeHideState", function () {
                    expect(wexHideBackButton.vm.removeHideState).not.toHaveBeenCalled();
                });

                it("should NOT set activeViewState to null", function () {
                    expect(wexHideBackButton.vm.activeViewState).not.toEqual(null);
                });
            });
        });

        describe("has a removeHideState function that", function () {

            describe("when there is a back button scope", function () {
                var mockPrevHidden;

                beforeEach(function () {
                    wexHideBackButton.vm.backButtonScope = mockBackButtonScope;
                    wexHideBackButton.vm.prevState = mockPrevHidden =
                        TestUtils.getRandomStringThatIsAlphaNumeric(10);

                    wexHideBackButton.vm.removeHideState();
                });

                it("should call WexBackButton.setHidden with prevState", function () {
                    expect(mockBackButtonScope.setHidden).toHaveBeenCalledWith(mockPrevHidden);
                });

                it("should set backButtonScope to null", function () {
                    expect(wexHideBackButton.vm.backButtonScope).toEqual(null);
                });
            });

            describe("when there is NOT a back button scope", function () {

                beforeEach(function () {
                    wexHideBackButton.vm.backButtonScope = null;
                });

                it("should throw an error", function () {
                    expect(wexHideBackButton.vm.removeHideState).toThrow();
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

        element = $compile(markup.join(""))(scope);
        $rootScope.$digest();

        return {
            element: element,
            scope  : scope,
            vm     : scope.wexHideBackButton
        };
    }
})();