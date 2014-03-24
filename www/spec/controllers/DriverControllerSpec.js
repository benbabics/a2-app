define(["globals", "backbone", "utils", "Squire"],
    function (globals, Backbone, utils, Squire) {

        "use strict";

        var squire = new Squire(),
            mockFacade = {
                publish: function (channel, event) { }
            },
            mockUtils = utils,
            mockDriverSearchModel = {
                "filterFirstName"   : null,
                "filterLastName"    : null,
                "filterDriverId"    : null,
                "filterStatus"      : null,
                "filterDepartmentId": null
            },
            driverSearchModel = new Backbone.Model(),
            mockDriverModel = {
                "driverId"  : "354t25ty",
                "firstName" : "Homer",
                "middleName": "B",
                "lastName"  : "Simpson",
                "status"    : "Active",
                "statusDate": "3/20/2014"
            },
            driverModel = new Backbone.Model(),
            mockDriverCollection = {
                fetch: function () { return mockDriverCollection; },
                findWhere: function () { },
                once: function () { return mockDriverCollection; },
                reset: function () { },
                resetPage: function () { },
                showAll: function () { }
            },
            mockDriverEditView = {
                $el: "",
                constructor: function () { },
                initialize: function () { },
                render: function () { },
                on: function () { }
            },
            mockDriverListView = {
                $el: "",
                constructor: function () { },
                initialize: function () { },
                render: function () { },
                on: function () { },
                showLoadingIndicator: function () { },
                hideLoadingIndicator: function () { }
            },
            mockDriverSearchView = {
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
            driverController;

        squire.mock("backbone", Backbone);
        squire.mock("facade", mockFacade);
        squire.mock("utils", mockUtils);
        squire.mock("views/DriverEditView", Squire.Helpers.returns(mockDriverEditView));
        squire.mock("views/DriverListView", Squire.Helpers.returns(mockDriverListView));
        squire.mock("views/DriverSearchView", Squire.Helpers.returns(mockDriverSearchView));
        squire.mock("collections/DriverCollection", Squire.Helpers.returns(mockDriverCollection));
        squire.mock("models/DriverSearchModel", Squire.Helpers.returns(driverSearchModel));
        squire.mock("models/UserModel", UserModel);

        describe("A Driver Controller", function () {
            beforeEach(function (done) {
                squire.require(["controllers/DriverController"], function (DriverController) {
                    driverSearchModel.set(mockDriverSearchModel);
                    driverModel.set(mockDriverModel);
                    userModel.set(mockUserModel);
                    spyOn(UserModel, "getInstance").and.callFake(function () { return userModel; });

                    driverController = DriverController;
                    driverController.init();

                    done();
                });
            });

            it("is defined", function () {
                expect(driverController).toBeDefined();
            });

            describe("has constructor that", function () {
                it("is defined", function () {
                    expect(driverController.construct).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverController.construct).toEqual(jasmine.any(Function));
                });
            });

            describe("has an init function that", function () {
                it("is defined", function () {
                    expect(driverController.init).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverController.init).toEqual(jasmine.any(Function));
                });

                it("should set the mockDriverCollection variable to a new DriverCollection object", function () {
                    expect(driverController.driverCollection).toEqual(mockDriverCollection);
                });

                it("should set the driverSearchModel variable to a new DriverSearchModel object", function () {
                    expect(driverController.driverSearchModel).toEqual(driverSearchModel);
                });

                describe("when initializing the DriverEditView", function () {
                    beforeEach(function () {
                        spyOn(mockDriverEditView, "constructor").and.callThrough();
                    });

                    it("should set the driverEditView variable to a new DriverEditView object", function () {
                        expect(driverController.driverEditView).toEqual(mockDriverEditView);
                    });

                    xit("should send in the correct parameters to the constructor", function () {
                        expect(mockDriverEditView.constructor).toHaveBeenCalledWith({
                            userModel: userModel
                        });

                        // TODO: this is not working, need to figure out how to test
                    });
                });

                describe("when initializing the DriverSearchView", function () {
                    beforeEach(function () {
                        spyOn(mockDriverSearchView, "constructor").and.callThrough();
                    });

                    it("should set the driverSearchView variable to a new DriverSearchView object", function () {
                        expect(driverController.driverSearchView).toEqual(mockDriverSearchView);
                    });

                    xit("should send in the correct parameters to the constructor", function () {
                        expect(mockDriverSearchView.constructor).toHaveBeenCalledWith({
                            model: driverSearchModel,
                            userModel: userModel
                        });

                        // TODO: this is not working, need to figure out how to test
                    });
                });

                describe("when initializing the DriverListView", function () {
                    beforeEach(function () {
                        spyOn(mockDriverListView, "constructor").and.callThrough();
                    });

                    it("should set the driverListView variable to a new DriverListView object", function () {
                        expect(driverController.driverListView).toEqual(mockDriverListView);
                    });

                    xit("should send in the correct parameters to the constructor", function () {
                        expect(mockDriverListView.constructor).toHaveBeenCalledWith({
                            collection: mockDriverCollection,
                            userModel: userModel
                        });

                        // TODO: this is not working, need to figure out how to test
                    });
                });

                it("should register a function as the handler for the edit view status changed events", function () {
                    spyOn(mockDriverEditView, "on").and.callFake(function () { });

                    driverController.init();

                    expect(mockDriverEditView.on).toHaveBeenCalledWith("reactivateDriverSuccess terminateDriverSuccess",
                        driverController.showDriverStatusChangeDetails,
                        driverController);
                });

                it("should register a function as the handler for the search view searchSubmitted event", function () {
                    spyOn(mockDriverSearchView, "on").and.callFake(function () { });

                    driverController.init();

                    expect(mockDriverSearchView.on).toHaveBeenCalledWith("searchSubmitted",
                                                                         driverController.showSearchResults,
                                                                         driverController);
                });

                it("should register a function as the handler for the list view showAllDrivers event", function () {
                    spyOn(mockDriverListView, "on").and.callFake(function () { });

                    driverController.init();

                    expect(mockDriverListView.on).toHaveBeenCalledWith("showAllDrivers",
                                                                       driverController.showAllSearchResults,
                                                                       driverController);
                });
            });

            describe("has a navigateSearch function that", function () {
                beforeEach(function () {
                    spyOn(mockDriverSearchView, "render").and.callThrough();
                    spyOn(mockUtils, "changePage").and.callThrough();

                    driverController.navigateSearch();
                });

                it("is defined", function () {
                    expect(driverController.navigateSearch).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverController.navigateSearch).toEqual(jasmine.any(Function));
                });

                it("should call render on the Driver Search View Page", function () {
                    expect(mockDriverSearchView.render).toHaveBeenCalledWith();
                });

                it("should change the page to the Driver Search View Page", function () {
                    expect(mockUtils.changePage).toHaveBeenCalled();

                    expect(mockUtils.changePage.calls.mostRecent().args.length).toEqual(4);
                    expect(mockUtils.changePage.calls.mostRecent().args[0]).toEqual(mockDriverSearchView.$el);
                    expect(mockUtils.changePage.calls.mostRecent().args[1]).toBeNull();
                    expect(mockUtils.changePage.calls.mostRecent().args[2]).toBeNull();
                    expect(mockUtils.changePage.calls.mostRecent().args[3]).toBeTruthy();
                });
            });

            describe("has a navigateDriverDetails function that", function () {
                var mockDriverId = "1234";

                beforeEach(function () {
                    mockDriverEditView.model = null;
                    spyOn(mockDriverCollection, "findWhere").and.callFake(function () { return driverModel; });
                    spyOn(mockDriverEditView, "render").and.callThrough();
                    spyOn(mockUtils, "changePage").and.callThrough();

                    driverController.navigateDriverDetails(mockDriverId);
                });

                it("is defined", function () {
                    expect(driverController.navigateDriverDetails).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverController.navigateDriverDetails).toEqual(jasmine.any(Function));
                });

                it("should call findWhere on the Driver Collection", function () {
                    expect(mockDriverCollection.findWhere).toHaveBeenCalledWith({"driverId": mockDriverId});
                });

                it("should set model on the Driver Edit View Page", function () {
                    expect(mockDriverEditView.model).toEqual(driverModel);
                });

                it("should call render on the Driver Edit View Page", function () {
                    expect(mockDriverEditView.render).toHaveBeenCalledWith();
                });

                it("should change the page to the Driver Edit View Page", function () {
                    expect(mockUtils.changePage).toHaveBeenCalled();

                    expect(mockUtils.changePage.calls.mostRecent().args.length).toEqual(1);
                    expect(mockUtils.changePage.calls.mostRecent().args[0]).toEqual(mockDriverEditView.$el);
                });
            });

            describe("has a showDriverStatusChangeDetails function that", function () {
                var response = {
                    message: "Response message"
                };
                beforeEach(function () {
                    spyOn(mockFacade, "publish").and.callFake(function () { });

                    driverController.showDriverStatusChangeDetails(response);
                });

                it("is defined", function () {
                    expect(driverController.showDriverStatusChangeDetails).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverController.showDriverStatusChangeDetails).toEqual(jasmine.any(Function));
                });

                it("should call publish on the facade", function () {
                    var appAlertOptions;

                    expect(mockFacade.publish).toHaveBeenCalled();

                    expect(mockFacade.publish.calls.mostRecent().args.length).toEqual(3);
                    expect(mockFacade.publish.calls.mostRecent().args[0]).toEqual("app");
                    expect(mockFacade.publish.calls.mostRecent().args[1]).toEqual("alert");

                    appAlertOptions = mockFacade.publish.calls.mostRecent().args[2];
                    expect(appAlertOptions.title).toEqual(globals.driverEdit.constants.STATUS_CHANGE_SUCCESS_TITLE);
                    expect(appAlertOptions.message).toEqual(response.message);
                    expect(appAlertOptions.primaryBtnLabel).toEqual(globals.DIALOG.DEFAULT_BTN_TEXT);
                    expect(appAlertOptions.popupafterclose).toEqual(jasmine.any(Function));
                });

                describe("sends as the popupafterclose argument a callback that", function () {
                    var options;

                    beforeEach(function () {
                        options = mockFacade.publish.calls.mostRecent().args[2];

                        spyOn(driverController, "updateCollection").and.callFake(function () { });

                        options.popupafterclose.call(driverController);
                    });

                    it("should call updateCollection", function () {
                        expect(driverController.updateCollection).toHaveBeenCalledWith();
                    });
                });
            });

            describe("has a showSearchResults function that", function () {
                beforeEach(function () {
                    spyOn(mockDriverCollection, "resetPage").and.callFake(function () {});
                    spyOn(driverController, "updateCollection").and.callFake(function () {});

                    driverController.showSearchResults();
                });

                it("is defined", function () {
                    expect(driverController.showSearchResults).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverController.showSearchResults).toEqual(jasmine.any(Function));
                });

                it("should call resetPage on the Driver Collection", function () {
                    expect(mockDriverCollection.resetPage).toHaveBeenCalledWith();
                });

                it("should call updateCollection", function () {
                    expect(driverController.updateCollection).toHaveBeenCalledWith();
                });
            });

            describe("has a showAllSearchResults function that", function () {
                beforeEach(function () {
                    spyOn(mockDriverCollection, "showAll").and.callFake(function () {});
                    spyOn(driverController, "updateCollection").and.callFake(function () {});

                    driverController.showAllSearchResults();
                });

                it("is defined", function () {
                    expect(driverController.showAllSearchResults).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverController.showAllSearchResults).toEqual(jasmine.any(Function));
                });

                it("should call showAll on the Driver Collection", function () {
                    expect(mockDriverCollection.showAll).toHaveBeenCalledWith();
                });

                it("should call updateCollection", function () {
                    expect(driverController.updateCollection).toHaveBeenCalledWith();
                });
            });

            describe("has an updateCollection function that", function () {
                it("is defined", function () {
                    expect(driverController.updateCollection).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverController.updateCollection).toEqual(jasmine.any(Function));
                });

                describe("when the call to fetchCollection finishes successfully", function () {
                    beforeEach(function () {
                        spyOn(driverController, "fetchCollection").and.callFake(function () {
                            var deferred = utils.Deferred();

                            deferred.resolve();
                            return deferred.promise();
                        });

                        spyOn(mockDriverListView, "showLoadingIndicator").and.callFake(function () {});
                        spyOn(mockDriverCollection, "reset").and.callFake(function () {});
                        spyOn(mockDriverListView, "render").and.callFake(function () {});
                        spyOn(utils, "changePage").and.callFake(function () {});
                        spyOn(mockDriverListView, "hideLoadingIndicator").and.callFake(function () {});

                        driverController.updateCollection();
                    });

                    it("should call the showLoadingIndicator function on the Driver List View", function () {
                        expect(mockDriverListView.showLoadingIndicator).toHaveBeenCalledWith();
                    });

                    it("should call the reset function on the Driver Collection", function () {
                        expect(mockDriverCollection.reset).toHaveBeenCalledWith([], { "silent": true });
                    });

                    it("should call fetchCollection", function () {
                        expect(driverController.fetchCollection).toHaveBeenCalledWith();
                    });

                    it("should call the render function on SiteListView", function () {
                        expect(mockDriverListView.render).toHaveBeenCalledWith();
                    });

                    it("should call the changePage function on utils", function () {
                        expect(utils.changePage).toHaveBeenCalledWith(mockDriverListView.$el, null, null, true);
                    });

                    it("should call the hideLoadingIndicator function on the Driver List View", function () {
                        expect(mockDriverListView.hideLoadingIndicator).toHaveBeenCalledWith();
                    });
                });

                describe("when the call to fetchCollection finishes with a failure", function () {
                    beforeEach(function () {
                        spyOn(driverController, "fetchCollection").and.callFake(function () {
                            var deferred = utils.Deferred();

                            deferred.reject();
                            return deferred.promise();
                        });

                        spyOn(mockDriverListView, "showLoadingIndicator").and.callFake(function () {});
                        spyOn(mockDriverCollection, "reset").and.callFake(function () {});
                        spyOn(mockDriverListView, "render").and.callFake(function () {});
                        spyOn(utils, "changePage").and.callFake(function () {});
                        spyOn(mockDriverListView, "hideLoadingIndicator").and.callFake(function () {});

                        driverController.updateCollection();
                    });

                    it("should call the showLoadingIndicator function on the Driver List View", function () {
                        expect(mockDriverListView.showLoadingIndicator).toHaveBeenCalledWith();
                    });

                    it("should call the reset function on the Driver Collection", function () {
                        expect(mockDriverCollection.reset).toHaveBeenCalledWith([], { "silent": true });
                    });

                    it("should call fetchCollection", function () {
                        expect(driverController.fetchCollection).toHaveBeenCalledWith();
                    });

                    it("should call the render function on SiteListView", function () {
                        expect(mockDriverListView.render).toHaveBeenCalledWith();
                    });

                    it("should call the changePage function on utils", function () {
                        expect(utils.changePage).toHaveBeenCalledWith(mockDriverListView.$el, null, null, true);
                    });

                    it("should call the hideLoadingIndicator function on the Driver List View", function () {
                        expect(mockDriverListView.hideLoadingIndicator).toHaveBeenCalledWith();
                    });
                });
            });

            describe("has a fetchCollection function that", function () {
                var mockPromiseReturnValue = "Promise Return Value",
                    mockDeferred = {
                        promise: function () { return mockPromiseReturnValue; },
                        reject: function () {},
                        resolve: function () {}
                    },
                    actualReturnValue;

                beforeEach(function () {
                    spyOn(utils, "Deferred").and.returnValue(mockDeferred);
                    spyOn(mockDeferred, "promise").and.callThrough();
                    spyOn(mockDriverCollection, "once").and.callThrough();
                    spyOn(mockDriverCollection, "fetch").and.callThrough();

                    actualReturnValue = driverController.fetchCollection();
                });

                it("is defined", function () {
                    expect(driverController.fetchCollection).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverController.fetchCollection).toEqual(jasmine.any(Function));
                });

                it("should call once on the Driver Collection on sync", function () {
                    expect(mockDriverCollection.once)
                        .toHaveBeenCalledWith("sync", jasmine.any(Function), driverController);
                });

                describe("when the handler of the sync event is called", function () {
                    var callback;

                    beforeEach(function () {
                        spyOn(mockDeferred, "resolve").and.callThrough();

                        callback = mockDriverCollection.once.calls.argsFor(0)[1];
                        callback.apply();
                    });

                    it("should call resolve on the Deferred object", function () {
                        expect(mockDeferred.resolve).toHaveBeenCalledWith();
                    });
                });

                it("should call once on the Driver Collection on error", function () {
                    expect(mockDriverCollection.once)
                        .toHaveBeenCalledWith("error", jasmine.any(Function), driverController);
                });

                describe("when the handler of the error event is called", function () {
                    var callback;

                    beforeEach(function () {
                        spyOn(mockDeferred, "reject").and.callThrough();

                        callback = mockDriverCollection.once.calls.argsFor(1)[1];
                        callback.apply();
                    });

                    it("should call reject on the Deferred object", function () {
                        expect(mockDeferred.reject).toHaveBeenCalledWith();
                    });
                });

                it("should call fetch on the Driver Collection", function () {
                    expect(mockDriverCollection.fetch).toHaveBeenCalledWith(driverSearchModel.toJSON());
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
