(function () {
    "use strict";

    var UserManager;

    describe("A User Manager", function () {

        beforeEach(function () {

            module("app.shared.auth");

            inject(function (_UserManager_) {
                UserManager = _UserManager_;
            });

        });

        describe("has an activate function that", function () {

            // TODO: test something here?

        });


        describe("has a getNewUser function that", function () {

            it("should return a new User object", function () {
                expect(UserManager.getNewUser()).toEqual(jasmine.objectContaining({
                    username: "",
                    password: "",
                    oauth: null
                }));
            });

        });

        describe("has a setProfile function that", function () {

            var newUsername = "SomeDifferentUser",
                newOauth = {
                    refreshToken: "aslkjb9sf8g7olkq2jr4",
                    accessToken: "345978243095yhwjkerhy"
                };

            beforeEach(function () {
                UserManager.setProfile(newUsername, newOauth);
            });

            it("should set the username with the passed in argument", function () {
                expect(UserManager.getProfile().username).toEqual(newUsername);
            });

            it("should set the oauth object with the passed in argument", function () {
                expect(UserManager.getProfile().oauth).toEqual(newOauth);
            });

        });

        describe("has a getProfile function that", function () {

            var newUsername = "SomeDifferentUser",
                newOauth = {
                    refreshToken: "aslkjb9sf8g7olkq2jr4",
                    accessToken: "345978243095yhwjkerhy"
                };

            beforeEach(function () {
                UserManager.setProfile(newUsername, newOauth);
            });

            it("should return the User's profile", function () {
                expect(UserManager.getProfile())
                    .toEqual(jasmine.objectContaining({username: newUsername, oauth: newOauth}));
            });

        });

        describe("has a User profile that", function () {

            var newUsername = "SomeDifferentUser",
                newOauth = {
                    refreshToken: "aslkjb9sf8g7olkq2jr4",
                    accessToken: "345978243095yhwjkerhy"
                },
                profile;

            beforeEach(function () {
                UserManager.setProfile(newUsername, newOauth);

                profile = UserManager.getProfile();
            });

            it("has a username", function () {
                expect(profile.username).toBeDefined();
            });

            it("has an oauth object", function () {
                expect(profile.oauth).toBeDefined();
            });

            describe("has an isLoggedIn function that", function () {

                it("should return the oauth object", function () {
                    expect(profile.isLoggedIn()).toEqual(profile.oauth);
                });

            });

            describe("has a logOut function that", function () {

                beforeEach(function () {
                    profile.logOut();
                });

                it("should null out the oauth object", function () {
                    expect(profile.oauth).toBeNull();
                });

            });

        });

    });

})();