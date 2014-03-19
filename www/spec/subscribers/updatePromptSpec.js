define(["Squire"],
    function (Squire) {

        "use strict";

        // Mock application info
        var squire = new Squire(),
            mockSubscribe = jasmine.createSpy("subscribe() spy"),
            mockFacade = {
                subscribeTo: jasmine.createSpy("subscribeTo() spy").and.returnValue(mockSubscribe)
            },
            mockUpdatePromptController = {
                init: function () { },
                showPromptToUpdateFail: function () { },
                showPromptToUpdateWarn: function () { }
            },
            updatePromptSubscriber;

        squire.mock("facade", mockFacade);
        squire.mock("controllers/UpdatePromptController", mockUpdatePromptController);

        describe("An Update Prompt Subscriber", function () {
            beforeEach(function (done) {
                squire.require(["subscribers/updatePrompt"], function (jasmineUpdatePromptSubscriber) {
                    updatePromptSubscriber = jasmineUpdatePromptSubscriber;
                    done();
                });
            });

            it("is defined", function () {
                expect(updatePromptSubscriber).toBeDefined();
            });

            it("should call the subscribeTo function on the facade", function () {
                expect(mockFacade.subscribeTo).toHaveBeenCalled();

                expect(mockFacade.subscribeTo.calls.mostRecent().args.length).toEqual(2);
                expect(mockFacade.subscribeTo.calls.mostRecent().args[0]).toEqual("updatePrompt");
                expect(mockFacade.subscribeTo.calls.mostRecent().args[1]).toEqual(mockUpdatePromptController);
            });

            it("should call subscribe 2 times", function () {
                expect(mockSubscribe.calls.count()).toEqual(2);
            });

            it("should subscribe to showPromptToUpdateFail", function () {
                expect(mockSubscribe).toHaveBeenCalledWith("showPromptToUpdateFail", "showPromptToUpdateFail");
            });

            it("should subscribe to showPromptToUpdateWarn", function () {
                expect(mockSubscribe).toHaveBeenCalledWith("showPromptToUpdateWarn", "showPromptToUpdateWarn");
            });

            describe("has an init function that", function () {
                beforeEach(function () {
                    spyOn(mockUpdatePromptController, "init").and.callThrough();
                    updatePromptSubscriber.init();
                });

                it("is defined", function () {
                    expect(updatePromptSubscriber.init).toBeDefined();
                });

                it("is a function", function () {
                    expect(updatePromptSubscriber.init).toEqual(jasmine.any(Function));
                });

                it("should call the init function on the controller", function () {
                    expect(mockUpdatePromptController.init).toHaveBeenCalled();

                    expect(mockUpdatePromptController.init.calls.mostRecent().args.length).toEqual(0);
                });
            });
        });
    });
