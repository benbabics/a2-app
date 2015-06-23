(function () {
    "use strict";

    var UserManager,
        LocalStorage,
        mockUserProfile = {
            username: "SomeUser",
            oauth: {
                refreshToken: "1349758ukdafgn975",
                accessToken: "as;kv987145oihkfdp9u"
            }
        };

    describe("A User Manager", function () {

        beforeEach(function () {

            module("app.shared.auth");

            // mock dependencies
            LocalStorage = jasmine.createSpyObj("LocalStorage", ["setObject", "getObject"]);
            LocalStorage.getObject.and.returnValue(mockUserProfile);

            module(function($provide) {
                $provide.value("LocalStorage", LocalStorage);
            });

            inject(function (_UserManager_) {
                UserManager = _UserManager_;
            });

        });

        describe("has an activate function that", function () {

            it("should get the user's profile out of LocalStorage", function () {
                expect(LocalStorage.getObject).toHaveBeenCalledWith("utoken");
            });

            describe("when the user profile is found in LocalStorage", function () {

                it("should set the user's username", function () {
                    expect(UserManager.getProfile().username).toEqual(mockUserProfile.username);
                });

                it("should set the user's oauth object", function () {
                    expect(UserManager.getProfile().oauth).toEqual(mockUserProfile.oauth);
                });

            });

            // TODO: figure out how to test calling activate() again when LocalStorage doesn't return the user profile
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

            it("should store the user profile in LocalStorage", function () {
                expect(LocalStorage.setObject).toHaveBeenCalledWith("utoken",
                    jasmine.objectContaining({username: newUsername, oauth: newOauth}));
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

            describe("has a loggedIn function that", function () {

                it("should return the oauth object", function () {
                    expect(profile.loggedIn).toEqual(profile.oauth);
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