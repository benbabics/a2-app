(function () {
    "use strict";

    describe("A WEX Notification Bar directive", function () {

        var $scope,
            CommonService,
            bar,
            barUncloseable,
            barCloseable,
            activeNavView,
            activeView,
            activeContent,
            pageHasNavBar = true,
            mockTitleText = "Mock title text",
            mockChildText = "Mock child text";

        beforeEach(function () {
            module("app.shared");
            module("app.html");

            // INJECT! This part is critical
            // $rootScope - injected to create a new $scope instance.
            // $compile - injected to allow us test snippets produced by the directive
            inject(function ($rootScope, $compile, _CommonService_) {
                $scope = $rootScope.$new();

                CommonService = _CommonService_;

                activeNavView = $compile("<ion-nav-view></ion-nav-view>")($scope);
                activeView = $compile("<ion-view nav-view='active'></ion-view>")($scope);
                activeContent = $compile("<ion-content></ion-content>")($scope);

                activeView.append(activeContent);
                activeNavView.append(activeView);

                $scope.$digest();

                spyOn(CommonService, "getActiveNavView").and.returnValue(activeNavView);
                spyOn(CommonService, "getActiveView").and.returnValue(activeView);
                spyOn(CommonService, "pageHasNavBar").and.callFake(function () {
                    return pageHasNavBar;
                });

                $scope.barVisible = true;
                $scope.mockTitleText = mockTitleText;
                $scope.mockChildText = mockChildText;

                /* TODO/NOTE: There's a bug when using ngIf in $compile in that causes it to always evaluate to false.
                 * To get around this, we need to wrap the ngIf'd element in a <div>.
                 */

                //Compile the angular markup to get an instance of the directive that's uncloseable
                barUncloseable = $compile([
                    "<div>",
                    "<wex-notification-bar text='{{mockTitleText}}' ng-if='barVisible'>",
                    "{{mockChildText}}",
                    "</wex-notification-bar>",
                    "</div>"
                ].join(""))($scope);

                //Compile the angular markup to get an instance of the directive that's closeable
                barCloseable = $compile([
                    "<div>",
                    "<wex-notification-bar text='{{mockTitleText}}' closeable='true' ng-if='barVisible'>",
                    "{{mockChildText}}",
                    "</wex-notification-bar>",
                    "</div>"
                ].join(""))($scope);

                $scope.$digest();

                barUncloseable = barUncloseable.children();
                barCloseable = barCloseable.children();
            });
        });

        afterEach(function () {
            activeContent.removeClass("has-header");
            activeContent.removeClass("has-subheader");
        });

        describe("creates a header bar that", function () {

            beforeEach(function () {
                bar = barCloseable.find("ion-header-bar");
            });

            it("should exist", function () {
                expect(bar).toBeDefined();
            });

            it("should be a ion-header-bar", function () {
                expect(bar.prop("tagName")).toBeDefined();
                expect(bar.prop("tagName").toLowerCase()).toEqual("ion-header-bar");
            });

            it("should be a header", function () {
                expect(bar.hasClass("bar-header")).toBeTruthy();
            });

            it("should align the title to the center", function () {
                expect(bar.attr("align-title")).toEqual("center");
            });

            it("should have the transcluded child content", function () {
                expect(bar.html()).toContain(mockChildText);
            });

            describe("has a title that", function () {
                var title;

                beforeEach(function () {
                    _.each(bar.children(), function (child) {
                        if (child.className === "title") {
                            title = child;
                        }
                    });
                });

                it("should exist", function () {
                    expect(title).toBeDefined();
                });

                it("should contain the title text", function () {
                    expect(title.innerHTML).toContain(mockTitleText);
                });
            });

            describe("when the banner is closeable", function () {

                beforeEach(function () {
                    bar = barCloseable.find("ion-header-bar");
                });

                it("should add a close button", function () {

                    var closeButton = null;
                    _.each(bar.children(), function (child) {
                        if (child.className.indexOf("close-button") !== -1) {
                            closeButton = child;
                        }
                    });

                    expect(closeButton).toBeTruthy();
                });
            });

            describe("when the banner is not closeable", function () {

                beforeEach(function () {
                    bar = barUncloseable.find("ion-header-bar");
                });

                it("should not add a close button", function () {

                    var closeButton = null;
                    _.each(bar.children(), function (child) {
                        if (child.className.indexOf("close-button") !== -1) {
                            closeButton = child;
                        }
                    });

                    expect(closeButton).toEqual(null);
                });
            });

            describe("when the banner is visible", function () {

                describe("when the page has a navBar", function () {

                    beforeEach(function () {
                        pageHasNavBar = true;

                        bar.scope().$apply();

                        toggleBarVisibility(true);
                    });

                    it("should apply the has-subheader class to the active ion-content", function () {
                        expect(activeContent.hasClass("has-subheader")).toBeTruthy();
                    });

                    it("should NOT apply the has-header class to the active ion-content", function () {
                        expect(activeContent.hasClass("has-header")).toBeFalsy();
                    });
                });

                describe("when the page does NOT have a navBar", function () {

                    beforeEach(function () {
                        pageHasNavBar = false;

                        bar.scope().$apply();

                        toggleBarVisibility(true);
                    });

                    it("should apply the has-header class to the active ion-content", function () {
                        expect(activeContent.hasClass("has-header")).toBeTruthy();
                    });

                    it("should NOT apply the has-subheader class to the active ion-content", function () {
                        expect(activeContent.hasClass("has-subheader")).toBeFalsy();
                    });
                });
            });

            describe("when the banner is NOT visible", function () {

                beforeEach(function () {
                    toggleBarVisibility(false);
                });

                afterEach(function () {
                    toggleBarVisibility(true);
                });

                it("should NOT apply the has-header class to the active ion-content", function () {
                    expect(activeContent.hasClass("has-header")).toBeFalsy();
                });

                it("should NOT apply the has-subheader class to the active ion-content", function () {
                    expect(activeContent.hasClass("has-subheader")).toBeFalsy();
                });
            });

            describe("when the page has a navBar", function () {

                beforeEach(function () {
                    pageHasNavBar = true;

                    bar.scope().$apply();
                });

                it("should be a subheader", function () {
                    expect(bar.hasClass("bar-subheader")).toBeTruthy();
                });
            });

            describe("when the page does NOT have a navBar", function () {

                beforeEach(function () {
                    pageHasNavBar = false;

                    bar.scope().$apply();
                });

                it("should NOT be a subheader", function () {
                    expect(bar.hasClass("bar-subheader")).toBeFalsy();
                });
            });

            //TODO Tests for setting correct bar class on ion-content when entering new view

            //TODO Tests for removing correct bar class on ion-content when leaving old view
        });

        function toggleBarVisibility(visible) {
            if ($scope.barVisible === visible) {
                $scope.barVisible = !visible;
                $scope.$digest();
            }

            $scope.barVisible = visible;
            $scope.$digest();
        }
    });
}());