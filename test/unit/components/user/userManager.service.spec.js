(function () {
    "use strict";

    var UserManager,
        mockUserProfile = {};

    describe("A User Manager", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.components.user");

            mockUserProfile = jasmine.createSpyObj("UserModel", ["UserModel", "set"]);

            inject(function (_UserManager_, UserModel) {
                angular.extend(mockUserProfile, new UserModel());

                UserManager = _UserManager_;
                UserManager.setUser(mockUserProfile);
            });
        });

        describe("has an activate function that", function () {

            // TODO: figure out how to test this

        });

        describe("has a getNewUser function that", function () {

            it("should return a new User object", function () {
                expect(UserManager.getNewUser()).toEqual(jasmine.objectContaining({
                    username: ""
                }));
            });

        });

        describe("has a setUser function that", function () {

            var newUser = {
                username:"SomeDifferentUser"
            };

            beforeEach(function () {
                UserManager.setUser(newUser);
            });

            // TODO: figure out how to test this without direct access to user
        });

    });

})();