(function () {
    "use strict";

    var $q,
        $rootScope,
        resolveHandler,
        rejectHandler,
        clientId,
        platform,
        versionNumber,
        VersionManager,
        VersionStatusModel,
        VersionsResource,
        mockVersionStatus = {};

    describe("A Version Manager", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.html");
            module("app.components.version");

            // mock dependencies
            VersionsResource = jasmine.createSpyObj("VersionsResource", [
                "getVersionStatus"
            ]);
            mockVersionStatus = jasmine.createSpyObj("VersionStatusModel", ["VersionStatusModel", "set"]);

            module(function ($provide) {
                $provide.value("VersionsResource", VersionsResource);
            });

            inject(function (_$q_, _$rootScope_, _VersionManager_, _VersionStatusModel_) {
                $q = _$q_;
                $rootScope = _$rootScope_;
                VersionManager = _VersionManager_;
                VersionStatusModel = _VersionStatusModel_;
            });

            // set up spies
            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");
        });

        describe("has a fetchVersionStatus function that", function () {

            var getVersionStatusDeferred,
                mockVersionStatusResponse = {
                    data: {
                        status: TestUtils.getRandomStringThatIsAlphaNumeric(5)
                    }
                };

            beforeEach(function () {
                getVersionStatusDeferred = $q.defer();

                clientId = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                platform = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                versionNumber = TestUtils.getRandomStringThatIsAlphaNumeric(5);

                VersionsResource.getVersionStatus.and.returnValue(getVersionStatusDeferred.promise);
                //spyOn(VersionsResource, "getVersionStatus").and.returnValue(mockVersionStatusResponse);

                VersionManager.fetchVersionStatus(clientId, platform, versionNumber)
                    .then(resolveHandler)
                    .catch(rejectHandler);
            });

            describe("when getting a version status", function () {

                it("should call VersionsResource.getVersionStatus", function () {
                    expect(VersionsResource.getVersionStatus).toHaveBeenCalledWith({
                        clientId     : clientId,
                        platform     : platform,
                        versionNumber: versionNumber
                    });
                });

            });

            describe("when the version status is fetched successfully", function () {

                describe("when there is data in the response", function () {

                    beforeEach(function () {
                        getVersionStatusDeferred.resolve(mockVersionStatusResponse);
                        $rootScope.$digest();
                    });

                    it("should resolve", function () {
                        var versionStatusModel = new VersionStatusModel();

                        versionStatusModel.set(mockVersionStatusResponse.data);

                        expect(resolveHandler).toHaveBeenCalledWith(versionStatusModel);
                        expect(rejectHandler).not.toHaveBeenCalled();
                    });

                });

                describe("when there is no data in the response", function () {

                    beforeEach(function () {
                        getVersionStatusDeferred.resolve(null);
                    });

                    it("should throw an error", function () {
                        expect($rootScope.$digest).toThrow();
                    });

                });
            });

            describe("when retrieving the version status fails", function () {

                var mockResponse = "Some error";

                beforeEach(function () {
                    getVersionStatusDeferred.reject(mockResponse);
                });

                it("should throw an error", function () {
                    expect($rootScope.$digest).toThrow();
                });

            });

        });

    });

})();
