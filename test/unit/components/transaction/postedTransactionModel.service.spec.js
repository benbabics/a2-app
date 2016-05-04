(function () {
    "use strict";

    describe("A Posted Transaction Model Service", function () {

        var _;

        beforeEach(function () {
            module("app.shared");
            module("app.components.transaction");

            inject(function (___) {
                _ = ___;
            });
        });

        describe("has a set function that", function () {

            var postedTransaction,
                mockPostedTransactionResource,
                postedTransactionModelKeys,
                postedTransactionResourceKeys;

            beforeEach(inject(function (PostedTransactionModel) {
                postedTransaction = new PostedTransactionModel();

                mockPostedTransactionResource = angular.extend(TestUtils.getRandomPostedTransaction(PostedTransactionModel), {
                    newField1: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    newField2: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    newField3: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                });

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