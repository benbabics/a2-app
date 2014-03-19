define(["Squire"],
    function (Squire) {

        "use strict";

        // Mock application info
        var squire = new Squire(),
            mockSubscribe = jasmine.createSpy("subscribe() spy"),
            mockFacade = {
                subscribeTo: jasmine.createSpy("subscribeTo() spy").and.returnValue(mockSubscribe)
            },
            mockContactUsController = {
                init: function () { }
            },
            contactUsSubscriber;

        squire.mock("facade", mockFacade);
        squire.mock("controllers/ContactUsController", mockContactUsController);

        describe("A Contact Us Subscriber", function () {
            beforeEach(function (done) {
                squire.require(["subscribers/contactUs"], function (jasmineContactUsSubscriber) {
                    contactUsSubscriber = jasmineContactUsSubscriber;
                    done();
                });
            });

            it("is defined", function () {
                expect(contactUsSubscriber).toBeDefined();
            });

            it("should call the subscribeTo function on the facade", function () {
                expect(mockFacade.subscribeTo).toHaveBeenCalled();

                expect(mockFacade.subscribeTo.calls.mostRecent().args.length).toEqual(2);
                expect(mockFacade.subscribeTo.calls.mostRecent().args[0]).toEqual("contactUs");
                expect(mockFacade.subscribeTo.calls.mostRecent().args[1]).toEqual(mockContactUsController);
            });

            it("should call subscribe 1 time", function () {
                expect(mockSubscribe.calls.count()).toEqual(1);
            });

            it("should subscribe to navigate", function () {
                expect(mockSubscribe).toHaveBeenCalledWith("navigate", "navigate");
            });

            describe("has an init function that", function () {
                beforeEach(function () {
                    spyOn(mockContactUsController, "init").and.callThrough();
                    contactUsSubscriber.init();
                });

                it("is defined", function () {
                    expect(contactUsSubscriber.init).toBeDefined();
                });

                it("is a function", function () {
                    expect(contactUsSubscriber.init).toEqual(jasmine.any(Function));
                });

                it("should call the init function on the controller", function () {
                    expect(mockContactUsController.init).toHaveBeenCalled();

                    expect(mockContactUsController.init.calls.mostRecent().args.length).toEqual(0);
                });
            });
        });
    });
