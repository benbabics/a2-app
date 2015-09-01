(function () {
    "use strict";

    describe("A Posted Transaction Model Service", function () {

        var _;

        beforeEach(function () {
            module("app.shared");
            module("app.components.transaction");

            inject(function (CommonService) {
                _ = CommonService._;
            });
        });

        describe("has a set function that", function () {

            var postedTransaction,
                mockPostedTransactionResource = {
                    transactionId     : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    transactionDate   : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    postDate          : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    accountNumber     : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    accountName       : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    cardNumber        : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    driverFirstName   : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    driverMiddleName  : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    driverLastName    : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    customVehicleId   : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    merchantBrand     : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    merchantName      : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    merchantAddress   : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    merchantCity      : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    merchantState     : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    merchantZipCode   : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    productDescription: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    grossCost         : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    netCost           : TestUtils.getRandomStringThatIsAlphaNumeric(10)
                },
                postedTransactionModelKeys,
                postedTransactionResourceKeys;

            beforeEach(inject(function (PostedTransactionModel) {
                postedTransaction = new PostedTransactionModel();

                // set all values to "default" to more easily detect any changes
                for (var property in postedTransaction) {
                    if (_.has(postedTransaction, property)) {
                        postedTransaction[property] = "default";
                    }
                }

                postedTransactionModelKeys = _.keys(postedTransaction);
                postedTransactionResourceKeys = _.keys(mockPostedTransactionResource);
            }));

            it("should set the PostedTransactionModel object with the fields from the passed in postedTransactionResource object that they have in common", function () {
                var key,
                    keysIntersection = _.intersection(postedTransactionModelKeys, postedTransactionResourceKeys);

                postedTransaction.set(mockPostedTransactionResource);

                for (var i = 0; i < keysIntersection.length; i++) {
                    key = keysIntersection[i];
                    expect(postedTransaction[key]).toEqual(mockPostedTransactionResource[key]);
                }
            });

            it("should NOT change the PostedTransactionModel object fields that the postedTransactionResource object does not have", function () {
                var key,
                    keysDifference = _.difference(postedTransactionModelKeys, postedTransactionResourceKeys);

                postedTransaction.set(mockPostedTransactionResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(postedTransaction[key]).toEqual("default");
                }
            });

            it("should extend the PostedTransactionModel object with the fields from the passed in postedTransactionResource object that the PostedTransactionModel does not have", function () {
                var key,
                    keysDifference = _.difference(postedTransactionResourceKeys, postedTransactionModelKeys);

                postedTransaction.set(mockPostedTransactionResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(_.has(postedTransaction, key)).toBeTruthy();
                    expect(postedTransaction[key]).toEqual(mockPostedTransactionResource[key]);
                }
            });
        });
    });
})();