(function () {
    "use strict";

    var $scope,
        $q,
        $cordovaInAppBrowser,
        $cordovaAppVersion,
        cordovaGetVersionNumberDeferred,
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

                ctrl = $controller("PrivacyPolicyController", {
                    $scope              : $scope,
                    $cordovaInAppBrowser: $cordovaInAppBrowser,
                    $cordovaAppVersion  : $cordovaAppVersion,
                });

            });

            cordovaGetVersionNumberDeferred = $q.defer();

            //setup mocks
            $cordovaAppVersion.getVersionNumber.and.returnValue(cordovaGetVersionNumberDeferred.promise);

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
