define(["globals", "backbone", "utils", "Squire"],
    function (globals, Backbone, utils, Squire) {

        "use strict";

        var squire = new Squire(),
            mockUtils = utils,
            mockCardModel = {
                "number"                  : 1234,
                "authorizationProfileName": "Auth Profile Name",
                "status"                  : "Status",
                "department"              :
                {
                    id: "134613456",
                    name: "UNASSIGNED",
                    visible: true
                },
                "customVehicleId"         : "Custom Vehicle Id",
                "vehicleDescription"      : "Vehicle Description",
                "licensePlateNumber"      : "1234567",
                "licensePlateState"       : "ME",
                "vin"                     : "12345678901234567"
            },
            cardModel = new Backbone.Model(),
            mockCardCollection = {
                fetch: function () { return mockCardCollection; },
                findWhere: function () { },
                once: function () { return mockCardCollection; },
                reset: function () { },
                resetPage: function () { },
                showAll: function () { }
            },
            mockCardSearchView = {
                $el: "",
                model: cardModel,
                constructor: function () { },
                initialize: function () { },
                render: function () { },
                resetForm: function () { },
                on: function () { }
            },
            mockUserModel = {
                authenticated: true,
                firstName: "Beavis",
                email: "cornholio@bnbinc.com",
                selectedCompany: {
                    name: "Beavis and Butthead Inc",
                    accountId: "3673683",
                    wexAccountNumber: "5764309",
                    driverIdLength: "4",
                    departments: [
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
                },
                permissions: [
                    "PERMISSION_1",
                    "PERMISSION_2",
                    "PERMISSION_3"
                ]
            },
            userModel = new Backbone.Model(),
            UserModel = {
                getInstance: function () { }
            },
            cardController;

        squire.mock("backbone", Backbone);
        squire.mock("utils", mockUtils);
        squire.mock("views/CardSearchView", Squire.Helpers.returns(mockCardSearchView));
        squire.mock("collections/CardCollection", Squire.Helpers.returns(mockCardCollection));
        squire.mock("models/CardModel", Squire.Helpers.returns(cardModel));
        squire.mock("models/UserModel", UserModel);

        describe("A Card Controller", function () {
            beforeEach(function (done) {
                squire.require(["controllers/CardController"], function (CardController) {
                    cardModel.set(mockCardModel);
                    userModel.set(mockUserModel);
                    spyOn(UserModel, "getInstance").and.callFake(function () { return userModel; });

                    cardController = CardController;
                    cardController.init();

                    done();
                });
            });

            it("is defined", function () {
                expect(cardController).toBeDefined();
            });

            describe("has constructor that", function () {
                it("is defined", function () {
                    expect(cardController.construct).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardController.construct).toEqual(jasmine.any(Function));
                });
            });

            describe("has an init function that", function () {
                it("is defined", function () {
                    expect(cardController.init).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardController.init).toEqual(jasmine.any(Function));
                });

                it("should set the cardCollection variable to a new CardCollection object", function () {
                    expect(cardController.cardCollection).toEqual(mockCardCollection);
                });

                describe("when initializing the CardSearchView", function () {
                    beforeEach(function () {
                        spyOn(mockCardSearchView, "constructor").and.callThrough();
                    });

                    it("should set the cardSearchView variable to a new CardSearchView object", function () {
                        expect(cardController.cardSearchView).toEqual(mockCardSearchView);
                    });

                    xit("should send in the correct parameters to the constructor", function () {
                        expect(mockCardSearchView.constructor).toHaveBeenCalledWith({
                            model: cardModel,
                            userModel: userModel
                        });

                        // TODO: this is not working, need to figure out how to test
                    });
                });

                it("should register a function as the handler for the search view searchSubmitted event", function () {
                    spyOn(mockCardSearchView, "on").and.callFake(function () { });

                    cardController.init();

                    expect(mockCardSearchView.on).toHaveBeenCalledWith("searchSubmitted",
                        cardController.showSearchResults,
                        cardController);
                });
            });

            describe("has a navigateSearch function that", function () {
                beforeEach(function () {
                    spyOn(mockCardSearchView, "resetForm").and.callThrough();
                    spyOn(mockCardSearchView, "render").and.callThrough();
                    spyOn(mockUtils, "changePage").and.callThrough();

                    cardController.navigateSearch();
                });

                it("is defined", function () {
                    expect(cardController.navigateSearch).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardController.navigateSearch).toEqual(jasmine.any(Function));
                });

                it("should call resetForm on the Card Search View Page", function () {
                    expect(mockCardSearchView.resetForm).toHaveBeenCalledWith();
                });

                it("should call render on the Card Search View Page", function () {
                    expect(mockCardSearchView.render).toHaveBeenCalledWith();
                });

                it("should change the page to the Card Search View Page", function () {
                    expect(mockUtils.changePage).toHaveBeenCalled();

                    expect(mockUtils.changePage.calls.mostRecent().args.length).toEqual(4);
                    expect(mockUtils.changePage.calls.mostRecent().args[0]).toEqual(mockCardSearchView.$el);
                    expect(mockUtils.changePage.calls.mostRecent().args[1]).toBeNull();
                    expect(mockUtils.changePage.calls.mostRecent().args[2]).toBeNull();
                    expect(mockUtils.changePage.calls.mostRecent().args[3]).toBeTruthy();
                });
            });

            describe("has a showSearchResults function that", function () {
                beforeEach(function () {
                    spyOn(mockCardCollection, "resetPage").and.callFake(function () {});
                    spyOn(cardController, "updateCollection").and.callFake(function () {});

                    cardController.showSearchResults();
                });

                it("is defined", function () {
                    expect(cardController.showSearchResults).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardController.showSearchResults).toEqual(jasmine.any(Function));
                });

                it("should call resetPage on the Card Collection", function () {
                    expect(mockCardCollection.resetPage).toHaveBeenCalledWith();
                });

                it("should call updateCollection", function () {
                    expect(cardController.updateCollection).toHaveBeenCalledWith();
                });
            });

            describe("has an updateCollection function that", function () {
                it("is defined", function () {
                    expect(cardController.updateCollection).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardController.updateCollection).toEqual(jasmine.any(Function));
                });

                describe("when the call to fetchCollection finishes successfully", function () {
                    beforeEach(function () {
                        spyOn(cardController, "fetchCollection").and.callFake(function () {
                            var deferred = utils.Deferred();

                            deferred.resolve();
                            return deferred.promise();
                        });

//                        spyOn(mockCardListView, "showLoadingIndicator").and.callFake(function () {});
                        spyOn(mockCardCollection, "reset").and.callFake(function () {});
//                        spyOn(mockCardListView, "render").and.callFake(function () {});
//                        spyOn(utils, "changePage").and.callFake(function () {});
//                        spyOn(mockCardListView, "hideLoadingIndicator").and.callFake(function () {});

                        cardController.updateCollection();
                    });

//                    it("should call the showLoadingIndicator function on the Card List View", function () {
//                        expect(mockCardListView.showLoadingIndicator).toHaveBeenCalledWith();
//                    });

                    it("should call the reset function on the Card Collection", function () {
                        expect(mockCardCollection.reset).toHaveBeenCalledWith([], { "silent": true });
                    });

                    it("should call fetchCollection", function () {
                        expect(cardController.fetchCollection).toHaveBeenCalledWith();
                    });

//                    it("should call the render function on SiteListView", function () {
//                        expect(mockCardListView.render).toHaveBeenCalledWith();
//                    });

//                    it("should call the changePage function on utils", function () {
//                        expect(utils.changePage).toHaveBeenCalledWith(mockCardListView.$el, null, null, true);
//                    });

//                    it("should call the hideLoadingIndicator function on the Card List View", function () {
//                        expect(mockCardListView.hideLoadingIndicator).toHaveBeenCalledWith();
//                    });
                });

                describe("when the call to fetchCollection finishes with a failure", function () {
                    beforeEach(function () {
                        spyOn(cardController, "fetchCollection").and.callFake(function () {
                            var deferred = utils.Deferred();

                            deferred.reject();
                            return deferred.promise();
                        });

//                        spyOn(mockCardListView, "showLoadingIndicator").and.callFake(function () {});
                        spyOn(mockCardCollection, "reset").and.callFake(function () {});
//                        spyOn(mockCardListView, "render").and.callFake(function () {});
//                        spyOn(utils, "changePage").and.callFake(function () {});
//                        spyOn(mockCardListView, "hideLoadingIndicator").and.callFake(function () {});

                        cardController.updateCollection();
                    });

//                    it("should call the showLoadingIndicator function on the Card List View", function () {
//                        expect(mockCardListView.showLoadingIndicator).toHaveBeenCalledWith();
//                    });

                    it("should call the reset function on the Card Collection", function () {
                        expect(mockCardCollection.reset).toHaveBeenCalledWith([], { "silent": true });
                    });

                    it("should call fetchCollection", function () {
                        expect(cardController.fetchCollection).toHaveBeenCalledWith();
                    });

//                    it("should call the render function on SiteListView", function () {
//                        expect(mockCardListView.render).toHaveBeenCalledWith();
//                    });

//                    it("should call the changePage function on utils", function () {
//                        expect(utils.changePage).toHaveBeenCalledWith(mockCardListView.$el, null, null, true);
//                    });

//                    it("should call the hideLoadingIndicator function on the Card List View", function () {
//                        expect(mockCardListView.hideLoadingIndicator).toHaveBeenCalledWith();
//                    });
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
                    spyOn(mockCardCollection, "once").and.callThrough();
                    spyOn(mockCardCollection, "fetch").and.callThrough();

                    actualReturnValue = cardController.fetchCollection();
                });

                it("is defined", function () {
                    expect(cardController.fetchCollection).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardController.fetchCollection).toEqual(jasmine.any(Function));
                });

                it("should call once on the Card Collection on sync", function () {
                    expect(mockCardCollection.once)
                        .toHaveBeenCalledWith("sync", jasmine.any(Function), cardController);
                });

                describe("when the handler of the sync event is called", function () {
                    var callback;

                    beforeEach(function () {
                        spyOn(mockDeferred, "resolve").and.callThrough();

                        callback = mockCardCollection.once.calls.argsFor(0)[1];
                        callback.apply();
                    });

                    it("should call resolve on the Deferred object", function () {
                        expect(mockDeferred.resolve).toHaveBeenCalledWith();
                    });
                });

                it("should call once on the Card Collection on error", function () {
                    expect(mockCardCollection.once)
                        .toHaveBeenCalledWith("error", jasmine.any(Function), cardController);
                });

                describe("when the handler of the error event is called", function () {
                    var callback;

                    beforeEach(function () {
                        spyOn(mockDeferred, "reject").and.callThrough();

                        callback = mockCardCollection.once.calls.argsFor(1)[1];
                        callback.apply();
                    });

                    it("should call reject on the Deferred object", function () {
                        expect(mockDeferred.reject).toHaveBeenCalledWith();
                    });
                });

                it("should call fetch on the Card Collection", function () {
                    expect(mockCardCollection.fetch).toHaveBeenCalledWith(cardModel.toJSON());
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
