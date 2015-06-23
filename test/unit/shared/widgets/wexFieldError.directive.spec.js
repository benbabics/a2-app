(function () {
    "use strict";

    describe("A WEX Field Error directive", function () {

        var $scope,
            directive,
            mockErrorText = "Mock error text.";

        beforeEach(function () {

            module("app.shared.widgets");
            module("app.html");

            inject(function ($rootScope, $compile) {
                $scope = $rootScope.$new();

                //Compile the angular markup to get an instance of the directive
                directive = $compile([
                    '<div wex-field-error>',
                    mockErrorText,
                    '</div>'
                ].join(""))($scope);

                $rootScope.$digest();
            });
        });

        describe("creates an error element that", function () {
            var errorMessageElem;

            beforeEach(function () {
                _.each(directive.children(), function (child) {
                    if (child.className.indexOf("error-msg") !== -1) {
                        errorMessageElem = child;
                    }
                })
            });

            it("should exist", function () {
                expect(errorMessageElem).toBeTruthy();
            });

            it("should have the expected error icon", function () {
                var icon = null;
                _.each(errorMessageElem.children, function (child) {
                    if (child.className.indexOf("icon-alert") !== -1) {
                        icon = child;
                    }
                });

                expect(icon).toBeTruthy();
            });

            it("should have the transcluded child content", function () {
                expect(errorMessageElem.innerHTML).toContain(mockErrorText);
            });
        });
    });
}());