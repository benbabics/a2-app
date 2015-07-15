"use strict";

var RetrieveCurrentUserRequestSuccessMock = (function () {

    function RetrieveCurrentUserRequestSuccessMock() {
        angular.module("RetrieveCurrentUserMock", ["app", "ngMockE2E"])
            .run(function ($httpBackend) {

                var mockRetrieveCurrentUserResponse = {
                    firstName: "firstName",
                    username : "username",
                    company  : {
                        accountId    : "companyAccountId",
                        accountNumber: "companyAccountNumber",
                        name         : "companyName"
                    },
                    billingCompany: {
                        accountId    : "billingCompanyAccountId",
                        accountNumber: "billingCompanyAccountNumber",
                        name         : "billingCompanyName"
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