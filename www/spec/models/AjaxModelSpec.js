define(["Squire", "globals", "backbone", "utils"],
    function (Squire, globals, Backbone, utils) {

        "use strict";

        var squire = new Squire(),
            mockFacade = {
                publish: function (channel, event) { }
            },
            mockBackbone = Backbone,
            mockDataResponse = {
                successFlag: false,
                message: {
                    type: "",
                    text: ""
                }
            },
            AjaxModel,
            ajaxModel;

        squire.mock("facade", mockFacade);
        squire.mock("backbone", mockBackbone);

        describe("An Ajax Model", function () {
            beforeEach(function (done) {
                squire.require(["models/AjaxModel"], function (JasmineAjaxModel) {
                    AjaxModel = JasmineAjaxModel;
                    ajaxModel = new AjaxModel();

                    done();
                });
            });

            it("is defined", function () {
                expect(ajaxModel).toBeDefined();
            });

            it("looks like a Backbone Model", function () {
                expect(ajaxModel instanceof Backbone.Model).toBeTruthy();
            });

            describe("has a sync function that", function () {
                it("is defined", function () {
                    expect(ajaxModel.sync).toBeDefined();
                });

                it("is a function", function () {
                    expect(ajaxModel.sync).toEqual(jasmine.any(Function));
                });

                describe("sets the beforeSend callback that", function () {

                    var method = "create",
                        model = {},
                        options = {},
                        overriddenOptions,
                        jqXHR = {
                            setRequestHeader: jasmine.createSpy("setRequestHeader() spy")
                        },
                        originalBeforeSendCallback = jasmine.createSpy("beforeSend() spy");

                    beforeEach(function () {
                        options.beforeSend = originalBeforeSendCallback;

                        spyOn(mockBackbone, "sync").and.callFake(function () {
                            var deferred = utils.Deferred();

                            deferred.reject();
                            return deferred.promise();
                        });
                        spyOn(mockFacade, "publish").and.callFake(function () { });

                        ajaxModel.sync(method, model, options);

                        overriddenOptions = mockBackbone.sync.calls.mostRecent().args[2];

                        overriddenOptions.beforeSend.call(ajaxModel, jqXHR);
                    });

                    it("should call set the AJAX_CLIENT property of the Request Header", function () {
                        expect(jqXHR.setRequestHeader).toHaveBeenCalled();
                        expect(jqXHR.setRequestHeader.calls.argsFor(0).length).toEqual(2);
                        expect(jqXHR.setRequestHeader.calls.argsFor(0)[0]).toEqual("AJAX_CLIENT");
                        expect(jqXHR.setRequestHeader.calls.argsFor(0)[1]).toEqual(1);
                    });

                    it("should call set the Cache-Control property of the Request Header", function () {
                        expect(jqXHR.setRequestHeader).toHaveBeenCalled();
                        expect(jqXHR.setRequestHeader.calls.argsFor(1).length).toEqual(2);
                        expect(jqXHR.setRequestHeader.calls.argsFor(1)[0]).toEqual("Cache-Control");
                        expect(jqXHR.setRequestHeader.calls.argsFor(1)[1]).toEqual("no-cache");
                    });

                    it("should call the original beforeSend callback passed in to options", function () {
                        expect(originalBeforeSendCallback).toHaveBeenCalled();
                        expect(originalBeforeSendCallback.calls.mostRecent().args.length).toEqual(1);
                        expect(originalBeforeSendCallback.calls.mostRecent().args[0]).toEqual(jqXHR);
                    });

                });

                describe("when the call to sync() finishes successfully", function () {
                    beforeEach(function () {
                        spyOn(mockBackbone, "sync").and.callFake(function () {
                            var deferred = utils.Deferred();

                            deferred.resolve(mockDataResponse);
                            return deferred.promise();
                        });
                    });

                    describe("when the successFlag in the response is false", function () {
                        var method = "create",
                            model = {},
                            options = {},
                            originalErrorCallback,
                            mockErrorMessage = "Mock Error Message";

                        beforeEach(function () {
                            mockDataResponse.successFlag = false;
                            originalErrorCallback = jasmine.createSpy("error() spy");
                        });

                        describe("when the response indicates an Error", function () {

                            beforeEach(function () {
                                mockDataResponse.message.type = "ERROR";
                                options.error = originalErrorCallback;

                                spyOn(mockFacade, "publish").and.callFake(function () { });
                                spyOn(ajaxModel, "getErrorMessage").and.returnValue(mockErrorMessage);

                                ajaxModel.sync(method, model, options);
                            });

                            it("should call Backbone.sync()", function () {
                                var modifiedOptions;

                                expect(mockBackbone.sync).toHaveBeenCalled();
                                expect(mockBackbone.sync.calls.mostRecent().args.length).toEqual(3);
                                expect(mockBackbone.sync.calls.mostRecent().args[0]).toEqual(method);
                                expect(mockBackbone.sync.calls.mostRecent().args[1]).toEqual(model);

                                modifiedOptions = mockBackbone.sync.calls.mostRecent().args[2];

                                expect(modifiedOptions.success).toBeNull();
                                expect(modifiedOptions.error).toBeNull();
                                expect(modifiedOptions.beforeSend).toEqual(jasmine.any(Function));
                            });

                            it("should call getErrorMessage", function () {
                                expect(ajaxModel.getErrorMessage).toHaveBeenCalledWith(mockDataResponse);
                            });

                            it("should publish an alert of the message text", function () {
                                var alertDetails;

                                expect(mockFacade.publish).toHaveBeenCalled();
                                expect(mockFacade.publish.calls.mostRecent().args.length).toEqual(3);
                                expect(mockFacade.publish.calls.mostRecent().args[0]).toEqual("app");
                                expect(mockFacade.publish.calls.mostRecent().args[1]).toEqual("alert");

                                alertDetails = mockFacade.publish.calls.mostRecent().args[2];

                                expect(alertDetails.title).toEqual(globals.WEBSERVICE.REQUEST_ERROR_TITLE);
                                expect(alertDetails.message).toEqual(mockErrorMessage);
                                expect(alertDetails.primaryBtnLabel).toEqual(globals.DIALOG.DEFAULT_BTN_TEXT);
                            });

                            it("should call the original error callback passed in to options", function () {
                                expect(originalErrorCallback).toHaveBeenCalledWith({
                                    type: mockDataResponse.message.type,
                                    message: mockErrorMessage
                                });
                            });
                        });

                        describe("when the response indicates an Info", function () {
                            beforeEach(function () {
                                mockDataResponse.message.type = "INFO";
                                options.error = originalErrorCallback;

                                spyOn(mockFacade, "publish").and.callFake(function () { });
                                spyOn(ajaxModel, "getErrorMessage").and.returnValue(mockErrorMessage);

                                ajaxModel.sync(method, model, options);
                            });

                            it("should call Backbone.sync()", function () {
                                var modifiedOptions;

                                expect(mockBackbone.sync).toHaveBeenCalled();
                                expect(mockBackbone.sync.calls.mostRecent().args.length).toEqual(3);
                                expect(mockBackbone.sync.calls.mostRecent().args[0]).toEqual(method);
                                expect(mockBackbone.sync.calls.mostRecent().args[1]).toEqual(model);

                                modifiedOptions = mockBackbone.sync.calls.mostRecent().args[2];

                                expect(modifiedOptions.success).toBeNull();
                                expect(modifiedOptions.error).toBeNull();
                                expect(modifiedOptions.beforeSend).toEqual(jasmine.any(Function));
                            });

                            it("should call getErrorMessage", function () {
                                expect(ajaxModel.getErrorMessage).toHaveBeenCalledWith(mockDataResponse);
                            });

                            it("should NOT publish an alert of the message text", function () {
                                expect(mockFacade.publish).not.toHaveBeenCalled();
                            });

                            it("should call the original error callback passed in to options", function () {
                                expect(originalErrorCallback).toHaveBeenCalledWith({
                                    type: mockDataResponse.message.type,
                                    message: mockErrorMessage
                                });
                            });
                        });
                    });

                    describe("when the successFlag in the response is true", function () {

                        var method = "create",
                            model = {},
                            options = {},
                            originalSuccessCallback = jasmine.createSpy("success() spy");

                        beforeEach(function () {
                            mockDataResponse.successFlag = true;
                            options.success = originalSuccessCallback;
                        });

                        it("should call Backbone.sync()", function () {
                            var modifiedOptions;

                            ajaxModel.sync(method, model, options);

                            expect(mockBackbone.sync).toHaveBeenCalled();
                            expect(mockBackbone.sync.calls.mostRecent().args.length).toEqual(3);
                            expect(mockBackbone.sync.calls.mostRecent().args[0]).toEqual(method);
                            expect(mockBackbone.sync.calls.mostRecent().args[1]).toEqual(model);

                            modifiedOptions = mockBackbone.sync.calls.mostRecent().args[2];

                            expect(modifiedOptions.success).toBeNull();
                            expect(modifiedOptions.error).toBeNull();
                            expect(modifiedOptions.beforeSend).toEqual(jasmine.any(Function));
                        });

                        describe("when there is only one object in the data list in the response", function () {
                            it("should call the original success callback passed in to options", function () {
                                var responseSentToCallback;

                                mockDataResponse.data = [{someField: "someValue"}];

                                ajaxModel.sync(method, model, options);

                                expect(originalSuccessCallback).toHaveBeenCalled();
                                expect(originalSuccessCallback.calls.mostRecent().args.length).toEqual(1);

                                responseSentToCallback = originalSuccessCallback.calls.mostRecent().args[0];

                                expect(responseSentToCallback.data).toEqual(mockDataResponse.data[0]);
                                expect(responseSentToCallback.message).toEqual(mockDataResponse.message.text);
                            });
                        });

                        describe("when there is more than one object in the data list in the response", function () {
                            it("should call the original success callback passed in to options", function () {
                                var responseSentToCallback;

                                mockDataResponse.data = [{someField: "someValue"}, {someField: "someValue"}];

                                ajaxModel.sync(method, model, options);

                                expect(originalSuccessCallback).toHaveBeenCalled();
                                expect(originalSuccessCallback.calls.mostRecent().args.length).toEqual(1);

                                responseSentToCallback = originalSuccessCallback.calls.mostRecent().args[0];

                                expect(responseSentToCallback.data).toEqual(mockDataResponse.data);
                                expect(responseSentToCallback.message).toEqual(mockDataResponse.message.text);
                            });
                        });
                    });
                });

                describe("when the call to sync() finishes with a failure", function () {
                    var method = "create",
                        model = {},
                        options = {},
                        originalErrorCallback = jasmine.createSpy("error() spy");

                    beforeEach(function () {
                        spyOn(mockBackbone, "sync").and.callFake(function () {
                            var deferred = utils.Deferred();

                            deferred.reject();
                            return deferred.promise();
                        });
                        spyOn(mockFacade, "publish").and.callFake(function () { });

                        options.error = originalErrorCallback;

                        ajaxModel.sync(method, model, options);
                    });

                    it("should call Backbone.sync()", function () {
                        var modifiedOptions;

                        expect(mockBackbone.sync).toHaveBeenCalled();
                        expect(mockBackbone.sync.calls.mostRecent().args.length).toEqual(3);
                        expect(mockBackbone.sync.calls.mostRecent().args[0]).toEqual(method);
                        expect(mockBackbone.sync.calls.mostRecent().args[1]).toEqual(model);

                        modifiedOptions = mockBackbone.sync.calls.mostRecent().args[2];

                        expect(modifiedOptions.success).toBeNull();
                        expect(modifiedOptions.error).toBeNull();
                        expect(modifiedOptions.beforeSend).toEqual(jasmine.any(Function));
                    });

                    it("should publish an alert with the Unknown Error text", function () {
                        var alertDetails;

                        expect(mockFacade.publish).toHaveBeenCalled();
                        expect(mockFacade.publish.calls.mostRecent().args.length).toEqual(3);
                        expect(mockFacade.publish.calls.mostRecent().args[0]).toEqual("app");
                        expect(mockFacade.publish.calls.mostRecent().args[1]).toEqual("alert");

                        alertDetails = mockFacade.publish.calls.mostRecent().args[2];

                        expect(alertDetails.title).toEqual(globals.WEBSERVICE.REQUEST_ERROR_TITLE);
                        expect(alertDetails.message).toEqual(globals.WEBSERVICE.REQUEST_ERROR_UNKNOWN_MESSAGE);
                        expect(alertDetails.primaryBtnLabel).toEqual(globals.DIALOG.DEFAULT_BTN_TEXT);
                    });

                    it("should call the original error callback passed in to options", function () {
                        expect(originalErrorCallback).toHaveBeenCalledWith();
                    });
                });
            });

            describe("has a getErrorMessage function that", function () {
                it("is defined", function () {
                    expect(ajaxModel.getErrorMessage).toBeDefined();
                });

                it("is a function", function () {
                    expect(ajaxModel.getErrorMessage).toEqual(jasmine.any(Function));
                });

                describe("when the response has data", function () {
                    beforeEach(function () {
                        mockDataResponse.message.text = "An error occurred.";
                        mockDataResponse.data =
                            [
                                { message: "Error Message 1"},
                                { message: "Error Message 2"},
                                { message: "Error Message 3"}
                            ];
                    });

                    it("returns the expected value", function () {
                        var expectedValue,
                            actualValue;

                        expectedValue = globals.WEBSERVICE.REQUEST_ERROR_MESSAGE_PREFIX +
                                        mockDataResponse.message.text +
                                        globals.WEBSERVICE.REQUEST_ERROR_MESSAGE_SUFFIX +
                                        "<ul><li>Error Message 1</li>" +
                                        "<li>Error Message 2</li>" +
                                        "<li>Error Message 3</li></ul>";

                        actualValue = ajaxModel.getErrorMessage(mockDataResponse);

                        expect(actualValue).toEqual(expectedValue);
                    });
                });

                describe("when the response does NOT have data", function () {
                    beforeEach(function () {
                        mockDataResponse.message.text = "An error occurred.";
                        mockDataResponse.data = null;
                    });

                    it("returns the expected value", function () {
                        var expectedValue = mockDataResponse.message.text,
                            actualValue;

                        actualValue = ajaxModel.getErrorMessage(mockDataResponse);

                        expect(actualValue).toEqual(expectedValue);
                    });
                });

                describe("when the response does NOT have data or message text", function () {
                    beforeEach(function () {
                        mockDataResponse.message.text = null;
                        mockDataResponse.data = null;
                    });

                    it("returns the expected value", function () {
                        var expectedValue = globals.WEBSERVICE.REQUEST_ERROR_UNKNOWN_MESSAGE,
                            actualValue;

                        actualValue = ajaxModel.getErrorMessage(mockDataResponse);

                        expect(actualValue).toEqual(expectedValue);
                    });
                });

                describe("when there is NOT a response", function () {
                    beforeEach(function () {
                        mockDataResponse = null;
                    });

                    it("returns the expected value", function () {
                        var expectedValue = globals.WEBSERVICE.REQUEST_ERROR_UNKNOWN_MESSAGE,
                            actualValue;

                        actualValue = ajaxModel.getErrorMessage(mockDataResponse);

                        expect(actualValue).toEqual(expectedValue);
                    });
                });
            });
        });
    });
