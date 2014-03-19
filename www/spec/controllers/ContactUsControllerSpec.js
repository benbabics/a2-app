define(["globals", "backbone", "utils", "Squire"],
    function (globals, Backbone, utils, Squire) {

        "use strict";

        var squire = new Squire(),
            mockFacade = {
                publish: function (channel, event) { }
            },
            mockUtils = utils,
            mockContactUsModel = {
                "sender": null
            },
            contactUsModel = new Backbone.Model(),
            mockContactUsView = {
                $el: "",
                constructor: function () { },
                initialize: function () { },
                render: function () { },
                on: function () { }
            },
            mockUserModel = {
                "authenticated": "true",
                "email": "mobiledevelopment@wexinc.com"
            },
            userModel = new Backbone.Model(),
            UserModel = {
                getInstance: function () { }
            },
            contactUsController;

        squire.mock("backbone", Backbone);
        squire.mock("facade", mockFacade);
        squire.mock("utils", mockUtils);
        squire.mock("views/ContactUsView", Squire.Helpers.returns(mockContactUsView));
        squire.mock("models/ContactUsModel", Squire.Helpers.returns(contactUsModel));
        squire.mock("models/UserModel", UserModel);

        describe("A Contact Us Controller", function () {
            beforeEach(function (done) {
                squire.require(["controllers/ContactUsController"], function (ContactUsController) {
                    contactUsModel.set(mockContactUsModel);
                    userModel.set(mockUserModel);
                    spyOn(UserModel, "getInstance").and.callFake(function () { return userModel; });

                    contactUsController = ContactUsController;
                    contactUsController.init();

                    done();
                });
            });

            it("is defined", function () {
                expect(contactUsController).toBeDefined();
            });

            describe("has constructor that", function () {
                it("is defined", function () {
                    expect(contactUsController.construct).toBeDefined();
                });

                it("is a function", function () {
                    expect(contactUsController.construct).toEqual(jasmine.any(Function));
                });
            });

            describe("has an init function that", function () {
                beforeEach(function () {
                    contactUsController.init();
                });

                it("is defined", function () {
                    expect(contactUsController.init).toBeDefined();
                });

                it("is a function", function () {
                    expect(contactUsController.init).toEqual(jasmine.any(Function));
                });

                describe("when initializing the ContactUsView", function () {
                    beforeEach(function () {
                        spyOn(mockContactUsView, "constructor").and.callThrough();
                    });

                    it("should set the contactUsView variable to a new ContactUsView object", function () {
                        expect(contactUsController.contactUsView).toEqual(mockContactUsView);
                    });

                    xit("should send in the correct parameters to the constructor", function () {
                        expect(mockContactUsView.constructor).toHaveBeenCalledWith({
                            model: contactUsModel,
                            userModel: userModel
                        });

                        // TODO: this is not working, need to figure out how to test
                    });
                });

                it("should call ContactUsView.on 1 time", function () {
                    spyOn(mockContactUsView, "on").and.callFake(function () { });

                    contactUsController.init();

                    expect(mockContactUsView.on).toHaveBeenCalled();
                    expect(mockContactUsView.on.calls.count()).toEqual(1);
                });

                it("should register a function as the handler for the view contactUsSuccess event", function () {
                    spyOn(mockContactUsView, "on").and.callFake(function () { });

                    contactUsController.init();

                    expect(mockContactUsView.on).toHaveBeenCalled();
                    expect(mockContactUsView.on.calls.argsFor(0).length).toEqual(3);
                    expect(mockContactUsView.on.calls.argsFor(0)[0]).toEqual("contactUsSuccess");
                    expect(mockContactUsView.on.calls.argsFor(0)[1]).toEqual(contactUsController.showConfirmation);
                    expect(mockContactUsView.on.calls.argsFor(0)[2]).toEqual(contactUsController);
                });
            });

            describe("has a navigate function that", function () {
                beforeEach(function () {
                    spyOn(mockContactUsView, "render").and.callThrough();
                    spyOn(mockUtils, "changePage").and.callThrough();

                    contactUsController.navigate();
                });

                it("is defined", function () {
                    expect(contactUsController.navigate).toBeDefined();
                });

                it("is a function", function () {
                    expect(contactUsController.navigate).toEqual(jasmine.any(Function));
                });

                it("should call render on the Contact Us View Page", function () {
                    expect(mockContactUsView.render).toHaveBeenCalledWith();
                });

                it("should change the page to the Contact Us View Page", function () {
                    expect(mockUtils.changePage).toHaveBeenCalled();

                    expect(mockUtils.changePage.calls.mostRecent().args.length).toEqual(4);
                    expect(mockUtils.changePage.calls.mostRecent().args[0]).toEqual(mockContactUsView.$el);
                    expect(mockUtils.changePage.calls.mostRecent().args[1]).toBeNull();
                    expect(mockUtils.changePage.calls.mostRecent().args[2]).toBeNull();
                    expect(mockUtils.changePage.calls.mostRecent().args[3]).toBeTruthy();
                });
            });

            describe("has a showConfirmation function that", function () {
                var response = {
                    message: "Response message"
                };
                beforeEach(function () {
                    spyOn(mockFacade, "publish").and.callFake(function () { });

                    contactUsController.showConfirmation(response);
                });

                it("is defined", function () {
                    expect(contactUsController.showConfirmation).toBeDefined();
                });

                it("is a function", function () {
                    expect(contactUsController.showConfirmation).toEqual(jasmine.any(Function));
                });

                it("should call publish on the facade", function () {
                    var appAlertOptions;

                    expect(mockFacade.publish).toHaveBeenCalled();

                    expect(mockFacade.publish.calls.mostRecent().args.length).toEqual(3);
                    expect(mockFacade.publish.calls.mostRecent().args[0]).toEqual("app");
                    expect(mockFacade.publish.calls.mostRecent().args[1]).toEqual("alert");

                    appAlertOptions = mockFacade.publish.calls.mostRecent().args[2];
                    expect(appAlertOptions.title).toEqual(globals.contactUs.constants.SUCCESS_TITLE);
                    expect(appAlertOptions.message).toEqual(response.message);
                    expect(appAlertOptions.primaryBtnLabel).toEqual(globals.DIALOG.DEFAULT_BTN_TEXT);
                    expect(appAlertOptions.popupafterclose).toEqual(jasmine.any(Function));
                });

                describe("sends as the popupafterclose argument a callback that", function () {
                    var options;

                    beforeEach(function () {
                        options = mockFacade.publish.calls.mostRecent().args[2];

                        spyOn(window.history, "back").and.callFake(function () { });

                        options.popupafterclose.call(contactUsController);
                    });

                    it("should call back on window.history", function () {
                        expect(window.history.back).toHaveBeenCalledWith();
                    });
                });
            });
        });
    });