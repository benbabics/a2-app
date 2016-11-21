(function () {
    "use strict";

    var $scope,
        $cordovaInAppBrowser,
        ctrl;

    describe("A Privacy Policy Controller", function () {

        beforeEach(function () {

            // mock dependencies
            $cordovaInAppBrowser = jasmine.createSpyObj("$cordovaInAppBrowser", ["open"]);

            inject(function ($controller, $rootScope) {

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                ctrl = $controller("PrivacyPolicyController", {
                    $scope              : $scope,
                    $cordovaInAppBrowser: $cordovaInAppBrowser
                });

            });

        });

        describe("has an openUrl function that", function () {

            var mockUrl;

            beforeEach(function () {
                mockUrl = TestUtils.getRandomStringThatIsAlphaNumeric(50);

                ctrl.openUrl(mockUrl);
            });

            it("should call $cordovaInAppBrowser.open with the expected values", function () {
                expect($cordovaInAppBrowser.open).toHaveBeenCalledWith(
                    mockUrl,
                    "_system"
                );
            });
        });

    });

}());
