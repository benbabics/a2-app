define(["Squire", "globals"],
    function (Squire, globals) {

        "use strict";

        var squire = new Squire(),
            mockFacade = {
                publish: function (channel, event) { }
            },
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

        describe("An Ajax Model", function () {
            var jasmineAsync = new AsyncSpec(this);

            jasmineAsync.beforeEach(function (done) {
                squire.require(["models/AjaxModel"], function (JasmineAjaxModel) {
                    AjaxModel = JasmineAjaxModel;
                    ajaxModel = new AjaxModel();

                    done();
                });
            });

            it("is defined", function () {
                expect(ajaxModel).toBeDefined();
            });

            it("looks like a Backbone model", function () {
                expect(ajaxModel instanceof Backbone.Model).toBeTruthy();
            });

            describe("has a sync function that", function () {
                it("is defined", function () {
                    expect(ajaxModel.sync).toBeDefined();
                });

                it("is a function", function () {
                    expect(ajaxModel.sync).toEqual(jasmine.any(Function));
                });

                describe("sets the success callback that", function () {

                    describe("when the successFlag in the response is false", function () {

                        beforeEach(function () {
                            mockDataResponse.successFlag = false;
                        });

                        describe("when the response indicates an Error", function () {

                            beforeEach(function () {
                                mockDataResponse.message.type = "ERROR";
                            });

                            describe("when the response includes an error message", function () {

                                var method = "create",
                                    model = {},
                                    options = {},
                                    textStatus = "success",
                                    jqXHR = {},
                                    overriddenOptions,
                                    originalErrorCallback = jasmine.createSpy("error() spy");

                                beforeEach(function () {
                                    mockDataResponse.message.text = "An error occurred.";
                                    options.error = originalErrorCallback;

                                    spyOn(mockFacade, "publish").andCallFake(function () { });
                                    spyOn(AjaxModel.__super__, "sync").andCallFake(function () {});

                                    ajaxModel.sync(method, model, options);

                                    overriddenOptions = AjaxModel.__super__.sync.mostRecentCall.args[2];

                                    overriddenOptions.success.call(ajaxModel, mockDataResponse, textStatus, jqXHR);
                                });

                                it("should publish an alert of the message text", function () {
                                    var alertDetails;

                                    expect(mockFacade.publish).toHaveBeenCalled();
                                    expect(mockFacade.publish.mostRecentCall.args.length).toEqual(3);
                                    expect(mockFacade.publish.mostRecentCall.args[0]).toEqual("app");
                                    expect(mockFacade.publish.mostRecentCall.args[1]).toEqual("alert");

                                    alertDetails = mockFacade.publish.mostRecentCall.args[2];

                                    expect(alertDetails.title).toEqual(globals.WEBSERVICE.REQUEST_ERROR_TITLE);
                                    expect(alertDetails.message).toEqual(mockDataResponse.message.text);
                                    expect(alertDetails.primaryBtnLabel).toEqual(globals.DIALOG.DEFAULT_BTN_TEXT);
                                });

                                it("should call the original error callback passed in to options", function () {
                                    expect(originalErrorCallback).toHaveBeenCalledWith();
                                });

                            });

                            describe("when the response does NOT include an error message", function () {

                                var method = "create",
                                    model = {},
                                    options = {},
                                    textStatus = "success",
                                    jqXHR = {},
                                    overriddenOptions,
                                    originalErrorCallback = jasmine.createSpy("error() spy");

                                beforeEach(function () {
                                    mockDataResponse.message.text = null;
                                    options.error = originalErrorCallback;

                                    spyOn(mockFacade, "publish").andCallFake(function () { });
                                    spyOn(AjaxModel.__super__, "sync").andCallFake(function () {});

                                    ajaxModel.sync(method, model, options);

                                    overriddenOptions = AjaxModel.__super__.sync.mostRecentCall.args[2];

                                    overriddenOptions.success.call(ajaxModel, mockDataResponse, textStatus, jqXHR);
                                });

                                it("should publish an alert with the Unknown Error text", function () {
                                    var alertDetails;

                                    expect(mockFacade.publish).toHaveBeenCalled();
                                    expect(mockFacade.publish.mostRecentCall.args.length).toEqual(3);
                                    expect(mockFacade.publish.mostRecentCall.args[0]).toEqual("app");
                                    expect(mockFacade.publish.mostRecentCall.args[1]).toEqual("alert");

                                    alertDetails = mockFacade.publish.mostRecentCall.args[2];

                                    expect(alertDetails.title).toEqual(globals.WEBSERVICE.REQUEST_ERROR_TITLE);
                                    expect(alertDetails.message).toEqual(globals.WEBSERVICE.REQUEST_ERROR_UNKNOWN_MESSAGE);
                                    expect(alertDetails.primaryBtnLabel).toEqual(globals.DIALOG.DEFAULT_BTN_TEXT);
                                });

                                it("should call the original error callback passed in to options", function () {
                                    expect(originalErrorCallback).toHaveBeenCalledWith();
                                });

                            });

                        });

                    });

                    describe("when the successFlag in the response is true", function () {

                        var method = "create",
                            model = {},
                            options = {},
                            textStatus = "success",
                            jqXHR = {},
                            overriddenOptions,
                            originalSuccessCallback = jasmine.createSpy("success() spy");

                        beforeEach(function () {
                            mockDataResponse.successFlag = true;
                            options.success = originalSuccessCallback;

                            spyOn(AjaxModel.__super__, "sync").andCallFake(function () {});

                            ajaxModel.sync(method, model, options);

                            overriddenOptions = AjaxModel.__super__.sync.mostRecentCall.args[2];

                            overriddenOptions.success.call(ajaxModel, mockDataResponse, textStatus, jqXHR);
                        });

                        it("should call the original success callback passed in to options", function () {
                            expect(originalSuccessCallback).toHaveBeenCalled();
                            expect(originalSuccessCallback.mostRecentCall.args.length).toEqual(1);
                            expect(originalSuccessCallback.mostRecentCall.args[0]).toEqual(mockDataResponse);
                        });

                    });

                });

                describe("sets the error callback that", function () {

                    var method = "create",
                        model = {},
                        options = {},
                        textStatus = "error",
                        errorThrown = "An error occurred.",
                        jqXHR = {},
                        overriddenOptions,
                        originalErrorCallback = jasmine.createSpy("error() spy");

                    beforeEach(function () {
                        options.error = originalErrorCallback;

                        spyOn(mockFacade, "publish").andCallFake(function () { });
                        spyOn(AjaxModel.__super__, "sync").andCallFake(function () {});

                        ajaxModel.sync(method, model, options);

                        overriddenOptions = AjaxModel.__super__.sync.mostRecentCall.args[2];

                        overriddenOptions.error.call(ajaxModel, jqXHR, textStatus, errorThrown);
                    });

                    it("should publish an alert with the Unknown Error text", function () {
                        var alertDetails;

                        expect(mockFacade.publish).toHaveBeenCalled();
                        expect(mockFacade.publish.mostRecentCall.args.length).toEqual(3);
                        expect(mockFacade.publish.mostRecentCall.args[0]).toEqual("app");
                        expect(mockFacade.publish.mostRecentCall.args[1]).toEqual("alert");

                        alertDetails = mockFacade.publish.mostRecentCall.args[2];

                        expect(alertDetails.title).toEqual(globals.WEBSERVICE.REQUEST_ERROR_TITLE);
                        expect(alertDetails.message).toEqual(globals.WEBSERVICE.REQUEST_ERROR_UNKNOWN_MESSAGE);
                        expect(alertDetails.primaryBtnLabel).toEqual(globals.DIALOG.DEFAULT_BTN_TEXT);
                    });

                    it("should call the original error callback passed in to options", function () {
                        expect(originalErrorCallback).toHaveBeenCalledWith();
                    });

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

                        spyOn(AjaxModel.__super__, "sync").andCallFake(function () {});

                        ajaxModel.sync(method, model, options);

                        overriddenOptions = AjaxModel.__super__.sync.mostRecentCall.args[2];

                        overriddenOptions.beforeSend.call(ajaxModel, jqXHR);
                    });

                    it("should call set the AJAX_CLIENT property of the Request Header", function () {
                        expect(jqXHR.setRequestHeader).toHaveBeenCalled();
                        expect(jqXHR.setRequestHeader.calls[0].args.length).toEqual(2);
                        expect(jqXHR.setRequestHeader.calls[0].args[0]).toEqual("AJAX_CLIENT");
                        expect(jqXHR.setRequestHeader.calls[0].args[1]).toEqual(1);
                    });

                    it("should call set the Cache-Control property of the Request Header", function () {
                        expect(jqXHR.setRequestHeader).toHaveBeenCalled();
                        expect(jqXHR.setRequestHeader.calls[1].args.length).toEqual(2);
                        expect(jqXHR.setRequestHeader.calls[1].args[0]).toEqual("Cache-Control");
                        expect(jqXHR.setRequestHeader.calls[1].args[1]).toEqual("no-cache");
                    });

                    it("should call the original beforeSend callback passed in to options", function () {
                        expect(originalBeforeSendCallback).toHaveBeenCalled();
                        expect(originalBeforeSendCallback.mostRecentCall.args.length).toEqual(1);
                        expect(originalBeforeSendCallback.mostRecentCall.args[0]).toEqual(jqXHR);
                    });

                });

                it("should call super()", function () {
                    var method = "create",
                        model = {},
                        options = {},
                        modifiedOptions;

                    spyOn(AjaxModel.__super__, "sync").andCallFake(function () {});

                    ajaxModel.sync(method, model, options);

                    expect(AjaxModel.__super__.sync).toHaveBeenCalled();
                    expect(AjaxModel.__super__.sync.mostRecentCall.args.length).toEqual(3);
                    expect(AjaxModel.__super__.sync.mostRecentCall.args[0]).toEqual(method);
                    expect(AjaxModel.__super__.sync.mostRecentCall.args[1]).toEqual(model);

                    modifiedOptions = AjaxModel.__super__.sync.mostRecentCall.args[2];

                    expect(modifiedOptions.success).toEqual(jasmine.any(Function));
                    expect(modifiedOptions.error).toEqual(jasmine.any(Function));
                    expect(modifiedOptions.beforeSend).toEqual(jasmine.any(Function));
                });
            });
        });
    });
