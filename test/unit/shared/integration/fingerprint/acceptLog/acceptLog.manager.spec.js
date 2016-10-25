(function () {
    "use strict";

    fdescribe("A Fingerprint Accept Log Manager", function () {

        beforeEach(function () {
            var self = this;

            //setup mock dependencies
            this.FingerprintAcceptLogResource = jasmine.createSpyObj("FingerprintAcceptLogResource", ["post"]);
            this.resolveHandler = jasmine.createSpy("resolveHandler");
            this.rejectHandler = jasmine.createSpy("rejectHandler");

            module(function ($provide) {
                $provide.value("FingerprintAcceptLogResource", self.FingerprintAcceptLogResource);
            });

            inject(function ($q, $rootScope, FingerprintAcceptLogManager) {
                self.$q = $q;
                self.$rootScope = $rootScope;
                self.FingerprintAcceptLogManager = FingerprintAcceptLogManager;
            });
        });

        describe("has a log function that", function () {

            beforeEach(function () {
                this.postLogDeferred = this.$q.defer();
                this.FingerprintAcceptLogResource.post.and.returnValue(this.postLogDeferred.promise);
            });

            describe("when FingerprintAcceptLogResource.postLog succeeds", function () {

                beforeEach(function () {
                    this.FingerprintAcceptLogManager.log()
                        .then(this.resolveHandler)
                        .catch(this.rejectHandler);
                });

                beforeEach(function () {
                    this.postLogDeferred.resolve();
                    this.$rootScope.$digest();
                });

                it("should resolve", function () {
                    expect(this.resolveHandler).toHaveBeenCalled();
                    expect(this.rejectHandler).not.toHaveBeenCalled();
                });
            });

            describe("when FingerprintAcceptLogResource.postLog fails", function () {

                beforeEach(function () {
                    this.FingerprintAcceptLogManager.log(this.value)
                        .then(this.resolveHandler)
                        .catch(this.rejectHandler);
                });

                beforeEach(function () {
                    this.error = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                    this.postLogDeferred.reject(this.error);
                });

                it("should log and reject", function () {
                    this.expectedError = "Failed to log to fingerprint acceptance log: " + this.error;

                    this.$rootScope.$digest();

                    expect(this.Logger.error).toHaveBeenCalledWith(this.expectedError);
                    expect(this.rejectHandler).toHaveBeenCalledWith(this.expectedError);
                });
            });
        });
    });
})();
