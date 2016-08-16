(function () {
    "use strict";

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

        .run(function($httpBackend) {
            // Create a faux HTTP response for request
            $httpBackend.whenGET(/.*?accounts\/[^/]*\/alerts?.*/g)
                .respond([
                  {
                     "alertId":"1364617615",
                     "alertMessage": "Decline: Insufficient Funds",
                     "postDate":"2015-04-28T04:00:00+00:00",
                     "embossedCardNumber":"88136",
                     "firstName":"John",
                     "lastName":"Adams",
                     "merchantBrand":"Exxonmobil",
                     "merchantName":"Country Side Mobil",
                     "productDescription":"Unleaded 1"
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
                     "productDescription":"Unleaded 1"
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
                     "productDescription":"Unleaded 1"
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
                     "productDescription":"Unleaded 1"
                  }
                ]);
        });
})();
