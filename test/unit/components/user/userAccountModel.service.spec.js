(function () {
    "use strict";

    describe("A User Account Model Service", function () {

        var _;

        beforeEach(function () {
            module("app.shared");
            module("app.components.user");

            inject(function (___) {
                _ = ___;
            });
        });

        describe("has a set function that", function () {

            var userAccount,
                mockUserAccountResource,
                userAccountModelKeys,
                userAccountResourceKeys;

            beforeEach(inject(function (UserAccountModel) {
                userAccount = new UserAccountModel();

                mockUserAccountResource = angular.extend(TestUtils.getRandomUserAccount(UserAccountModel), {
                    newField1: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    newField2: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    newField3: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                });

                // set all values to "default" to more easily detect any changes
                for (var property in userAccount) {
                    if (_.has(userAccount, property)) {
                        userAccount[property] = "default";
                    }
                }

                userAccountModelKeys = _.keys(userAccount);
                userAccountResourceKeys = _.keys(mockUserAccountResource);
            }));

            it("should set the UserAccountModel object with the fields from the passed in userAccountResource object that they have in common", function () {
                var key,
                    keysIntersection = _.intersection(userAccountModelKeys, userAccountResourceKeys);

                userAccount.set(mockUserAccountResource);

                for (var i = 0; i < keysIntersection.length; i++) {
                    key = keysIntersection[i];
                    expect(userAccount[key]).toEqual(mockUserAccountResource[key]);
                }
            });

            it("should NOT change the UserAccountModel object fields that the userAccountResource object does not have", function () {
                var key,
                    keysDifference = _.difference(userAccountModelKeys, userAccountResourceKeys);

                userAccount.set(mockUserAccountResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(userAccount[key]).toEqual("default");
                }
            });

            it("should extend the AccountModel object with the fields from the passed in userAccountResource object that the AccountModel does not have", function () {
                var key,
                    keysDifference = _.difference(userAccountResourceKeys, userAccountModelKeys);

                userAccount.set(mockUserAccountResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(_.has(userAccount, key)).toBeTruthy();
                    expect(userAccount[key]).toEqual(mockUserAccountResource[key]);
                }
            });

        });

    });

})();