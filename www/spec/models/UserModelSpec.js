define(["Squire"],
    function (Squire) {

        "use strict";

        var squire = new Squire(),
            userModel;

        describe("A User Model", function () {
            var jasmineAsync = new AsyncSpec(this);

            jasmineAsync.beforeEach(function (done) {
                squire.require(["models/UserModel"], function (UserModel) {
                    userModel = UserModel.getInstance();

                    done();
                });
            });

            it("is defined", function () {
                expect(userModel).toBeDefined();
            });

            it("looks like a Backbone model", function () {
                expect(userModel instanceof Backbone.Model).toBeTruthy();
            });

            describe("has property defaults that", function () {
                it("should set authenticated to default", function () {
                    expect(userModel.defaults.authenticated).toBeFalsy();
                });

                it("should set email to default", function () {
                    expect(userModel.defaults.email).toBeNull();
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(userModel, "set").andCallThrough();
                });

                it("is defined", function () {
                    expect(userModel.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(userModel.initialize).toEqual(jasmine.any(Function));
                });

                describe("when options are not provided", function () {
                    beforeEach(function () {
                        userModel.initialize();
                    });

                    it("should NOT call set", function () {
                        expect(userModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided but email attribute is not", function () {
                    var options = {};

                    beforeEach(function () {
                        userModel.initialize(options);
                    });

                    it("should NOT call set", function () {
                        expect(userModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided", function () {
                    var options = {
                        email: "mobiledevelopment@wexinc.com"
                    };

                    beforeEach(function () {
                        userModel.initialize(options);
                    });

                    it("should set email", function () {
                        expect(userModel.set).toHaveBeenCalledWith("email", options.email);
                    });
                });
            });
        });
    });
