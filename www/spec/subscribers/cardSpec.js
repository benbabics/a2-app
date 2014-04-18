define(["Squire"],
    function (Squire) {

        "use strict";

        var squire = new Squire(),
            mockSubscribe = jasmine.createSpy("subscribe() spy"),
            mockFacade = {
                subscribeTo: jasmine.createSpy("subscribeTo() spy").and.returnValue(mockSubscribe)
            },
            mockCardController = {
                init: function () { },
                beforeNavigateAddCondition: function () { }
            },
            cardSubscriber;

        squire.mock("facade", mockFacade);
        squire.mock("controllers/CardController", mockCardController);

        describe("A Card Subscriber", function () {
            beforeEach(function (done) {
                squire.require(["subscribers/card"], function (jasmineCardSubscriber) {
                    cardSubscriber = jasmineCardSubscriber;
                    done();
                });
            });

            it("is defined", function () {
                expect(cardSubscriber).toBeDefined();
            });

            it("should call the subscribeTo function on the facade", function () {
                expect(mockFacade.subscribeTo).toHaveBeenCalled();

                expect(mockFacade.subscribeTo.calls.mostRecent().args.length).toEqual(2);
                expect(mockFacade.subscribeTo.calls.mostRecent().args[0]).toEqual("card");
                expect(mockFacade.subscribeTo.calls.mostRecent().args[1]).toEqual(mockCardController);
            });

            it("should call subscribe 3 times", function () {
                expect(mockSubscribe.calls.count()).toEqual(3);
            });

            it("should subscribe to navigateAdd", function () {
                expect(mockSubscribe)
                    .toHaveBeenCalledWith("navigateAdd", "navigateAdd", mockCardController.beforeNavigateAddCondition);
            });

            it("should subscribe to navigateCardDetails", function () {
                expect(mockSubscribe).toHaveBeenCalledWith("navigateCardDetails", "navigateCardDetails");
            });

            it("should subscribe to navigateSearch", function () {
                expect(mockSubscribe).toHaveBeenCalledWith("navigateSearch", "navigateSearch");
            });

            describe("has an init function that", function () {
                beforeEach(function () {
                    spyOn(mockCardController, "init").and.callThrough();
                    cardSubscriber.init();
                });

                it("is defined", function () {
                    expect(cardSubscriber.init).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardSubscriber.init).toEqual(jasmine.any(Function));
                });

                it("should call the init function on the controller", function () {
                    expect(mockCardController.init).toHaveBeenCalledWith();
                });
            });
        });
    });
