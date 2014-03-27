define(["globals", "backbone", "utils", "Squire"],
    function (globals, Backbone, utils, Squire) {

        "use strict";

        var squire = new Squire(),
            cardController;

        describe("A Card Controller", function () {
            beforeEach(function (done) {
                squire.require(["controllers/CardController"], function (CardController) {
                    cardController = CardController;
                    cardController.init();

                    done();
                });
            });

            it("is defined", function () {
                expect(cardController).toBeDefined();
            });

            describe("has constructor that", function () {
                it("is defined", function () {
                    expect(cardController.construct).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardController.construct).toEqual(jasmine.any(Function));
                });
            });

            describe("has an init function that", function () {
                it("is defined", function () {
                    expect(cardController.init).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardController.init).toEqual(jasmine.any(Function));
                });
            });
        });
    });
