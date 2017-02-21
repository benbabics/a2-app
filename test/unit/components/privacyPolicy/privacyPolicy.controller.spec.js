(function () {
    "use strict";

    var $scope,
        $q,
        $cordovaInAppBrowser,
        $cordovaAppVersion,
        ctrl;

    describe("A Privacy Policy Controller", function () {

        beforeEach(function () {

            // mock dependencies
            $cordovaInAppBrowser = jasmine.createSpyObj("$cordovaInAppBrowser", ["open"]);
            $cordovaAppVersion = jasmine.createSpyObj("$cordovaAppVersion", ["getVersionNumber"]);

            inject(function ($controller, $rootScope, _$q_) {

                // create a scope object for us to use.
                $scope = $rootScope.$new();
                $q = _$q_;

                //setup mocks
                $cordovaAppVersion.getVersionNumber.and.returnValue($q.resolve(1));

                ctrl = $controller("PrivacyPolicyController", {
                    $scope              : $scope,
                    $cordovaInAppBrowser: $cordovaInAppBrowser,
                    $cordovaAppVersion  : $cordovaAppVersion,
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
