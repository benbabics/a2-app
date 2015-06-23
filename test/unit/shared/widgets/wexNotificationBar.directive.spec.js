(function () {
    "use strict";

    describe("A WEX Notification Bar directive", function () {

        var $scope,
            bar,
            barUncloseable,
            barCloseable,
            mockTitleText = "Mock title text",
            mockChildText = "Mock child text";

        beforeEach(function () {
            module("app.shared.widgets");
            module("app.html");

            // INJECT! This part is critical
            // $rootScope - injected to create a new $scope instance.
            // $compile - injected to allow us test snippets produced by the directive
            inject(function ($rootScope, $compile) {
                $scope = $rootScope.$new();

                //Compile the angular markup to get an instance of the directive that's uncloseable
                barUncloseable = $compile([
                    '<wex-notification-bar text="' + mockTitleText + '">',
                    mockChildText,
                    '</wex-notification-bar>'
                ].join(""))($scope);

                //Compile the angular markup to get an instance of the directive that's closeable
                barCloseable = $compile([
                    '<wex-notification-bar text="' + mockTitleText + '" closeable="true">',
                    mockChildText,
                    '</wex-notification-bar>'
                ].join(""))($scope);

                $scope.$digest();
            });
        });

        describe("creates a header bar that", function () {

            beforeEach(function () {
                bar = barCloseable;
            });

            it("should exist", function () {
                expect(bar).toBeDefined();
            });

            it("should be a ion-header-bar", function () {
                expect(bar.prop("tagName")).toBeDefined();
                expect(bar.prop("tagName").toLowerCase()).toEqual("ion-header-bar");
            });

            it("should be a subheader", function () {
                expect(bar.hasClass("bar-subheader")).toBeTruthy();
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
                    bar = barCloseable;
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
                    bar = barUncloseable;
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
        });
    });
}());