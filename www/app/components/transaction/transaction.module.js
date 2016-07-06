(function () {
    "use strict";

    angular.module("app.components.transaction", ["app.components.account"])
        .run(function ($ionicPlatform, $rootScope, TransactionManager) {

            function handleApplicationLogOut() {
                TransactionManager.clearCachedValues();
            }

            $ionicPlatform.ready(function () {
                //setup event listeners:
                $rootScope.$on("app:logout", handleApplicationLogOut);
            });
        })

        .run(function($httpBackend) {
            // Create a faux HTTP response for request
            $httpBackend.whenGET(/.*?accounts\/[^/]*\/postedTransactions?.*/g)
                .respond([
                  {
                     "transactionId":"1364617615",
                     "transactionDate":"2015-04-24T12:29:00+00:00",
                     "postDate":"2015-04-28T04:00:00+00:00",
                     "accountName":"Kerkstra Portable Restrooms Inc",
                     "embossedAccountNumber":"xxxxxx2939",
                     "embossedCardNumber":"88136",
                     "driverFirstName":"Generic",
                     "driverMiddleName":" ",
                     "driverLastName":"Driver",
                     "customVehicleId":" ",
                     "merchantBrand":"Exxonmobil",
                     "merchantName":"Country Side Mobil",
                     "merchantAddress":"4842 Port Sheldon St",
                     "merchantCity":"Hudsonville",
                     "merchantState":"MI",
                     "merchantZipCode":"49426-8927",
                     "productDescription":"Unleaded 1",
                     "grossCost":85.2,
                     "netCost":85.2
                  },
                  {
                     "transactionId":"1362318030",
                     "transactionDate":"2015-04-22T16:13:00+00:00",
                     "postDate":"2015-04-24T04:00:00+00:00",
                     "accountName":"Kerkstra Portable Restrooms Inc",
                     "embossedAccountNumber":"xxxxxx2939",
                     "embossedCardNumber":"18133",
                     "driverFirstName":"Generic",
                     "driverMiddleName":" ",
                     "driverLastName":"Driver",
                     "customVehicleId":" ",
                     "merchantBrand":"Exxonmobil",
                     "merchantName":"Allendale Mobil Mart",
                     "merchantAddress":"6209 Lake Michigan Dr",
                     "merchantCity":"Allendale",
                     "merchantState":"MI",
                     "merchantZipCode":"49401-9102",
                     "productDescription":"Unleaded 1",
                     "grossCost":40.19,
                     "netCost":40.19
                  },
                  {
                     "transactionId":"1364617615",
                     "transactionDate":"2015-04-24T12:29:00+00:00",
                     "postDate":"2015-04-28T04:00:00+00:00",
                     "accountName":"Kerkstra Portable Restrooms Inc",
                     "embossedAccountNumber":"xxxxxx2939",
                     "embossedCardNumber":"88136",
                     "driverFirstName":"Generic",
                     "driverMiddleName":" ",
                     "driverLastName":"Driver",
                     "customVehicleId":" ",
                     "merchantBrand":"Exxonmobil",
                     "merchantName":"Country Side Mobil",
                     "merchantAddress":"4842 Port Sheldon St",
                     "merchantCity":"Hudsonville",
                     "merchantState":"MI",
                     "merchantZipCode":"49426-8927",
                     "productDescription":"Unleaded 1",
                     "grossCost":85.2,
                     "netCost":85.2
                  },
                  {
                     "transactionId":"1362318030",
                     "transactionDate":"2015-04-22T16:13:00+00:00",
                     "postDate":"2015-04-24T04:00:00+00:00",
                     "accountName":"Kerkstra Portable Restrooms Inc",
                     "embossedAccountNumber":"xxxxxx2939",
                     "embossedCardNumber":"18133",
                     "driverFirstName":"Generic",
                     "driverMiddleName":" ",
                     "driverLastName":"Driver",
                     "customVehicleId":" ",
                     "merchantBrand":"Exxonmobil",
                     "merchantName":"Allendale Mobil Mart",
                     "merchantAddress":"6209 Lake Michigan Dr",
                     "merchantCity":"Allendale",
                     "merchantState":"MI",
                     "merchantZipCode":"49401-9102",
                     "productDescription":"Unleaded 1",
                     "grossCost":40.19,
                     "netCost":40.19
                  },
                  {
                     "transactionId":"1364617615",
                     "transactionDate":"2015-04-24T12:29:00+00:00",
                     "postDate":"2015-04-28T04:00:00+00:00",
                     "accountName":"Kerkstra Portable Restrooms Inc",
                     "embossedAccountNumber":"xxxxxx2939",
                     "embossedCardNumber":"88136",
                     "driverFirstName":"Generic",
                     "driverMiddleName":" ",
                     "driverLastName":"Driver",
                     "customVehicleId":" ",
                     "merchantBrand":"Exxonmobil",
                     "merchantName":"Country Side Mobil",
                     "merchantAddress":"4842 Port Sheldon St",
                     "merchantCity":"Hudsonville",
                     "merchantState":"MI",
                     "merchantZipCode":"49426-8927",
                     "productDescription":"Unleaded 1",
                     "grossCost":85.2,
                     "netCost":85.2
                  },
                  {
                     "transactionId":"1362318030",
                     "transactionDate":"2015-04-22T16:13:00+00:00",
                     "postDate":"2015-04-24T04:00:00+00:00",
                     "accountName":"Kerkstra Portable Restrooms Inc",
                     "embossedAccountNumber":"xxxxxx2939",
                     "embossedCardNumber":"18133",
                     "driverFirstName":"Generic",
                     "driverMiddleName":" ",
                     "driverLastName":"Driver",
                     "customVehicleId":" ",
                     "merchantBrand":"Exxonmobil",
                     "merchantName":"Allendale Mobil Mart",
                     "merchantAddress":"6209 Lake Michigan Dr",
                     "merchantCity":"Allendale",
                     "merchantState":"MI",
                     "merchantZipCode":"49401-9102",
                     "productDescription":"Unleaded 1",
                     "grossCost":40.19,
                     "netCost":40.19
                  },
                  {
                     "transactionId":"1364617615",
                     "transactionDate":"2015-04-24T12:29:00+00:00",
                     "postDate":"2015-04-28T04:00:00+00:00",
                     "accountName":"Kerkstra Portable Restrooms Inc",
                     "embossedAccountNumber":"xxxxxx2939",
                     "embossedCardNumber":"88136",
                     "driverFirstName":"Generic",
                     "driverMiddleName":" ",
                     "driverLastName":"Driver",
                     "customVehicleId":" ",
                     "merchantBrand":"Exxonmobil",
                     "merchantName":"Country Side Mobil",
                     "merchantAddress":"4842 Port Sheldon St",
                     "merchantCity":"Hudsonville",
                     "merchantState":"MI",
                     "merchantZipCode":"49426-8927",
                     "productDescription":"Unleaded 1",
                     "grossCost":85.2,
                     "netCost":85.2
                  },
                  {
                     "transactionId":"1362318030",
                     "transactionDate":"2015-04-22T16:13:00+00:00",
                     "postDate":"2015-04-24T04:00:00+00:00",
                     "accountName":"Kerkstra Portable Restrooms Inc",
                     "embossedAccountNumber":"xxxxxx2939",
                     "embossedCardNumber":"18133",
                     "driverFirstName":"Generic",
                     "driverMiddleName":" ",
                     "driverLastName":"Driver",
                     "customVehicleId":" ",
                     "merchantBrand":"Exxonmobil",
                     "merchantName":"Allendale Mobil Mart",
                     "merchantAddress":"6209 Lake Michigan Dr",
                     "merchantCity":"Allendale",
                     "merchantState":"MI",
                     "merchantZipCode":"49401-9102",
                     "productDescription":"Unleaded 1",
                     "grossCost":40.19,
                     "netCost":40.19
                  }
                ]);
        });
})();
