define(["Squire", "globals", "backbone", "utils"],
    function (Squire, globals, Backbone, utils) {

        "use strict";

        var squire = new Squire(),
            mockFacade = {
                publish: function () { }
            },
            mockBackbone = Backbone,
            mockDataResponse = {
                successFlag: false,
                message: {
                    type: "",
                    text: ""
                }
            },
            AjaxCollection,
            ajaxCollection;

        squire.mock("facade", mockFacade);
        squire.mock("backbone", mockBackbone);

        describe("An Ajax Collection", function () {
            beforeEach(function (done) {
                squire.require(["collections/AjaxCollection"], function (JasmineAjaxCollection) {
                    AjaxCollection = JasmineAjaxCollection;
                    ajaxCollection = new AjaxCollection();

                    done();
                });
            });

            it("is defined", function () {
                expect(ajaxCollection).toBeDefined();
            });

            it("looks like a Backbone collection", function () {
                expect(ajaxCollection instanceof Backbone.Collection).toBeTruthy();
            });

            describe("has a parse function that", function () {
                var mockResponse = {
                    data: {
                        totalResults: 123454,
                        searchResults: [
                            {
                                id: "134613456",
                                name: "UNASSIGNED",
                                visible: true
                            },
                            {
                                id: "2456724567",
                                name: "Dewey, Cheetum and Howe",
                                visible: false
                            }
                        ]
                    }
                };

                it("is defined", function () {
                    expect(ajaxCollection.parse).toBeDefined();
                });

                it("is a function", function () {
                    expect(ajaxCollection.parse).toEqual(jasmine.any(Function));
                });

                it("should set totalResults", function () {
                    ajaxCollection.totalResults = null;

                    ajaxCollection.parse(mockResponse);

                    expect(ajaxCollection.totalResults).toEqual(mockResponse.data.totalResults);
                });

                it("should return searchResults", function () {
                    var actualReturnValue = ajaxCollection.parse(mockResponse);

                    expect(actualReturnValue).toEqual(mockResponse.data.searchResults);
                });
            });

            describe("has a fetch function that", function () {
                var mockOptions = {
                    "firstName"   : "Curly",
                    "lastName"    : "Howard",
                    "driverId"    : null,
                    "status"      : null,
                    "departmentId": null
                };

                beforeEach(function () {
                    ajaxCollection.totalResults = "fgasfdsgafgq";

                    spyOn(AjaxCollection.__super__, "fetch").and.callFake(function () { });

                    ajaxCollection.fetch(mockOptions);
                });

                it("is defined", function () {
                    expect(ajaxCollection.fetch).toBeDefined();
                });

                it("is a function", function () {
                    expect(ajaxCollection.fetch).toEqual(jasmine.any(Function));
                });

                it("should set totalResults to null", function () {
                    expect(ajaxCollection.totalResults).toBeNull();
                });

                it("should call super", function () {
                    var expectedOptions = {
                        data: mockOptions
                    };

                    expect(AjaxCollection.__super__.fetch).toHaveBeenCalledWith(expectedOptions);
                });
            });

            describe("has a sync function that", function () {
                it("is defined", function () {
                    expect(ajaxCollection.sync).toBeDefined();
                });

                it("is a function", function () {
                    expect(ajaxCollection.sync).toEqual(jasmine.any(Function));
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

                        ajaxCollection.sync(method, model, options);

                        overriddenOptions = mockBackbone.sync.calls.mostRecent().args[2];

                        overriddenOptions.beforeSend.call(ajaxCollection, jqXHR);
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
                                    originalErrorCallback = jasmine.createSpy("error() spy");

                                beforeEach(function () {
                                    mockDataResponse.message.text = "An error occurred.";
                                    options.error = originalErrorCallback;

                                    spyOn(mockFacade, "publish").and.callFake(function () { });

                                    ajaxCollection.sync(method, model, options);
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

                                it("should publish an alert of the message text", function () {
                                    var alertDetails;

                                    expect(mockFacade.publish).toHaveBeenCalled();
                                    expect(mockFacade.publish.calls.mostRecent().args.length).toEqual(3);
                                    expect(mockFacade.publish.calls.mostRecent().args[0]).toEqual("app");
                                    expect(mockFacade.publish.calls.mostRecent().args[1]).toEqual("alert");

                                    alertDetails = mockFacade.publish.calls.mostRecent().args[2];

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
                                    originalErrorCallback = jasmine.createSpy("error() spy");

                                beforeEach(function () {
                                    mockDataResponse.message.text = null;
                                    options.error = originalErrorCallback;

                                    spyOn(mockFacade, "publish").and.callFake(function () { });

                                    ajaxCollection.sync(method, model, options);
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
                                    expect(alertDetails.message)
                                        .toEqual(globals.WEBSERVICE.REQUEST_ERROR_UNKNOWN_MESSAGE);
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
                            originalSuccessCallback = jasmine.createSpy("success() spy");

                        beforeEach(function () {
                            mockDataResponse.successFlag = true;
                            options.success = originalSuccessCallback;
                        });

                        it("should call Backbone.sync()", function () {
                            var modifiedOptions;

                            ajaxCollection.sync(method, model, options);

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

                                ajaxCollection.sync(method, model, options);

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

                                ajaxCollection.sync(method, model, options);

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

                        ajaxCollection.sync(method, model, options);
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
        });
    });
