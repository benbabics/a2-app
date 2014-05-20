define(["globals", "backbone", "utils", "Squire", "controllers/BaseController"],
    function (globals, Backbone, utils, Squire, BaseController) {

        "use strict";

        var squire = new Squire(),
            mockFacade = {
                publish: function () { }
            },
            mockUtils = utils,
            mockDriverModel = {
                "id"        : 35425,
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
            mockDriverAddView = {
                $el: "",
                constructor: function () { },
                initialize: function () { },
                render: function () { },
                on: function () { }
            },
            mockDriverEditView = {
                $el: "",
                constructor: function () { },
                initialize: function () { },
                render: function () { },
                on: function () { },
                setModel: function () { }
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
                model: driverModel,
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
        squire.mock("controllers/BaseController", BaseController);
        squire.mock("views/DriverAddView", Squire.Helpers.returns(mockDriverAddView));
        squire.mock("views/DriverEditView", Squire.Helpers.returns(mockDriverEditView));
        squire.mock("views/DriverListView", Squire.Helpers.returns(mockDriverListView));
        squire.mock("views/DriverSearchView", Squire.Helpers.returns(mockDriverSearchView));
        squire.mock("collections/DriverCollection", Squire.Helpers.returns(mockDriverCollection));
        squire.mock("models/DriverModel", Squire.Helpers.returns(driverModel));
        squire.mock("models/UserModel", UserModel);

        describe("A Driver Controller", function () {
            beforeEach(function (done) {
                squire.require(["controllers/DriverController"], function (DriverController) {
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

            it("looks like a BaseController", function () {
                expect(driverController instanceof BaseController).toBeTruthy();
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

                it("should set the driverCollection variable to a new DriverCollection object", function () {
                    expect(driverController.driverCollection).toEqual(mockDriverCollection);
                });

                describe("when initializing the DriverAddView", function () {
                    beforeEach(function () {
                        spyOn(mockDriverAddView, "constructor").and.callThrough();
                    });

                    it("should set the driverAddView variable to a new DriverAddView object", function () {
                        expect(driverController.driverAddView).toEqual(mockDriverAddView);
                    });

                    xit("should send in the correct parameters to the constructor", function () {
                        expect(mockDriverAddView.constructor).toHaveBeenCalledWith({
                            model: driverModel,
                            userModel: userModel
                        });

                        // TODO: this is not working, need to figure out how to test
                    });
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
                            model: driverModel,
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

                it("should register a function as the handler for the add view driverAddSuccess event", function () {
                    spyOn(mockDriverAddView, "on").and.callFake(function () { });

                    driverController.init();

                    expect(mockDriverAddView.on).toHaveBeenCalledWith("driverAddSuccess",
                        driverController.showDriverAddDetails,
                        driverController);
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

            describe("has a navigateAdd function that", function () {
                beforeEach(function () {
                    spyOn(mockDriverAddView, "render").and.callThrough();
                    spyOn(mockUtils, "changePage").and.callThrough();

                    driverController.navigateAdd();
                });

                it("is defined", function () {
                    expect(driverController.navigateAdd).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverController.navigateAdd).toEqual(jasmine.any(Function));
                });

                it("should call render on the Driver Add View Page", function () {
                    expect(mockDriverAddView.render).toHaveBeenCalledWith();
                });

                it("should change the page to the Driver Add View Page", function () {
                    expect(mockUtils.changePage).toHaveBeenCalled();

                    expect(mockUtils.changePage.calls.mostRecent().args.length).toEqual(1);
                    expect(mockUtils.changePage.calls.mostRecent().args[0]).toEqual(mockDriverAddView.$el);
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
                var mockDriverId = 1234;

                beforeEach(function () {
                    mockDriverEditView.model = null;
                    spyOn(mockDriverCollection, "findWhere").and.callFake(function () { return driverModel; });
                    spyOn(mockDriverEditView, "setModel").and.callFake(function () { });
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
                    expect(mockDriverCollection.findWhere).toHaveBeenCalledWith({"id": mockDriverId});
                });

                it("should call setModel on the Driver Edit View Page", function () {
                    expect(mockDriverEditView.setModel).toHaveBeenCalledWith(driverModel);
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

            describe("has a showDriverAddDetails function that", function () {
                var response = "Response message";
                beforeEach(function () {
                    spyOn(mockFacade, "publish").and.callFake(function () { });

                    driverController.showDriverAddDetails(response);
                });

                it("is defined", function () {
                    expect(driverController.showDriverAddDetails).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverController.showDriverAddDetails).toEqual(jasmine.any(Function));
                });

                it("should call publish on the facade", function () {
                    var appAlertOptions;

                    expect(mockFacade.publish).toHaveBeenCalled();

                    expect(mockFacade.publish.calls.mostRecent().args.length).toEqual(3);
                    expect(mockFacade.publish.calls.mostRecent().args[0]).toEqual("app");
                    expect(mockFacade.publish.calls.mostRecent().args[1]).toEqual("alert");

                    appAlertOptions = mockFacade.publish.calls.mostRecent().args[2];
                    expect(appAlertOptions.title).toEqual(globals.driverAddedDetails.constants.SUCCESS_TITLE);
                    expect(appAlertOptions.message).toEqual(response);
                    expect(appAlertOptions.primaryBtnLabel).toEqual(globals.DIALOG.DEFAULT_BTN_TEXT);
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
                        expect(driverController.fetchCollection)
                            .toHaveBeenCalledWith(mockDriverCollection, driverModel.toJSON());
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
                        expect(driverController.fetchCollection)
                            .toHaveBeenCalledWith(mockDriverCollection, driverModel.toJSON());
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
        });
    });
