define(["utils", "backbone", "Squire"],
    function (utils, Backbone, Squire) {

        "use strict";

        var squire = new Squire(),
            mockUtils = utils,
            baseController;

        squire.mock("utils", mockUtils);

        describe("A Base Controller", function () {
            beforeEach(function (done) {
                squire.require(["controllers/BaseController"], function (BaseController) {
                    baseController = new BaseController();

                    done();
                });
            });

            it("is defined", function () {
                expect(baseController).toBeDefined();
            });

            describe("has constructor that", function () {
                it("is defined", function () {
                    expect(baseController.construct).toBeDefined();
                });

                it("is a function", function () {
                    expect(baseController.construct).toEqual(jasmine.any(Function));
                });
            });

            describe("has a fetchCollection function that", function () {
                var mockPromiseReturnValue = "Promise Return Value",
                    mockDeferred = {
                        promise: function () { return mockPromiseReturnValue; },
                        reject: function () {},
                        resolve: function () {}
                    },
                    mockData = {
                        name: "value"
                    },
                    mockCollection = {
                        fetch: function () { return mockCollection; },
                        once: function () { return mockCollection; }
                    },
                    actualReturnValue;

                beforeEach(function () {
                    spyOn(mockUtils, "Deferred").and.returnValue(mockDeferred);
                    spyOn(mockDeferred, "promise").and.callThrough();
                    spyOn(mockCollection, "once").and.callThrough();
                    spyOn(mockCollection, "fetch").and.callThrough();

                    actualReturnValue = baseController.fetchCollection(mockCollection, mockData);
                });

                it("is defined", function () {
                    expect(baseController.fetchCollection).toBeDefined();
                });

                it("is a function", function () {
                    expect(baseController.fetchCollection).toEqual(jasmine.any(Function));
                });

                it("should call once on the Collection on sync", function () {
                    expect(mockCollection.once).toHaveBeenCalledWith("sync", jasmine.any(Function), baseController);
                });

                describe("when the handler of the sync event is called", function () {
                    var callback;

                    beforeEach(function () {
                        spyOn(mockDeferred, "resolve").and.callThrough();

                        callback = mockCollection.once.calls.argsFor(0)[1];
                        callback.apply();
                    });

                    it("should call resolve on the Deferred object", function () {
                        expect(mockDeferred.resolve).toHaveBeenCalledWith();
                    });
                });

                it("should call once on the Collection on error", function () {
                    expect(mockCollection.once).toHaveBeenCalledWith("error", jasmine.any(Function), baseController);
                });

                describe("when the handler of the error event is called", function () {
                    var callback;

                    beforeEach(function () {
                        spyOn(mockDeferred, "reject").and.callThrough();

                        callback = mockCollection.once.calls.argsFor(1)[1];
                        callback.apply();
                    });

                    it("should call reject on the Deferred object", function () {
                        expect(mockDeferred.reject).toHaveBeenCalledWith();
                    });
                });

                it("should call fetch on the Collection", function () {
                    expect(mockCollection.fetch).toHaveBeenCalledWith(mockData);
                });

                it("should call promise on the Deferred object", function () {
                    expect(mockDeferred.promise).toHaveBeenCalledWith();
                });

                it("should return the expected value", function () {
                    expect(actualReturnValue).toEqual(mockPromiseReturnValue);
                });
            });

            describe("has a fetchModel function that", function () {
                var mockPromiseReturnValue = "Promise Return Value",
                    mockDeferred = {
                        promise: function () { return mockPromiseReturnValue; },
                        reject: function () {},
                        resolve: function () {}
                    },
                    mockModel = {
                        fetch: function () { return mockModel; },
                        once: function () { return mockModel; }
                    },
                    actualReturnValue;

                beforeEach(function () {
                    spyOn(mockUtils, "Deferred").and.returnValue(mockDeferred);
                    spyOn(mockDeferred, "promise").and.callThrough();
                    spyOn(mockModel, "once").and.callThrough();
                    spyOn(mockModel, "fetch").and.callThrough();

                    actualReturnValue = baseController.fetchModel(mockModel);
                });

                it("is defined", function () {
                    expect(baseController.fetchModel).toBeDefined();
                });

                it("is a function", function () {
                    expect(baseController.fetchModel).toEqual(jasmine.any(Function));
                });

                it("should call once on the Model on sync", function () {
                    expect(mockModel.once).toHaveBeenCalledWith("sync", jasmine.any(Function), baseController);
                });

                describe("when the handler of the sync event is called", function () {
                    var callback;

                    beforeEach(function () {
                        spyOn(mockDeferred, "resolve").and.callThrough();

                        callback = mockModel.once.calls.argsFor(0)[1];
                        callback.apply();
                    });

                    it("should call resolve on the Deferred object", function () {
                        expect(mockDeferred.resolve).toHaveBeenCalledWith();
                    });
                });

                it("should call once on the Model on error", function () {
                    expect(mockModel.once).toHaveBeenCalledWith("error", jasmine.any(Function), baseController);
                });

                describe("when the handler of the error event is called", function () {
                    var callback;

                    beforeEach(function () {
                        spyOn(mockDeferred, "reject").and.callThrough();

                        callback = mockModel.once.calls.argsFor(1)[1];
                        callback.apply();
                    });

                    it("should call reject on the Deferred object", function () {
                        expect(mockDeferred.reject).toHaveBeenCalledWith();
                    });
                });

                it("should call fetch on the Model", function () {
                    expect(mockModel.fetch).toHaveBeenCalledWith();
                });

                it("should call promise on the Deferred object", function () {
                    expect(mockDeferred.promise).toHaveBeenCalledWith();
                });

                it("should return the expected value", function () {
                    expect(actualReturnValue).toEqual(mockPromiseReturnValue);
                });
            });
        });
    });
