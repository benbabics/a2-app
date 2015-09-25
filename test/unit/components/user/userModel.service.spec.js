(function () {
    "use strict";

    describe("A User Model Service", function () {

        var _;

        beforeEach(function () {
            module("app.shared");
            module("app.components.account");
            module("app.components.user");

            inject(function (CommonService) {
                _ = CommonService._;
            });
        });

        describe("has a set function that", function () {

            var user,
                mockUserResource,
                userModelKeys,
                userResourceKeys;

            beforeEach(inject(function (UserModel, UserAccountModel) {
                user = new UserModel();

                mockUserResource = angular.extend(TestUtils.getRandomUser(UserModel, UserAccountModel), {
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
                userResourceKeys = _.keys(mockUserResource);
            }));

            it("should set the UserModel object with the fields from the passed in userResource object that they have in common", function () {
                var key,
                    keysIntersection = _.intersection(userModelKeys, userResourceKeys);

                user.set(mockUserResource);

                for (var i = 0; i < keysIntersection.length; i++) {
                    key = keysIntersection[i];
                    expect(user[key]).toEqual(mockUserResource[key]);
                }
            });

            it("should NOT change the UserModel object fields that the userResource object does not have", function () {
                var key,
                    keysDifference = _.difference(userModelKeys, userResourceKeys);

                user.set(mockUserResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(user[key]).toEqual("default");
                }
            });

            it("should extend the UserModel object with the fields from the passed in userResource object that the UserModel does not have", function () {
                var key,
                    keysDifference = _.difference(userResourceKeys, userModelKeys);

                user.set(mockUserResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(_.has(user, key)).toBeTruthy();
                    expect(user[key]).toEqual(mockUserResource[key]);
                }
            });

        });

    });

})();