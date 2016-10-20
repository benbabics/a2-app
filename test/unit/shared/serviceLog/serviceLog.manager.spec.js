(function () {
    "use strict";

    describe("A Service Log Manager", function () {

        beforeEach(function () {
            var self = this;

            //setup mock dependencies
            this.ServiceLogResource = jasmine.createSpyObj("ServiceLogResource", ["postLog"]);
            this.resolveHandler = jasmine.createSpy("resolveHandler");
            this.rejectHandler = jasmine.createSpy("rejectHandler");

            module(function ($provide) {
                $provide.value("ServiceLogResource", self.ServiceLogResource);
            });

            inject(function (_$q_, _$rootScope_, _ServiceLogManager_) {
                this.$q = _$q_;
                this.$rootScope = _$rootScope_;
                this.ServiceLogManager = _ServiceLogManager_;
            });
        });

        describe("has a log function that", function () {

            beforeEach(function () {
                this.postLogDeferred = this.$q.defer();
                this.ServiceLogResource.postLog.and.returnValue(this.postLogDeferred.promise);
            });

            describe("when the given value is empty", function () {

                beforeEach(function () {
                    this.error = "Failed to log data. Missing log value.";

                    this.ServiceLogManager.log(this.value)
                        .then(this.resolveHandler)
                        .catch(this.rejectHandler);
                    this.$rootScope.$digest();
                });

                it("should log and reject", function () {
                    expect(this.Logger.error).toHaveBeenCalledWith(this.error);
                    expect(this.rejectHandler).toHaveBeenCalledWith(this.error);
                });
            });

            describe("when the given value is NOT empty", function () {

                beforeEach(function () {
                    this.value = TestUtils.getRandomStringThatIsAlphaNumeric(20);
                });

                describe("when ServiceLogResource.postLog succeeds", function () {

                    beforeEach(function () {
                        this.ServiceLogManager.log(this.value)
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

                describe("when ServiceLogResource.postLog fails", function () {

                    beforeEach(function () {
                        this.ServiceLogManager.log(this.value)
                            .then(this.resolveHandler)
                            .catch(this.rejectHandler);
                    });

                    beforeEach(function () {
                        this.error = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        this.postLogDeferred.reject(this.error);
                    });

                    it("should log and reject", function () {
                        this.expectedError = "Failed to log data to service log: " + this.error;

                        this.$rootScope.$digest();

                        expect(this.Logger.error).toHaveBeenCalledWith(this.expectedError);
                        expect(this.rejectHandler).toHaveBeenCalledWith(this.expectedError);
                    });
                });
            });
        });
    });
})();
