"use strict";

var FetchCurrentUserRequestSuccessMock = (function () {

    function FetchCurrentUserRequestSuccessMock() {
        angular.module("FetchCurrentUserMock", ["app", "ngMockE2E"])
            .run(function ($httpBackend) {

                var mockFetchCurrentUserResponse = {
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
                    return [200, mockFetchCurrentUserResponse, {}];
                });
            });
    }

    return FetchCurrentUserRequestSuccessMock;

})();

module.exports = FetchCurrentUserRequestSuccessMock;