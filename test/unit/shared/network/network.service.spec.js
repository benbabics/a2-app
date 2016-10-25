(function () {
    "use strict";

    describe("A Network service", function () {

        beforeAll(function () {
            this.SERVER_ERROR_CODES = [404, 503];
        });

        beforeEach(function () {

            inject(function (_Network_) {
                this.Network = _Network_;
            });
        });

        describe("has a isServerConnectionError function that", function () {

            describe("when the given error's status is included in the list of server error codes", function () {

                beforeEach(function () {
                    this.errorObject = {status: TestUtils.getRandomValueFromArray(this.SERVER_ERROR_CODES)};

                    this.result = this.Network.isServerConnectionError(this.errorObject);
                });

                it("should return true", function () {
                    expect(this.result).toBe(true);
                });
            });

            describe("when the given error's status is NOT included in the list of server error codes", function () {

                beforeEach(function () {
                    do {
                        this.errorObject = {status: TestUtils.getRandomInteger(0, 1000)};
                    }
                    while(_.includes(this.SERVER_ERROR_CODES, this.errorObject.status));

                    this.result = this.Network.isServerConnectionError(this.errorObject);
                });

                it("should return false", function () {
                    expect(this.result).toBe(false);
                });
            });

            describe("when the given error does NOT have a status", function () {

                beforeEach(function () {
                    this.errorObject = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                    this.result = this.Network.isServerConnectionError(this.errorObject);
                });

                it("should return false", function () {
                    expect(this.result).toBe(false);
                });
            });
        });
    });
})();
