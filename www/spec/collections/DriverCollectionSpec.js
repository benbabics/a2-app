define(["utils", "globals", "Squire", "models/DriverModel"],
    function (utils, globals, Squire, DriverModel) {
        "use strict";

        var squire = new Squire(),
            driverCollection;

        squire.mock("models/DriverModel", DriverModel);

        describe("A Driver Collection", function () {
            var jasmineAsync = new AsyncSpec(this);

            jasmineAsync.beforeEach(function(done) {
                squire.require(["collections/DriverCollection"], function(DriverCollection) {
                    driverCollection = new DriverCollection();
                    done();
                });
            });

            it("is defined", function () {
                expect(driverCollection).toBeDefined();
            });

            it("looks like a Backbone collection", function () {
                expect(driverCollection instanceof Backbone.Collection).toBeTruthy();
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(driverCollection.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverCollection.constructor).toEqual(jasmine.any(Function));
                });

                it("should default model to DriverModel", function () {
                    expect(driverCollection.model).toEqual(DriverModel);
                });
            });
        });
    });
