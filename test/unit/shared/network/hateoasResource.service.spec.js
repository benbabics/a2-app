(function () {
    "use strict";

    var $q,
        $rootScope,
        HateoasResource,
        CommonService,
        SecureApiRestangular,
        oneUrlResponse,
        resourceModel,
        hateoasModel;

    describe("A Hateoas Resource service", function () {

        beforeEach(function () {
            module("app.shared");

            //mock dependencies:
            SecureApiRestangular = jasmine.createSpyObj("SecureApiRestangular", ["oneUrl"]);
            oneUrlResponse = jasmine.createSpyObj("oneUrlResponse", ["get"]);

            module(function ($provide) {
                $provide.value("SecureApiRestangular", SecureApiRestangular);
            });

            inject(function (_$rootScope_, _$q_, _HateoasResource_, _CommonService_) {
                HateoasResource = _HateoasResource_;
                CommonService = _CommonService_;
                $q = _$q_;
                $rootScope = _$rootScope_;
            });

            //setup mocks:
            SecureApiRestangular.oneUrl.and.returnValue(oneUrlResponse);
            resourceModel = {
                links: {}
            };
            hateoasModel = new HateoasResource(resourceModel);
        });

        describe("has a constructor that", function () {

            describe("when given a resource model", function () {

                it("should extend the resource model", function () {
                    expect(hateoasModel).toEqual(angular.extend(new HateoasResource(), resourceModel));
                });
            });
        });

        describe("has a fetchResource function that", function () {

            describe("when given a resource type", function () {
                var resourceType;

                beforeEach(function () {
                    resourceType = TestUtils.getRandomStringThatIsAlphaNumeric(10).toLowerCase();
                });

                describe("when a URL for the given resource type is found", function () {
                    var link;

                    beforeEach(function () {
                        link = hateoasModel.links[resourceType] = {
                            rel: resourceType,
                            href: TestUtils.getRandomStringThatIsAlphaNumeric(15)
                        };
                    });

                    describe("when fetching the resource from the URL succeeds", function () {
                        var resourceUrlPromise,
                            response,
                            result;

                        beforeEach(function () {
                            response = {
                                data: TestUtils.getRandomStringThatIsAlphaNumeric(25)
                            };
                            resourceUrlPromise = $q.resolve(response);
                            oneUrlResponse.get.and.returnValue(resourceUrlPromise);
                        });

                        beforeEach(function () {
                            result = hateoasModel.fetchResource(resourceType);
                        });

                        it("should return a promise that resolves with the resource data", function (done) {
                            result.then(function (data) {
                                expect(data).toEqual(response.data);

                                done();
                            });

                            $rootScope.$digest();
                        });
                    });

                    describe("when fetching the resource from the URL fails", function () {
                        var resourceUrlPromise,
                            response;

                        beforeEach(function () {
                            response = {
                                message: TestUtils.getRandomStringThatIsAlphaNumeric(25)
                            };
                            resourceUrlPromise = $q.reject(response);
                            oneUrlResponse.get.and.returnValue(resourceUrlPromise);
                        });

                        beforeEach(function () {
                            hateoasModel.fetchResource(resourceType);
                        });

                        it("should throw an error", function () {
                            var expectedError = "Failed to fetch HATEOAS resource from " + link.href + " - " + response.message;

                            expect(function () {
                                hateoasModel.fetchResource(resourceType);
                                $rootScope.$digest();
                            }).toThrowError(expectedError);
                        });
                    });
                });

                describe("when a URL for the given resource type is NOT found", function () {

                    beforeEach(function () {
                        delete hateoasModel.links[resourceType];
                    });

                    it("should throw an error", function () {
                        var expectedError = "HATEOAS resource type not found: " + resourceType;

                        expect(function () {
                            hateoasModel.fetchResource(resourceType);
                        }).toThrowError(expectedError);
                    });
                });
            });

            describe("when NOT given a resourceType", function () {
                var defaultResourceType = "self";

                describe("when a URL is found", function () {
                    var link;

                    beforeEach(function () {
                        link = hateoasModel.links[defaultResourceType] = {
                            rel: defaultResourceType,
                            href: TestUtils.getRandomStringThatIsAlphaNumeric(15)
                        };
                    });

                    describe("when fetching the resource from the URL succeeds", function () {
                        var resourceUrlPromise,
                            response,
                            result;

                        beforeEach(function () {
                            response = {
                                data: TestUtils.getRandomStringThatIsAlphaNumeric(25)
                            };
                            resourceUrlPromise = $q.resolve(response);
                            oneUrlResponse.get.and.returnValue(resourceUrlPromise);
                        });

                        beforeEach(function () {
                            result = hateoasModel.fetchResource(defaultResourceType);
                        });

                        it("should return a promise that resolves with the resource data", function (done) {
                            result.then(function (data) {
                                expect(data).toEqual(response.data);

                                done();
                            });

                            $rootScope.$digest();
                        });
                    });

                    describe("when fetching the resource from the URL fails", function () {
                        var resourceUrlPromise,
                            response;

                        beforeEach(function () {
                            response = {
                                message: TestUtils.getRandomStringThatIsAlphaNumeric(25)
                            };
                            resourceUrlPromise = $q.reject(response);
                            oneUrlResponse.get.and.returnValue(resourceUrlPromise);
                        });

                        beforeEach(function () {
                            hateoasModel.fetchResource(defaultResourceType);
                        });

                        it("should throw an error", function () {
                            var expectedError = "Failed to fetch HATEOAS resource from " + link.href + " - " + response.message;

                            expect(function () {
                                hateoasModel.fetchResource(defaultResourceType);
                                $rootScope.$digest();
                            }).toThrowError(expectedError);
                        });
                    });
                });

                describe("when a URL is NOT found", function () {

                    beforeEach(function () {
                        delete hateoasModel.links[defaultResourceType];
                    });

                    it("should throw an error", function () {
                        var expectedError = "HATEOAS resource type not found: " + defaultResourceType;

                        expect(function () {
                            hateoasModel.fetchResource(defaultResourceType);
                        }).toThrowError(expectedError);
                    });
                });
            });
        });
    });
}());