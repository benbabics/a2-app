define(["Squire", "backbone"],
    function (Squire, Backbone) {

        "use strict";

        var squire = new Squire(),
            authorizationProfileModel;

        squire.mock("backbone", Backbone);

        describe("A Authorization Profile Model", function () {
            beforeEach(function (done) {
                squire.require(["models/AuthorizationProfileModel"], function (AuthorizationProfileModel) {
                    authorizationProfileModel = new AuthorizationProfileModel();

                    done();
                });
            });

            it("is defined", function () {
                expect(authorizationProfileModel).toBeDefined();
            });

            it("looks like a Backbone Model", function () {
                expect(authorizationProfileModel instanceof Backbone.Model).toBeTruthy();
            });

            describe("has property defaults that", function () {
                it("should set id to default", function () {
                    expect(authorizationProfileModel.defaults.id).toBeNull();
                });

                it("should set name to default", function () {
                    expect(authorizationProfileModel.defaults.name).toBeNull();
                });

                it("should set productRestriction to default", function () {
                    expect(authorizationProfileModel.defaults.productRestriction).toBeNull();
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(authorizationProfileModel, "set").and.callThrough();
                });

                it("is defined", function () {
                    expect(authorizationProfileModel.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(authorizationProfileModel.initialize).toEqual(jasmine.any(Function));
                });

                describe("when options are not provided", function () {
                    beforeEach(function () {
                        authorizationProfileModel.initialize();
                    });

                    it("should NOT call set", function () {
                        expect(authorizationProfileModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided without attributes", function () {
                    var options = {};

                    beforeEach(function () {
                        authorizationProfileModel.initialize(options);
                    });

                    it("should NOT call set", function () {
                        expect(authorizationProfileModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided", function () {
                    var options = {
                        id     : 2457624567,
                        name   : "Mock Name",
                        productRestriction: 2134
                    };

                    beforeEach(function () {
                        authorizationProfileModel.initialize(options);
                    });

                    it("should call set 3 times", function () {
                        expect(authorizationProfileModel.set.calls.count()).toEqual(3);
                    });

                    it("should set id", function () {
                        expect(authorizationProfileModel.set).toHaveBeenCalledWith("id", options.id);
                    });

                    it("should set name", function () {
                        expect(authorizationProfileModel.set).toHaveBeenCalledWith("name", options.name);
                    });

                    it("should set productRestriction", function () {
                        expect(authorizationProfileModel.set)
                            .toHaveBeenCalledWith("productRestriction", options.productRestriction);
                    });
                });
            });
        });
    });
