(function () {
    "use strict";

    var mockAlerts = [
        {
            "alertId":"1364617615",
            "alertMessage": "Decline: Insufficient Funds",
            "postDate":"2015-04-28T04:00:00+00:00",
            "embossedCardNumber":"88136",
            "firstName":"John",
            "lastName":"Adams",
            "merchantBrand":"Exxonmobil",
            "merchantName":"Country Side Mobil",
            "productDescription":"Unleaded 1",
            "status":"UNREAD"
        },
        {
            "alertId":"1362318030",
            "alertMessage": "Decline: Transaction Product Dollar Limit",
            "postDate":"2015-04-24T04:00:00+00:00",
            "embossedCardNumber":"18133",
            "firstName":"Generic",
            "lastName":"Driver",
            "merchantBrand":"Exxonmobil",
            "merchantName":"Allendale Mobil Mart",
            "productDescription":"Unleaded 1",
            "status":"UNREAD"
        },
        {
            "alertId":"1364617214",
            "alertMessage": "Decline: Invalid Driver ID",
            "postDate":"2015-04-23T04:00:00+00:00",
            "embossedCardNumber":"88136",
            "firstName":"Jane",
            "lastName":"Doe",
            "merchantBrand":"Exxonmobil",
            "merchantName":"Country Side Mobil",
            "productDescription":"Unleaded 1",
            "status":"UNREAD"
        },
        {
            "alertId":"1362311203",
            "alertMessage": "Decline: Expired Card",
            "postDate":"2015-04-24T04:00:00+00:00",
            "embossedCardNumber":"18133",
            "firstName":"Dylan",
            "lastName":"Phillips",
            "merchantBrand":"Exxonmobil",
            "merchantName":"Country Side Mobil",
            "productDescription":"Unleaded 1",
            "status":"UNREAD"
        }
    ];

    angular.module('app.components.alerts', ['app.components.account'])
        .run(function ($ionicPlatform, $rootScope, AlertsManager) {

            function handleApplicationLogOut() {
                AlertsManager.clearCachedValues();
            }

            $ionicPlatform.ready(function () {
                //setup event listeners:
                $rootScope.$on( 'app:logout', handleApplicationLogOut );
            });
        })

        // Mock server responses for now.
        // Get unread alerts count
        .run(function(_, $httpBackend, globals) {
            $httpBackend.whenGET(function(url) { return url.startsWith(globals.NOTIFICATIONS_API.BASE_URL + "/unread"); })
                .respond(function() {
                    var count = _.reduce(mockAlerts, function(sum, value) {
                        return sum + (value.status === "UNREAD" ? 1 : 0);
                    }, 0).toString()
                    return [200, count];
                });
        })

        // Get list of alerts
        .run(function(_, $httpBackend, globals) {
            $httpBackend.whenGET(function(url) { return url.startsWith(globals.NOTIFICATIONS_API.BASE_URL + "/?"); })
                .respond(function() {
                    return [200, mockAlerts];
                });
        })

        // Delete alert
        .run(function(_, $httpBackend, globals) {
            $httpBackend.whenDELETE(function(url) { return url.startsWith(globals.NOTIFICATIONS_API.BASE_URL + "/"); })
                .respond(function(method, url, data) {
                    _.remove(mockAlerts, function(value) {
                        return data.includes(value.alertId);
                    });
                    return [200];
                });
        })

        // Mark alerts as read
        .run(function(_, $httpBackend, globals) {
            $httpBackend.whenPUT(function(url) { return url.startsWith(globals.NOTIFICATIONS_API.BASE_URL + "/"); })
                .respond(function(method, url, data) {
                    _.forEach(mockAlerts, function(value, index) {
                        if(data.includes(value.alertId)) {
                            mockAlerts[index].status = "READ";
                        }
                    });
                    return [200];
                });
        });
})();
