"use strict";

var RetrieveCurrentUserRequestSuccessMock = (function () {

    function RetrieveCurrentUserRequestSuccessMock() {
        angular.module("RetrieveCurrentUserMock", ["app", "ngMockE2E"])
            .run(function ($httpBackend) {

                var mockRetrieveCurrentUserResponse = {
                    firstName: "first name value",
                    username : "username value",
                    company  : {
                        accountId    : "company account id value",
                        accountNumber: "company account number value",
                        name         : "company name value"
                    },
                    billingCompany: {
                        accountId    : "billing company account id value",
                        accountNumber: "billing company account number value",
                        name         : "billing company name value"
                    }
                };

                $httpBackend.whenGET(/\/users\/current/).respond(function (method, url, data, headers) {
                    return [200, mockRetrieveCurrentUserResponse, {}];
                });
            });
    }

    return RetrieveCurrentUserRequestSuccessMock;

})();

module.exports = RetrieveCurrentUserRequestSuccessMock;