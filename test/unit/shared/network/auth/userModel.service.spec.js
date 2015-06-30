(function () {
    "use strict";

    describe("A UserModel Service", function () {

        var _;

        beforeEach(function () {
            module("app.shared");

            inject(function (CommonService) {
                _ = CommonService._;
            });
        });

        describe("has a set function that", function () {

            var user,
                mockUserResource = {
                    newField1: "some value",
                    newField2: "some other value",
                    newField3: "yet another value",
                    username : "username value",
                    password : "password value",
                    oauth    : "OAuth2Token value"
                },
                userModelKeys,
                userResourceKeys;

            beforeEach(inject(function (UserModel) {
                user = new UserModel();

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

        describe("has an isLoggedIn function that", function () {
            var user;

            beforeEach(inject(function (UserModel) {
                user = new UserModel();
                user.oauth = "Fake oauth value";
            }));

            it("should return the oauth object", function () {
                expect(user.isLoggedIn()).toEqual(user.oauth);
            });

        });

        describe("has a logOut function that", function () {
            var user;

            beforeEach(inject(function (UserModel) {
                user = new UserModel();
                user.oauth = "Fake oauth value";

                user.logOut();
            }));

            it("should null out the oauth object", function () {
                expect(user.oauth).toBeNull();
            });
        });
    });

})();