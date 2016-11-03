(function () {
    "use strict";

    var mockNotifications = {
        // Will be an empty array when there are no results.
        notifications: [
            {
                id    : 1364617615,
                data  : {
                    driverFirstName  : "John",
                    driverLastName   : "Adams",
                    // Don't yet know for sure if this is received masked or not.
                    cardNumber       : "88136",
                    authorizationDate: "2015-04-28T04:00:00+00:00",
                    notificationReason: "Insufficient Funds",
                    merchantName     : "Country Side Mobil",
                },
                status: "UNREAD",
                type  : "TRANSACTION_DECLINE"
            },
            {
                id    : 1362318030,
                data  : {
                    driverFirstName  : "Generic",
                    driverLastName   : "Driver",
                    cardNumber       : "18723",
                    authorizationDate: "2015-04-24T04:01:00+00:00",
                    notificationReason      : "Transaction Product Dollar Limit",
                    merchantName     : "Allendale Mobil Mart",
                },
                status: "UNREAD",
                type  : "TRANSACTION_DECLINE"
            },
            {
                id    : 1364617214,
                data  : {
                    driverFirstName  : "Jane",
                    driverLastName   : "Doe",
                    cardNumber       : "83496",
                    authorizationDate: "2015-04-23T04:02:00+00:00",
                    notificationReason      : "Invalid Driver ID",
                    merchantName     : "I-55 Fuel Shop",
                },
                status: "UNREAD",
                type  : "TRANSACTION_DECLINE"
            },
            {
                id    : 1362311203,
                data  : {
                    driverFirstName  : "Dylan",
                    driverLastName   : "Phillips",
                    cardNumber       : "18133",
                    authorizationDate: "2015-04-24T04:03:00+00:00",
                    notificationReason      : "Expired Card",
                    merchantName     : "I-295 Fuel Mart",
                },
                status: "UNREAD",
                type  : "TRANSACTION_DECLINE"
            }
        ]
    };

    angular.module( "app.components.notifications", [] )
        .run(function ($ionicPlatform, $rootScope, NotificationItemsManager) {
            function handleApplicationLogOut() {
                NotificationItemsManager.clearCachedValues();
            }

            $ionicPlatform.ready(function () {
                //setup event listeners:
                $rootScope.$on( "app:logout", handleApplicationLogOut );
            });
        })

        // Mock server responses for now.
        // Get unread notifications count
        .run(function (_, $httpBackend, globals) {
            $httpBackend.whenGET(function (url) {
                return url.startsWith(globals.NOTIFICATIONS_API.BASE_URL + "/unread");
            })
                .respond(function () {
                    var count = _.reduce(mockNotifications.notifications, function (sum, notification) {
                        return sum + (notification.status === "UNREAD" ? 1 : 0);
                    }, 0).toString();
                    return [200, count];
                });
        })

        // Get list of notifications
        .run(function (_, $httpBackend, globals) {
            $httpBackend.whenGET(function (url) {
                return url.startsWith(globals.NOTIFICATIONS_API.BASE_URL + "/?");
            })
                .respond(function () {
                    return [200, mockNotifications];
                });
        })

        // Delete notification
        .run(function (_, $httpBackend, globals) {
            $httpBackend.whenDELETE(function (url) {
                return url.startsWith(globals.NOTIFICATIONS_API.BASE_URL + "/");
            })
                .respond(function (method, url, data) {
                    _.remove(mockNotifications.notifications, function (notification) {
                        return data.includes(notification.id);
                    });
                    return [200];
                });
        })

        // Mark notifications as read
        .run(function (_, $httpBackend, globals) {
            $httpBackend.whenPUT(function (url) {
                return url.startsWith(globals.NOTIFICATIONS_API.BASE_URL + "/");
            })
                .respond(function (method, url, data) {
                    _.forEach(mockNotifications.notifications, function (notification, index) {
                        if (data.includes(notification.id)) {
                            mockNotifications.notifications[index].status = "READ";
                        }
                    });
                    return [200];
                });
        });
})();
