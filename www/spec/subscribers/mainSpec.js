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
            mockCardSubscriber = {
                init: jasmine.createSpy("init() spy")
            },
            mockContactUsSubscriber = {
                init: jasmine.createSpy("init() spy")
            },
            mockDriverSubscriber = {
                init: jasmine.createSpy("init() spy")
            },
            mockHomeSubscriber = {
                init: jasmine.createSpy("init() spy")
            },
            mockHierarchySubscriber = {
                init: jasmine.createSpy("init() spy")
            },
            mockInvoiceSubscriber = {
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
        squire.mock("subscribers/card", mockCardSubscriber);
        squire.mock("subscribers/contactUs", mockContactUsSubscriber);
        squire.mock("subscribers/driver", mockDriverSubscriber);
        squire.mock("subscribers/hierarchy", mockHierarchySubscriber);
        squire.mock("subscribers/home", mockHomeSubscriber);
        squire.mock("subscribers/invoice", mockInvoiceSubscriber);
        squire.mock("subscribers/login", mockLoginSubscriber);
        squire.mock("subscribers/updatePrompt", mockUpdatePromptSubscriber);

        describe("A Main Subscriber", function () {
            beforeEach(function (done) {
                squire.require(["subscribers/main"], function () {
                    done();
                });
            });

            it("should call the init function on the About Subscriber", function () {
                expect(mockAboutSubscriber.init).toHaveBeenCalledWith();
            });

            it("should call the init function on the App Subscriber", function () {
                expect(mockAppSubscriber.init).toHaveBeenCalledWith();
            });

            it("should call the init function on the Card Subscriber", function () {
                expect(mockCardSubscriber.init).toHaveBeenCalledWith();
            });

            it("should call the init function on the Contact Us Subscriber", function () {
                expect(mockContactUsSubscriber.init).toHaveBeenCalledWith();
            });

            it("should call the init function on the Driver Subscriber", function () {
                expect(mockDriverSubscriber.init).toHaveBeenCalledWith();
            });

            it("should call the init function on the Hierarchy Subscriber", function () {
                expect(mockHierarchySubscriber.init).toHaveBeenCalledWith();
            });

            it("should call the init function on the Home Subscriber", function () {
                expect(mockHomeSubscriber.init).toHaveBeenCalledWith();
            });

            it("should call the init function on the Invoice Subscriber", function () {
                expect(mockInvoiceSubscriber.init).toHaveBeenCalledWith();
            });

            it("should call the init function on the Login Subscriber", function () {
                expect(mockLoginSubscriber.init).toHaveBeenCalledWith();
            });

            it("should call the init function on the Update Prompt Subscriber", function () {
                expect(mockUpdatePromptSubscriber.init).toHaveBeenCalledWith();
            });
        });
    });
