define(["Squire", "backbone"],
    function (Squire, Backbone) {

        "use strict";

        var squire = new Squire(),
            shippingMethodModel;

        squire.mock("backbone", Backbone);

        describe("A Shipping Method Model", function () {
            beforeEach(function (done) {
                squire.require(["models/ShippingMethodModel"], function (ShippingMethodModel) {
                    shippingMethodModel = new ShippingMethodModel();

                    done();
                });
            });

            it("is defined", function () {
                expect(shippingMethodModel).toBeDefined();
            });

            it("looks like a Backbone Model", function () {
                expect(shippingMethodModel instanceof Backbone.Model).toBeTruthy();
            });

            describe("has property defaults that", function () {
                it("should set id to default", function () {
                    expect(shippingMethodModel.defaults.id).toBeNull();
                });

                it("should set name to default", function () {
                    expect(shippingMethodModel.defaults.name).toBeNull();
                });

                it("should set cost to default", function () {
                    expect(shippingMethodModel.defaults.cost).toBeNull();
                });

                it("should set poBoxAllowed to default", function () {
                    expect(shippingMethodModel.defaults.poBoxAllowed).toBeFalsy();
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(shippingMethodModel, "set").and.callThrough();
                });

                it("is defined", function () {
                    expect(shippingMethodModel.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(shippingMethodModel.initialize).toEqual(jasmine.any(Function));
                });

                describe("when options are not provided", function () {
                    beforeEach(function () {
                        shippingMethodModel.initialize();
                    });

                    it("should NOT call set", function () {
                        expect(shippingMethodModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided without attributes", function () {
                    var options = {};

                    beforeEach(function () {
                        shippingMethodModel.initialize(options);
                    });

                    it("should NOT call set", function () {
                        expect(shippingMethodModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided", function () {
                    var options = {
                        "id"          : "ID",
                        "name"        : "Name",
                        "cost"        : 6.66,
                        "poBoxAllowed": true
                    };

                    beforeEach(function () {
                        shippingMethodModel.initialize(options);
                    });

                    it("should call set 4 times", function () {
                        expect(shippingMethodModel.set.calls.count()).toEqual(4);
                    });

                    it("should set id", function () {
                        expect(shippingMethodModel.set).toHaveBeenCalledWith("id", options.id);
                    });

                    it("should set name", function () {
                        expect(shippingMethodModel.set).toHaveBeenCalledWith("name", options.name);
                    });

                    it("should set cost", function () {
                        expect(shippingMethodModel.set).toHaveBeenCalledWith("cost", options.cost);
                    });

                    it("should set poBoxAllowed", function () {
                        expect(shippingMethodModel.set).toHaveBeenCalledWith("poBoxAllowed", options.poBoxAllowed);
                    });
                });
            });
        });
    });
