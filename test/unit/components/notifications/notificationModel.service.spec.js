(function () {
    "use strict";

    describe("A Notification Model Service", function () {

        var _;

        beforeEach(function () {
            module("app.shared");
            module("app.components.notifications");

            inject(function (___) {
                _ = ___;
            });
        });

        describe("has a set function that", function () {

            var notificationItem,
                mockNotificationResource,
                notificationItemModelKeys,
                notificationItemResourceKeys;

            beforeEach(inject(function (NotificationModel) {
                notificationItem = new NotificationModel();

                mockNotificationResource = angular.extend(TestUtils.getRandomPostedTransaction(NotificationModel), {
                    newField1: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    newField2: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    newField3: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                });

                // set all values to "default" to more easily detect any changes
                for (var property in notificationItem) {
                    if (_.has(notificationItem, property)) {
                        notificationItem[property] = "default";
                    }
                }

                notificationItemModelKeys = _.keys(notificationItem);
                notificationItemResourceKeys = _.keys(mockNotificationResource);
            }));

            it("should set the NotificationModel object with the fields from the passed in notificationItemResource object that they have in common", function () {
                var key,
                    keysIntersection = _.intersection(notificationItemModelKeys, notificationItemResourceKeys);

                notificationItem.set(mockNotificationResource);

                for (var i = 0; i < keysIntersection.length; i++) {
                    key = keysIntersection[i];
                    expect(notificationItem[key]).toEqual(mockNotificationResource[key]);
                }
            });

            it("should NOT change the NotificationModel object fields that the notificationItemResource object does not have", function () {
                var key,
                    keysDifference = _.difference(notificationItemModelKeys, notificationItemResourceKeys);

                notificationItem.set(mockNotificationResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(notificationItem[key]).toEqual("default");
                }
            });

            it("should extend the NotificationModel object with the fields from the passed in notificationItemResource object that the NotificationModel does not have", function () {
                var key,
                    keysDifference = _.difference(notificationItemResourceKeys, notificationItemModelKeys);

                notificationItem.set(mockNotificationResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(_.has(notificationItem, key)).toBeTruthy();
                    expect(notificationItem[key]).toEqual(mockNotificationResource[key]);
                }
            });
        });
    });
})();
