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

                it("should set firstName to default", function () {
                    expect(userModel.defaults.firstName).toBeNull();
                });

                it("should set email to default", function () {
                    expect(userModel.defaults.email).toBeNull();
                });

                it("should set selectedCompany to default", function () {
                    expect(userModel.defaults.selectedCompany).toBeNull();
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

                describe("when options are provided without attributes", function () {
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
                            authenticated: true,
                            firstName: "Beavis",
                            email: "cornholio@bnbinc.com",
                            selectedCompany: {
                                name: "Beavis and Butthead Inc",
                                wexAccountNumber: "5764309"
                            }
                        };

                    beforeEach(function () {
                        userModel.initialize(options);
                    });

                    it("should set authenticated", function () {
                        expect(userModel.set).toHaveBeenCalledWith("authenticated", options.authenticated);
                    });

                    it("should set firstName", function () {
                        expect(userModel.set).toHaveBeenCalledWith("firstName", options.firstName);
                    });

                    it("should set email", function () {
                        expect(userModel.set).toHaveBeenCalledWith("email", options.email);
                    });

                    it("should set selectedCompany", function () {
                        expect(userModel.set).toHaveBeenCalledWith("selectedCompany", options.selectedCompany);
                    });
                });
            });

            describe("has a reset function that", function () {
                beforeEach(function () {
                    spyOn(userModel, "set").andCallThrough();

                    userModel.reset();
                });

                it("is defined", function () {
                    expect(userModel.reset).toBeDefined();
                });

                it("is a function", function () {
                    expect(userModel.reset).toEqual(jasmine.any(Function));
                });

                it("should call set", function () {
                    expect(userModel.set).toHaveBeenCalledWith(userModel.defaults);
                });
            });
        });
    });
