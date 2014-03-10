define(["backbone", "utils", "Squire"],
    function (Backbone, utils, Squire) {

        "use strict";

        var squire = new Squire(),
            mockUtils = utils,
            mockContactUsModel = {
                "sender": null
            },
            contactUsModel = new Backbone.Model(),
            mockContactUsView = {
                $el: "",
                constructor: function () { },
                initialize: function () { },
                render: function () { }
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
        squire.mock("utils", mockUtils);
        squire.mock("views/ContactUsView", Squire.Helpers.returns(mockContactUsView));
        squire.mock("models/ContactUsModel", Squire.Helpers.returns(contactUsModel));
        squire.mock("models/UserModel", UserModel);

        describe("A Contact Us Controller", function () {
            var jasmineAsync = new AsyncSpec(this);

            jasmineAsync.beforeEach(function (done) {
                squire.require(["controllers/ContactUsController"], function (ContactUsController) {
                    contactUsModel.set(mockContactUsModel);
                    userModel.set(mockUserModel);
                    spyOn(UserModel, "getInstance").andCallFake(function () { return userModel; });

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
                        spyOn(mockContactUsView, "constructor").andCallThrough();
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
            });

            describe("has a navigate function that", function () {
                beforeEach(function () {
                    spyOn(mockContactUsView, "render").andCallThrough();
                    spyOn(mockUtils, "changePage").andCallThrough();

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

                    expect(mockUtils.changePage.mostRecentCall.args.length).toEqual(4);
                    expect(mockUtils.changePage.mostRecentCall.args[0]).toEqual(mockContactUsView.$el);
                    expect(mockUtils.changePage.mostRecentCall.args[1]).toBeNull();
                    expect(mockUtils.changePage.mostRecentCall.args[2]).toBeNull();
                    expect(mockUtils.changePage.mostRecentCall.args[3]).toBeTruthy();
                });
            });
        });
    });