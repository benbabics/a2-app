(function () {
    "use strict";

    var mockAlerts = {
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
                    alertReason      : "Insufficient Funds",
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
                    alertReason      : "Transaction Product Dollar Limit",
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
                    alertReason      : "Invalid Driver ID",
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
                    alertReason      : "Expired Card",
                    merchantName     : "I-295 Fuel Mart",
                },
                status: "UNREAD",
                type  : "TRANSACTION_DECLINE"
            }
        ]
    };

    angular.module("app.components.alerts", ["app.components.account"])
        .run(function ($ionicPlatform, $rootScope, AlertsManager) {

            function handleApplicationLogOut() {
                AlertsManager.clearCachedValues();
            }

            $ionicPlatform.ready(function () {
                //setup event listeners:
                $rootScope.$on("app:logout", handleApplicationLogOut);
            });
        })

        // Mock server responses for now.
        // Get unread alerts count
        .run(function (_, $httpBackend, globals) {
            $httpBackend.whenGET(function (url) {
                return url.startsWith(globals.NOTIFICATIONS_API.BASE_URL + "/unread");
            })
                .respond(function () {
                    var count = _.reduce(mockAlerts.notifications, function (sum, alert) {
                        return sum + (alert.status === "UNREAD" ? 1 : 0);
                    }, 0).toString();
                    return [200, count];
                });
        })

        // Get list of alerts
        .run(function (_, $httpBackend, globals) {
            $httpBackend.whenGET(function (url) {
                return url.startsWith(globals.NOTIFICATIONS_API.BASE_URL + "/?");
            })
                .respond(function () {
                    return [200, mockAlerts];
                });
        })

        // Delete alert
        .run(function (_, $httpBackend, globals) {
            $httpBackend.whenDELETE(function (url) {
                return url.startsWith(globals.NOTIFICATIONS_API.BASE_URL + "/");
            })
                .respond(function (method, url, data) {
                    _.remove(mockAlerts.notifications, function (alert) {
                        return data.includes(alert.id);
                    });
                    return [200];
                });
        })

        // Mark alerts as read
        .run(function (_, $httpBackend, globals) {
            $httpBackend.whenPUT(function (url) {
                return url.startsWith(globals.NOTIFICATIONS_API.BASE_URL + "/");
            })
                .respond(function (method, url, data) {
                    _.forEach(mockAlerts.notifications, function (alert, index) {
                        if (data.includes(alert.id)) {
                            mockAlerts.notifications[index].status = "READ";
                        }
                    });
                    return [200];
                });
        });
})();
