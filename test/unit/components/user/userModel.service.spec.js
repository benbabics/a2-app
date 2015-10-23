(function () {
    "use strict";

    describe("A User Model Service", function () {

        var _,
            user,
            ONLINE_APPLICATION;

        beforeEach(function () {
            module("app.shared");
            module("app.components.account");
            module("app.components.user");

            inject(function (sharedGlobals, CommonService, UserModel) {
                _ = CommonService._;
                ONLINE_APPLICATION = sharedGlobals.USER.ONLINE_APPLICATION;
                user = new UserModel();
            });
        });

        describe("has a set function that", function () {

            var userResource,
                userModelKeys,
                userResourceKeys;

            beforeEach(inject(function (UserModel, UserAccountModel) {
                userResource = angular.extend(TestUtils.getRandomUser(UserModel, UserAccountModel), {
                    newField1: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    newField2: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    newField3: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                });

                // set all values to "default" to more easily detect any changes
                for (var property in user) {
                    if (_.has(user, property)) {
                        user[property] = "default";
                    }
                }

                userModelKeys = _.keys(user);
                userResourceKeys = _.keys(userResource);
            }));

            it("should set the UserModel object with the fields from the passed in userResource object that they have in common", function () {
                var key,
                    keysIntersection = _.intersection(userModelKeys, userResourceKeys);

                user.set(userResource);

                for (var i = 0; i < keysIntersection.length; i++) {
                    key = keysIntersection[i];
                    expect(user[key]).toEqual(userResource[key]);
                }
            });

            it("should NOT change the UserModel object fields that the userResource object does not have", function () {
                var key,
                    keysDifference = _.difference(userModelKeys, userResourceKeys);

                user.set(userResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(user[key]).toEqual("default");
                }
            });

            it("should extend the UserModel object with the fields from the passed in userResource object that the UserModel does not have", function () {
                var key,
                    keysDifference = _.difference(userResourceKeys, userModelKeys);

                user.set(userResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(_.has(user, key)).toBeTruthy();
                    expect(user[key]).toEqual(userResource[key]);
                }
            });

        });

        describe("has a getDisplayAccountNumber function that", function () {

            describe("when the online application type is WOL_NP", function () {

                beforeEach(function () {
                    user.onlineApplication = ONLINE_APPLICATION.WOL_NP;
                });

                it("should return the accountNumber", function () {
                    expect(user.getDisplayAccountNumber()).toEqual(user.billingCompany.accountNumber);
                });
            });

            describe("when the online application type is CLASSIC", function () {

                beforeEach(function () {
                    user.onlineApplication = ONLINE_APPLICATION.CLASSIC;
                });

                it("should return the wexAccountNumber", function () {
                    expect(user.getDisplayAccountNumber()).toEqual(user.billingCompany.wexAccountNumber);
                });
            });

            describe("when the online application type is unrecognized", function () {

                beforeEach(function () {
                    user.onlineApplication = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                });

                it("should return the accountNumber", function () {
                    expect(user.getDisplayAccountNumber()).toEqual(user.billingCompany.accountNumber);
                });
            });

            describe("when the online application type is empty", function () {

                beforeEach(function () {
                    user.onlineApplication = "";
                });

                it("should return the accountNumber", function () {
                    expect(user.getDisplayAccountNumber()).toEqual(user.billingCompany.accountNumber);
                });
            });

            describe("when the online application type is null", function () {

                beforeEach(function () {
                    user.onlineApplication = null;
                });

                it("should return the accountNumber", function () {
                    expect(user.getDisplayAccountNumber()).toEqual(user.billingCompany.accountNumber);
                });
            });

            describe("when the online application type is undefined", function () {

                beforeEach(function () {
                    delete user.onlineApplication;
                });

                it("should return the accountNumber", function () {
                    expect(user.getDisplayAccountNumber()).toEqual(user.billingCompany.accountNumber);
                });
            });
        });

    });

})();