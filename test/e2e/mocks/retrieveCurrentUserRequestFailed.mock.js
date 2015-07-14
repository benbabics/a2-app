"use strict";

var RetrieveCurrentUserRequestFailedMock = (function () {

    function RetrieveCurrentUserRequestFailedMock() {
        angular.module("RetrieveCurrentUserMock", ["app", "ngMockE2E"])
            .run(function ($httpBackend) {

                var mockRetrieveCurrentUserResponse = {
                };

                $httpBackend.whenGET(/\/users\/current/).respond(function (method, url, data, headers) {
                    return [400, mockRetrieveCurrentUserResponse, {}];
                });
            });
    }

    return RetrieveCurrentUserRequestFailedMock;

})();

module.exports = RetrieveCurrentUserRequestFailedMock;