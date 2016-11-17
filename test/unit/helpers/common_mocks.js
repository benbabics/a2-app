(function () {
    "use strict";

    var self;

    beforeEach(function () {
        self = this;

        self.includeDependencies = function () {
            if (self.includeSharedDependencies) {
                module("app.shared", ["$provide", _.partial(TestUtils.provideCommonSharedMockDependencies, _, function (mocks) {
                    //add all common mocks to the currently executing test suite
                    _.forEach(mocks, function (mock, name) {
                        _.set(self, name, mock);
                    });
                }, self.commonSharedMockExclusions)]);
            }

            if (self.includeAppDependencies) {
                self.includeHtml = true;

                module("app.components", ["$provide", _.partial(TestUtils.provideCommonAppMockDependencies, _, function (mocks) {
                    //add all common mocks to the currently executing test suite
                    _.forEach(mocks, function (mock, name) {
                        _.set(self, name, mock);
                    });
                }, self.commonAppMockExclusions)]);
            }

            if (self.includeHtml) {
                module("app.html");
            }
            else {
                // stub the routing and template loading
                module(function ($urlRouterProvider) {
                    $urlRouterProvider.deferIntercept();
                });

                module(function ($provide) {
                    $provide.value("$ionicTemplateCache", _.noop);
                });
            }
        };

        if (self.includeSharedDependencies === undefined) {
            self.includeSharedDependencies = true;
        }

        if (self.includeAppDependencies === undefined) {
            self.includeAppDependencies = true;
        }

        if (self.includeHtml === undefined) {
            self.includeHtml = false;
        }

        if (!self.deferIncludes) {
            self.includeDependencies();
        }
    });

    afterEach(function () {
        self = null;
    });
})();
