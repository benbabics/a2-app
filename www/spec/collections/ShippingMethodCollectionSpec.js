define(["utils", "globals", "Squire", "models/ShippingMethodModel"],
    function (utils, globals, Squire, ShippingMethodModel) {
        "use strict";

        var squire = new Squire(),
            shippingMethodCollection;

        squire.mock("models/ShippingMethodModel", ShippingMethodModel);

        describe("A Shipping Method Collection", function () {
            beforeEach(function (done) {
                squire.require(["collections/ShippingMethodCollection"], function (ShippingMethodCollection) {
                    shippingMethodCollection = new ShippingMethodCollection();
                    done();
                });
            });

            it("is defined", function () {
                expect(shippingMethodCollection).toBeDefined();
            });

            it("looks like a Backbone collection", function () {
                expect(shippingMethodCollection instanceof Backbone.Collection).toBeTruthy();
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(shippingMethodCollection.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(shippingMethodCollection.constructor).toEqual(jasmine.any(Function));
                });

                it("should default model to ShippingMethodModel", function () {
                    expect(shippingMethodCollection.model).toEqual(ShippingMethodModel);
                });
            });
        });
    });
