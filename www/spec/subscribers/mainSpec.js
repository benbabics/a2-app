define(["Squire"],
    function (Squire) {

        "use strict";

        // Mock application info
        var squire = new Squire(),
            mockAboutSubscriber = {
                init: jasmine.createSpy("init() spy")
            },
            mockAppSubscriber = {
                init: jasmine.createSpy("init() spy")
            },
            mockContactUsSubscriber = {
                init: jasmine.createSpy("init() spy")
            },
            mockLoginSubscriber = {
                init: jasmine.createSpy("init() spy")
            },
            mockUpdatePromptSubscriber = {
                init: jasmine.createSpy("init() spy")
            };

        squire.mock("subscribers/about", mockAboutSubscriber);
        squire.mock("subscribers/app", mockAppSubscriber);
        squire.mock("subscribers/contactUs", mockContactUsSubscriber);
        squire.mock("subscribers/login", mockLoginSubscriber);
        squire.mock("subscribers/updatePrompt", mockUpdatePromptSubscriber);

        describe("A Main Subscriber", function () {
            var jasmineAsync = new AsyncSpec(this);

            jasmineAsync.beforeEach(function (done) {
                squire.require(["subscribers/main"], function () {
                    done();
                });
            });

            it("should call the init function on the About Controller", function () {
                expect(mockAboutSubscriber.init).toHaveBeenCalledWith();
            });

            it("should call the init function on the App Controller", function () {
                expect(mockAppSubscriber.init).toHaveBeenCalledWith();
            });

            it("should call the init function on the Contact Us Controller", function () {
                expect(mockContactUsSubscriber.init).toHaveBeenCalledWith();
            });

            it("should call the init function on the Login Controller", function () {
                expect(mockLoginSubscriber.init).toHaveBeenCalledWith();
            });

            it("should call the init function on the Update Prompt Controller", function () {
                expect(mockUpdatePromptSubscriber.init).toHaveBeenCalledWith();
            });
        });
    });
