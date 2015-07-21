(function () {
    "use strict";

    var $q,
        $rootScope,
        CURRENT_USER_URL,
        getCurrentUserDeferred,
        resolveHandler,
        rejectHandler,
        AccountModel,
        UserManager,
        UsersResource,
        UsersResourceOne,
        remoteUser = {};

    describe("A User Manager", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.html");
            module("app.components.account");
            module("app.components.user");

            // mock dependencies
            UsersResource = jasmine.createSpyObj("UsersResource", ["one"]);

            module(function ($provide) {
                $provide.value("UsersResource", UsersResource);
            });

            remoteUser = jasmine.createSpyObj("UserModel", ["UserModel", "set"]);

            inject(function (_$q_, _$rootScope_, _AccountModel_, globals, _UserManager_, UserModel) {
                remoteUser = new UserModel();

                $q = _$q_;
                $rootScope = _$rootScope_;
                AccountModel = _AccountModel_;
                UserManager = _UserManager_;
                UserManager.setUser(remoteUser);

                CURRENT_USER_URL = globals.ACCOUNT_MAINTENANCE_API.USERS.CURRENT;
            });

            // set up spies
            UsersResourceOne = jasmine.createSpyObj("UsersResourceOne", ["doGET"]);
            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");

            UsersResource.one.and.returnValue(UsersResourceOne);
        });

        describe("has an activate function that", function () {

            // TODO: figure out how to test this

        });

        describe("has a getNewUser function that", function () {

            it("should return a new User object", function () {
                expect(UserManager.getNewUser()).toEqual(jasmine.objectContaining({
                    email: "",
                    firstName: "",
                    username: "",
                    company: new AccountModel(),
                    billingCompany: new AccountModel()
                }));
            });

        });

        describe("has a fetchCurrentUserDetails function that", function () {

            var mockResponse = {
                    data: {
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
                    }
                };


            beforeEach(function () {
                getCurrentUserDeferred = $q.defer();

                UsersResourceOne.doGET.and.returnValue(getCurrentUserDeferred.promise);

                UserManager.setUser(null);

                UserManager.fetchCurrentUserDetails()
                    .then(resolveHandler, rejectHandler);
            });

            describe("when getting a details of the current user", function () {

                it("should call UsersResource.one", function () {
                    expect(UsersResource.one).toHaveBeenCalledWith();
                });

                it("should call UsersResourceOne.doGET with the correct URL", function () {
                    expect(UsersResourceOne.doGET).toHaveBeenCalledWith(CURRENT_USER_URL);
                });

            });

            describe("when the current user is fetched successfully", function () {

                describe("when there is data in the response", function () {

                    beforeEach(function () {
                        getCurrentUserDeferred.resolve(mockResponse);
                        $rootScope.$digest();
                    });

                    it("should set the user", function () {
                        expect(UserManager.getUser()).toEqual(mockResponse.data);
                    });

                    it("should resolve", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(mockResponse.data);
                        expect(rejectHandler).not.toHaveBeenCalled();
                    });

                });

                describe("when there is no data in the response", function () {

                    beforeEach(function () {
                        getCurrentUserDeferred.resolve(null);
                    });

                    it("should throw an error", function () {
                        expect($rootScope.$digest).toThrow();
                    });

                    it("should NOT update the user", function () {
                        expect(UserManager.getUser()).toBeNull();
                    });

                });
            });

            describe("when retrieving the current user fails", function () {

                var mockResponse = "Some error";

                beforeEach(function () {
                    getCurrentUserDeferred.reject(mockResponse);
                });

                it("should throw an error", function () {
                    expect($rootScope.$digest).toThrow();
                });

                it("should NOT update the user", function () {
                    expect(UserManager.getUser()).toBeNull();
                });

            });

        });

        describe("has a getUser function that", function () {

            var newUser = {
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

            it("should return the user passed to setUser", function () {
                var result;

                UserManager.setUser(newUser);
                result = UserManager.getUser();

                expect(result).toEqual(newUser);
            }) ;

            // TODO: figure out how to test this without using setUser
        });

        describe("has a setUser function that", function () {

            var newUser = {
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

            it("should update the user returned by getUser", function () {
                var result;

                UserManager.setUser(newUser);
                result = UserManager.getUser();

                expect(result).toEqual(newUser);
            }) ;

            // TODO: figure out how to test this without using getUser
        });

    });

})();