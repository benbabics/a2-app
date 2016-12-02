(function () {
    "use strict";

    var self;

    beforeAll(function () {
        this.includeDependencies = function (options, scope) {
            options = options || {};

            if (options.includeSharedDependencies === undefined) {
                options.includeSharedDependencies = true;
            }

            if (options.includeAppDependencies === undefined) {
                options.includeAppDependencies = true;
            }

            if (options.includeHtml === undefined) {
                options.includeHtml = false;
            }

            if (options.includeSharedDependencies) {
                module("app.shared", ["$provide", _.partial(TestUtils.provideCommonSharedMockDependencies, _, function (mocks) {
                    //add all common mocks to the currently executing test suite
                    if (scope) {
                        _.forEach(mocks, function (mock, name) {
                            _.set(options.mocks || scope, name, mock);
                        });
                    }
                }, options.commonSharedMockExclusions)]);
            }

            if (options.includeAppDependencies) {
                options.includeHtml = true;

                module("app.components", ["$provide", _.partial(TestUtils.provideCommonAppMockDependencies, _, function (mocks) {
                    if (scope) {
                        //add all common mocks to the currently executing test suite
                        _.forEach(mocks, function (mock, name) {
                            _.set(options.mocks || scope, name, mock);
                        });
                    }
                }, options.commonAppMockExclusions)]);
            }

            if (options.includeHtml) {
                module("app.templates");
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

            if (scope) {
                scope.$dependenciesIncluded = true;
            }
        };
    });

    beforeEach(function () {
        self = this;

        if (!self.deferIncludes && !self.$dependenciesIncluded) {
            self.includeDependencies({
                includeSharedDependencies : self.includeSharedDependencies,
                includeAppDependencies    : self.includeAppDependencies,
                includeHtml               : self.includeHtml,
                commonSharedMockExclusions: self.commonSharedMockExclusions,
                commonAppMockExclusions   : self.commonAppMockExclusions
            }, self);

            self.$dependenciesIncluded = false;
        }
    });

    afterEach(function () {
        self = null;
    });
})();
