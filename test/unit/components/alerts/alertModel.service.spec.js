(function () {
    "use strict";

    fdescribe("An Alert Model Service", function () {

        var _;

        beforeEach(function () {
            module("app.shared");
            module("app.components.alerts");

            inject(function (___) {
                _ = ___;
            });
        });

        describe("has a set function that", function () {

            var alertItem,
                mockAlertResource,
                alertItemModelKeys,
                alertItemResourceKeys;

            beforeEach(inject(function (AlertModel) {
                alertItem = new AlertModel();

                mockAlertResource = angular.extend(TestUtils.getRandomPostedTransaction(AlertModel), {
                    newField1: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    newField2: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    newField3: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                });

                // set all values to "default" to more easily detect any changes
                for (var property in alertItem) {
                    if (_.has(alertItem, property)) {
                        alertItem[property] = "default";
                    }
                }

                alertItemModelKeys = _.keys(alertItem);
                alertItemResourceKeys = _.keys(mockAlertResource);
            }));

            it("should set the AlertModel object with the fields from the passed in alertItemResource object that they have in common", function () {
                var key,
                    keysIntersection = _.intersection(alertItemModelKeys, alertItemResourceKeys);

                alertItem.set(mockAlertResource);

                for (var i = 0; i < keysIntersection.length; i++) {
                    key = keysIntersection[i];
                    expect(alertItem[key]).toEqual(mockAlertResource[key]);
                }
            });

            it("should NOT change the AlertModel object fields that the alertItemResource object does not have", function () {
                var key,
                    keysDifference = _.difference(alertItemModelKeys, alertItemResourceKeys);

                alertItem.set(mockAlertResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(alertItem[key]).toEqual("default");
                }
            });

            it("should extend the AlertModel object with the fields from the passed in alertItemResource object that the AlertModel does not have", function () {
                var key,
                    keysDifference = _.difference(alertItemResourceKeys, alertItemModelKeys);

                alertItem.set(mockAlertResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(_.has(alertItem, key)).toBeTruthy();
                    expect(alertItem[key]).toEqual(mockAlertResource[key]);
                }
            });
        });
    });
})();
