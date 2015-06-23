(function () {
    "use strict";

    describe("A WEX No Transition directive", function () {

        var $rootScope,
            $document,
            directiveElem,
            ionNavView,
            mockTransitionType = "Mock transition type";

        beforeEach(function () {
            module("app.shared.widgets");

            module(function ($provide) {
                $provide.value("CommonService", {
                    "_": _
                });
            });

            inject(function (_$rootScope_, $compile, _$document_) {
                var $scope = _$rootScope_.$new();

                $rootScope = _$rootScope_;

                $document = _$document_;

                spyOn($rootScope, "$on").and.callThrough();

                ionNavView = $compile('<ion-nav-view></ion-nav-view>')($scope);
                $document.find('body').eq(0).append(ionNavView);

                //Compile the angular markup to get an instance of the directive
                directiveElem = $compile('<div wex-no-transition></div>')($scope);

                $scope.$digest();
            });
        });

        afterEach(function () {
            ionNavView.remove();
        });

        describe("when the directive element has been clicked", function () {
            beforeEach(function () {
                directiveElem.triggerHandler("click");
                $rootScope.$digest();
            });

            it("should register the expected event listeners", function () {
                expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.beforeLeave", jasmine.any(Function));
                expect($rootScope.$on).toHaveBeenCalledWith("$ionicView.afterEnter", jasmine.any(Function));
            });

            describe("when the current view is being left", function () {
                beforeEach(function () {
                    ionNavView.attr("nav-view-transition", mockTransitionType);

                    $rootScope.$broadcast("$ionicView.beforeLeave");
                    $rootScope.$digest();
                });

                afterEach(function () {
                    ionNavView.removeAttr("last-transition");
                });

                it("should set the attribute 'last-transition' to the value of 'nav-view-transition' on the ion-nav-view", function () {
                    expect(ionNavView.attr("last-transition")).toEqual(mockTransitionType);
                });

                it("should set the attribute 'nav-view-transition' on the ion-nav-view to 'none'", function () {
                    expect(ionNavView.attr("nav-view-transition")).toEqual("none");
                });
            });

            describe("when the new view has been entered", function () {
                beforeEach(function () {
                    ionNavView.attr("last-transition", mockTransitionType);
                    ionNavView.attr("nav-view-transition", "none");

                    $rootScope.$broadcast("$ionicView.afterEnter");
                    $rootScope.$digest();
                });

                afterEach(function () {
                    ionNavView.removeAttr("last-transition");
                });

                it("should set the attribute 'nav-view-transition' to the value of 'last-transition' on the ion-nav-view", function () {
                    expect(ionNavView.attr("nav-view-transition")).toEqual(mockTransitionType);
                });

                it("should remove the attribute 'last-transition' from the ion-nav-view", function () {
                    expect(ionNavView.attr("last-transition")).not.toBeDefined();
                });
            });
        });
    });
}());