"use strict";

var FetchCurrentUserRequestFailedMock = (function () {

    function FetchCurrentUserRequestFailedMock() {
        angular.module("FetchCurrentUserMock", ["app", "ngMockE2E"])
            .run(function ($httpBackend) {

                var mockFetchCurrentUserResponse = {
                };

                $httpBackend.whenGET(/\/users\/current/).respond(function (method, url, data, headers) {
                    return [400, mockFetchCurrentUserResponse, {}];
                });
            });
    }

    return FetchCurrentUserRequestFailedMock;

})();

module.exports = FetchCurrentUserRequestFailedMock;