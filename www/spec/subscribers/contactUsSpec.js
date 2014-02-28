define(["Squire"],
    function (Squire) {

        "use strict";

        // Mock application info
        var squire = new Squire(),
            mockFacade = {
                subscribeTo: jasmine.createSpy("subscribeTo() spy")
            },
            mockContactUsController = {
                init: function () { }
            },
            contactUsSubscriber;

        squire.mock("facade", mockFacade);
        squire.mock("controllers/ContactUsController", mockContactUsController);

        describe("A Contact Us Subscriber", function () {
            var jasmineAsync = new AsyncSpec(this);

            jasmineAsync.beforeEach(function (done) {
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

                expect(mockFacade.subscribeTo.mostRecentCall.args.length).toEqual(2);
                expect(mockFacade.subscribeTo.mostRecentCall.args[0]).toEqual("contactUs");
                expect(mockFacade.subscribeTo.mostRecentCall.args[1]).toEqual(mockContactUsController);
            });

            describe("has an init function that", function () {
                beforeEach(function () {
                    spyOn(mockContactUsController, "init").andCallThrough();
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

                    expect(mockContactUsController.init.mostRecentCall.args.length).toEqual(0);
                });
            });
        });
    });
