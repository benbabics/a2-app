(function () {
    "use strict";

    var UserManager,
        mockUserProfile = {};

    describe("A User Manager", function () {

        beforeEach(function () {

            module("app.shared");

            mockUserProfile = jasmine.createSpyObj("UserModel", ["UserModel", "set"]);

            inject(function (_UserManager_, UserModel) {
                angular.extend(mockUserProfile, new UserModel());

                UserManager = _UserManager_;
                UserManager.setProfile(mockUserProfile);
            });
        });

        describe("has an activate function that", function () {

            // TODO: figure out how to test this

        });

        describe("has a getNewUser function that", function () {

            it("should return a new User object", function () {
                expect(UserManager.getNewUser()).toEqual(jasmine.objectContaining({
                    username: "",
                    oauth: null
                }));
            });

        });

        describe("has a setUserData function that", function () {

            var newUsername = "SomeDifferentUser",
                newOauth = {
                    refreshToken: "aslkjb9sf8g7olkq2jr4",
                    accessToken: "345978243095yhwjkerhy"
                };

            beforeEach(function () {
                UserManager.setUserData(newUsername, newOauth);
            });

            it("should set the username with the passed in argument", function () {
                expect(mockUserProfile.username).toEqual(newUsername);
            });

            it("should set the oauth object with the passed in argument", function () {
                expect(mockUserProfile.oauth).toEqual(newOauth);
            });

        });

        describe("has a setProfile function that", function () {

            var newProfile = {
                username:"SomeDifferentUser",
                oauth: {
                    refreshToken: "aslkjb9sf8g7olkq2jr4",
                    accessToken: "345978243095yhwjkerhy"
                }
            };

            beforeEach(function () {
                UserManager.setProfile(newProfile);
            });

            // TODO: figure out how to test this without direct access to profile
        });

        describe("has a getUsername function that", function () {

            beforeEach(function () {
                mockUserProfile.username = "SomeDifferentUser";
            });

            it("should return the username property from the profile", function () {
                expect(UserManager.getUsername()).toEqual(mockUserProfile.username);
            });
        });

        describe("has a getAuthToken function that", function () {

            beforeEach(function () {
                mockUserProfile.oauth = {
                    refreshToken: "aslkjb9sf8g7olkq2jr4",
                    accessToken: "345978243095yhwjkerhy"
                };
            });

            it("should return the oauth object of the profile", function () {
                expect(UserManager.getAuthToken()).toEqual(mockUserProfile.oauth);
            });

        });

        describe("has a hasAuthentication function that", function () {

            it("should return true when the oauth object is NOT empty", function () {
                mockUserProfile.oauth = "Fake oauth value";

                expect(UserManager.hasAuthentication()).toBeTruthy();
            });

            it("should return false when the oauth object is empty", function () {
                mockUserProfile.oauth = "";

                expect(UserManager.hasAuthentication()).toBeFalsy();
            });

            it("should return false when the oauth object is null", function () {
                mockUserProfile.oauth = null;

                expect(UserManager.hasAuthentication()).toBeFalsy();
            });

            it("should return false when the oauth object is undefined", function () {
                mockUserProfile.oauth = undefined;

                expect(UserManager.hasAuthentication()).toBeFalsy();
            });

        });

        describe("has a clearAuthentication function that", function () {

            beforeEach(function () {
                mockUserProfile.oauth = "Fake oauth value";

                UserManager.clearAuthentication();
            });

            it("should null out the oauth object", function () {
                expect(mockUserProfile.oauth).toBeNull();
            });
        });

    });

})();