define(["backbone", "Squire", "globals"],
    function (Backbone, Squire, globals) {

        "use strict";

        var squire = new Squire(),
            mockAppModel = {
                "buildVersion"   : "1.1.2",
                "platform"       : "Android",
                "platformVersion": "4.2.2"
            },
            appModel = new Backbone.Model(),
            AppModel = {
                getInstance: function () { }
            },
            contactUsModel;

        squire.mock("backbone", Backbone);
        squire.mock("models/AppModel", AppModel);

        describe("A Contact Us Model", function () {
            beforeEach(function (done) {
                squire.require(["models/ContactUsModel"], function (ContactUsModel) {
                    appModel.set(mockAppModel);
                    spyOn(AppModel, "getInstance").and.callFake(function () { return appModel; });

                    contactUsModel = new ContactUsModel();

                    done();
                });
            });

            it("is defined", function () {
                expect(contactUsModel).toBeDefined();
            });

            it("looks like a Backbone model", function () {
                expect(contactUsModel instanceof Backbone.Model).toBeTruthy();
            });

            describe("has a urlRoot property that", function () {
                it("is set to globals.contactUs.constants.WEBSERVICE", function () {
                    expect(contactUsModel.urlRoot).toEqual(globals.contactUs.constants.WEBSERVICE);
                });
            });

            describe("has property defaults that", function () {
                it("should set sender to default", function () {
                    expect(contactUsModel.defaults.sender).toBeNull();
                });

                it("should set subject to default", function () {
                    expect(contactUsModel.defaults.subject).toBeNull();
                });

                it("should set message to default", function () {
                    expect(contactUsModel.defaults.message).toBeNull();
                });

                it("should set devicePlatform to default", function () {
                    expect(contactUsModel.defaults.devicePlatform).toBeNull();
                });

                it("should set deviceVersion to default", function () {
                    expect(contactUsModel.defaults.deviceVersion).toBeNull();
                });

                it("should set appBuildVersion to default", function () {
                    expect(contactUsModel.defaults.appBuildVersion).toBeNull();
                });
            });

            describe("has property validation that", function () {
                describe("has a validation configuration for the sender field that", function () {
                    it("should set the field as required", function () {
                        expect(contactUsModel.validation.sender.required).toBeTruthy();
                    });

                    it("should set the error message when the field is not supplied", function () {
                        expect(contactUsModel.validation.sender.msg)
                            .toEqual(globals.contactUs.constants.ERROR_SENDER_REQUIRED_FIELD);
                    });
                });

                describe("has a validation configuration for the subject field that", function () {
                    it("should set the field as required", function () {
                        expect(contactUsModel.validation.subject.required).toBeTruthy();
                    });

                    it("should set the error message when the field is not supplied", function () {
                        expect(contactUsModel.validation.subject.msg)
                            .toEqual(globals.contactUs.constants.ERROR_SUBJECT_REQUIRED_FIELD);
                    });
                });

                describe("has a validation configuration for the message field that", function () {
                    it("should set the field as required", function () {
                        expect(contactUsModel.validation.message.required).toBeTruthy();
                    });

                    it("should set the error message when the field is not supplied", function () {
                        expect(contactUsModel.validation.message.msg)
                            .toEqual(globals.contactUs.constants.ERROR_MESSAGE_REQUIRED_FIELD);
                    });
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    contactUsModel.initialize();
                });

                it("is defined", function () {
                    expect(contactUsModel.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(contactUsModel.initialize).toEqual(jasmine.any(Function));
                });

                it("should set appBuildVersion", function () {
                    expect(contactUsModel.get("appBuildVersion")).toEqual(mockAppModel.buildVersion);
                });

                it("should set devicePlatform", function () {
                    expect(contactUsModel.get("devicePlatform")).toEqual(mockAppModel.platform);
                });

                it("should set deviceVersion", function () {
                    expect(contactUsModel.get("deviceVersion")).toEqual(mockAppModel.platformVersion);
                });
            });
        });
    });
