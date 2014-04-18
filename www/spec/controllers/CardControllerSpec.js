define(["globals", "backbone", "utils", "Squire", "models/UserModel"],
    function (globals, Backbone, utils, Squire, UserModel) {

        "use strict";

        var squire = new Squire(),
            mockFacade = {
                publish: function () { }
            },
            mockUtils = utils,
            mockCardModel = {
                "id"                      : 1234,
                "authorizationProfileName": "Auth Profile Name",
                "status"                  : "Status",
                "department"              : {
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
            mockCardAddView = {
                $el: "",
                constructor: function () { },
                initialize: function () { },
                render: function () { },
                on: function () { },
                showLoadingIndicator: function () { },
                hideLoadingIndicator: function () { }
            },
            mockCardListView = {
                $el: "",
                constructor: function () { },
                initialize: function () { },
                render: function () { },
                on: function () { },
                showLoadingIndicator: function () { },
                hideLoadingIndicator: function () { }
            },
            mockCardSearchView = {
                $el: "",
                model: cardModel,
                constructor: function () { },
                initialize: function () { },
                render: function () { },
                on: function () { }
            },
            mockCardDetailView = {
                $el: "",
                constructor: function () { },
                initialize: function () { },
                render: function () { },
                on: function () { }
            },
            mockUserModel = {
                authenticated: true,
                firstName: "Beavis",
                email: "cornholio@bnbinc.com",
                hasMultipleAccounts: false,
                selectedCompany: {
                    name: "Beavis and Butthead Inc",
                    accountId: "3673683",
                    wexAccountNumber: "5764309",
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
                    ],
                    requiredFields: [
                        "REQUIRED_FIELD_1",
                        "REQUIRED_FIELD_2",
                        "REQUIRED_FIELD_3"
                    ],
                    settings: {
                        cardSettings: {
                            customVehicleIdMaxLength: 17,
                            licensePlateNumberMaxLength: 10,
                            licensePlateStateFixedLength: 2,
                            vehicleDescriptionMaxLength: 17,
                            vinFixedLength: 17
                        },
                        driverSettings: {
                            idFixedLength: 4,
                            firstNameMaxLength: 11,
                            middleNameMaxLength: 1,
                            lastNameMaxLength: 12
                        }
                    }
                },
                permissions: [
                    "PERMISSION_1",
                    "PERMISSION_2",
                    "PERMISSION_3"
                ]
            },
            userModel = UserModel.getInstance(),
            cardController;

        squire.mock("backbone", Backbone);
        squire.mock("facade", mockFacade);
        squire.mock("utils", mockUtils);
        squire.mock("views/CardAddView", Squire.Helpers.returns(mockCardAddView));
        squire.mock("views/CardDetailView", Squire.Helpers.returns(mockCardDetailView));
        squire.mock("views/CardListView", Squire.Helpers.returns(mockCardListView));
        squire.mock("views/CardSearchView", Squire.Helpers.returns(mockCardSearchView));
        squire.mock("collections/CardCollection", Squire.Helpers.returns(mockCardCollection));
        squire.mock("models/CardModel", Squire.Helpers.returns(cardModel));
        squire.mock("models/UserModel", UserModel);

        describe("A Card Controller", function () {
            beforeEach(function (done) {
                squire.require(["controllers/CardController"], function (CardController) {
                    cardModel.set(mockCardModel);
                    userModel.initialize(mockUserModel);
                    spyOn(UserModel, "getInstance").and.callThrough();

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

                it("should set the userModel variable to a UserModel object", function () {
                    expect(cardController.userModel).toEqual(userModel);
                });

                it("should set the cardCollection variable to a new CardCollection object", function () {
                    expect(cardController.cardCollection).toEqual(mockCardCollection);
                });

                describe("when initializing the CardAddView", function () {
                    beforeEach(function () {
                        spyOn(mockCardAddView, "constructor").and.callThrough();
                    });

                    it("should set the cardAddView variable to a new CardAddView object", function () {
                        expect(cardController.cardAddView).toEqual(mockCardAddView);
                    });

                    xit("should send in the correct parameters to the constructor", function () {
                        expect(mockCardAddView.constructor).toHaveBeenCalledWith({
                            model: cardModel,
                            userModel: userModel
                        });

                        // TODO: this is not working, need to figure out how to test
                    });
                });

                describe("when initializing the CardListView", function () {
                    beforeEach(function () {
                        spyOn(mockCardListView, "constructor").and.callThrough();
                    });

                    it("should set the cardListView variable to a new CardListView object", function () {
                        expect(cardController.cardListView).toEqual(mockCardListView);
                    });

                    xit("should send in the correct parameters to the constructor", function () {
                        expect(mockCardListView.constructor).toHaveBeenCalledWith({
                            collection: mockCardCollection,
                            userModel: userModel
                        });

                        // TODO: this is not working, need to figure out how to test
                    });
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

                describe("when initializing the CardDetailView", function () {
                    beforeEach(function () {
                        spyOn(mockCardDetailView, "constructor").and.callThrough();
                    });

                    it("should set the cardDetailView variable to a new CardDetailView object", function () {
                        expect(cardController.cardDetailView).toEqual(mockCardDetailView);
                    });

                    xit("should send in the correct parameters to the constructor", function () {
                        expect(mockCardDetailView.constructor).toHaveBeenCalledWith({
                            userModel: userModel
                        });

                        // TODO: this is not working, need to figure out how to test
                    });
                });

                it("should register a function as the handler for the search view terminateCardSuccess event",
                    function () {
                        spyOn(mockCardDetailView, "on").and.callFake(function () { });

                        cardController.init();

                        expect(mockCardDetailView.on).toHaveBeenCalledWith("terminateCardSuccess",
                            cardController.showCardStatusChangeDetails,
                            cardController);
                    });

                it("should register a function as the handler for the search view searchSubmitted event", function () {
                    spyOn(mockCardSearchView, "on").and.callFake(function () { });

                    cardController.init();

                    expect(mockCardSearchView.on).toHaveBeenCalledWith("searchSubmitted",
                        cardController.showSearchResults,
                        cardController);
                });

                it("should register a function as the handler for the list view showAllCards event", function () {
                    spyOn(mockCardListView, "on").and.callFake(function () { });

                    cardController.init();

                    expect(mockCardListView.on).toHaveBeenCalledWith("showAllCards",
                        cardController.showAllSearchResults,
                        cardController);
                });
            });

            describe("has a beforeNavigateAddCondition function that", function () {
                it("is defined", function () {
                    expect(cardController.beforeNavigateAddCondition).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardController.beforeNavigateAddCondition).toEqual(jasmine.any(Function));
                });

                describe("when the user does not have a selectedCompany", function () {
                    it("should return true", function () {
                        userModel.set("selectedCompany", null);

                        expect(cardController.beforeNavigateAddCondition()).toBeTruthy();
                    });
                });

                describe("when the fetched attributes are available", function () {
                    it("should return true", function () {
                        var selectedCompany = userModel.get("selectedCompany");
                        spyOn(selectedCompany, "areFetchedPropertiesEmpty").and.returnValue(false);

                        expect(cardController.beforeNavigateAddCondition()).toBeTruthy();
                    });
                });

                describe("when the fetched attributes are NOT available", function () {
                    var selectedCompany;

                    beforeEach(function () {
                        selectedCompany = userModel.get("selectedCompany");

                        spyOn(mockCardAddView, "showLoadingIndicator").and.callFake(function () {});
                        spyOn(mockCardAddView, "hideLoadingIndicator").and.callFake(function () {});
                        spyOn(cardController, "navigateAdd").and.callFake(function () {});
                        spyOn(selectedCompany, "areFetchedPropertiesEmpty").and.returnValue(true);
                    });

                    it("should call showLoadingIndicator on the Card Add View Page", function () {
                        spyOn(selectedCompany, "fetch").and.returnValue(true);

                        cardController.beforeNavigateAddCondition();
                        expect(mockCardAddView.showLoadingIndicator).toHaveBeenCalledWith();
                    });

                    it("should call fetch on the Company", function () {
                        spyOn(selectedCompany, "fetch").and.returnValue(true);

                        cardController.beforeNavigateAddCondition();
                        expect(selectedCompany.fetch).toHaveBeenCalledWith();
                    });

                    describe("when the call to fetch on the Company finishes successfully", function () {
                        beforeEach(function () {
                            spyOn(selectedCompany, "fetch").and.callFake(function () {
                                var deferred = utils.Deferred();

                                deferred.resolve();
                                return deferred.promise();
                            });

                            cardController.beforeNavigateAddCondition();
                        });

                        it("should call navigateAdd", function () {
                            expect(cardController.navigateAdd).toHaveBeenCalledWith();
                        });

                        it("should call hideLoadingIndicator on the Card Add View Page", function () {
                            expect(mockCardAddView.hideLoadingIndicator).toHaveBeenCalledWith();
                        });
                    });

                    describe("when the call to fetch on the Company finishes in failure", function () {
                        beforeEach(function () {
                            spyOn(selectedCompany, "fetch").and.callFake(function () {
                                var deferred = utils.Deferred();

                                deferred.reject();
                                return deferred.promise();
                            });

                            cardController.beforeNavigateAddCondition();
                        });

                        it("should NOT call navigateAdd", function () {
                            expect(cardController.navigateAdd).not.toHaveBeenCalledWith();
                        });

                        it("should call hideLoadingIndicator on the Card Add View Page", function () {
                            expect(mockCardAddView.hideLoadingIndicator).toHaveBeenCalledWith();
                        });
                    });

                    it("should return false", function () {
                        spyOn(selectedCompany, "fetch").and.returnValue(true);

                        expect(cardController.beforeNavigateAddCondition()).toBeFalsy();
                    });
                });
            });

            describe("has a navigateAdd function that", function () {
                beforeEach(function () {
                    spyOn(mockCardAddView, "render").and.callThrough();
                    spyOn(mockUtils, "changePage").and.callThrough();

                    cardController.navigateAdd();
                });

                it("is defined", function () {
                    expect(cardController.navigateAdd).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardController.navigateAdd).toEqual(jasmine.any(Function));
                });

                it("should call render on the Card Add View Page", function () {
                    expect(mockCardAddView.render).toHaveBeenCalledWith();
                });

                it("should change the page to the Card Add View Page", function () {
                    expect(mockUtils.changePage).toHaveBeenCalled();

                    expect(mockUtils.changePage.calls.mostRecent().args.length).toEqual(1);
                    expect(mockUtils.changePage.calls.mostRecent().args[0]).toEqual(mockCardAddView.$el);
                });
            });

            describe("has a navigateCardDetails function that", function () {
                var mockCardNumber = 1234;

                beforeEach(function () {
                    mockCardDetailView.model = null;
                    spyOn(mockCardCollection, "findWhere").and.callFake(function () { return cardModel; });
                    spyOn(mockCardDetailView, "render").and.callThrough();
                    spyOn(mockUtils, "changePage").and.callThrough();

                    cardController.navigateCardDetails(mockCardNumber);
                });

                it("is defined", function () {
                    expect(cardController.navigateCardDetails).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardController.navigateCardDetails).toEqual(jasmine.any(Function));
                });

                it("should call findWhere on the Card Collection", function () {
                    expect(mockCardCollection.findWhere).toHaveBeenCalledWith({"id": mockCardNumber});
                });

                it("should set model on the Card Detail View Page", function () {
                    expect(mockCardDetailView.model).toEqual(cardModel);
                });

                it("should call render on the Card Detail View Page", function () {
                    expect(mockCardDetailView.render).toHaveBeenCalledWith();
                });

                it("should change the page to the Card Detail View Page", function () {
                    expect(mockUtils.changePage).toHaveBeenCalled();

                    expect(mockUtils.changePage.calls.mostRecent().args.length).toEqual(1);
                    expect(mockUtils.changePage.calls.mostRecent().args[0]).toEqual(mockCardDetailView.$el);
                });
            });

            describe("has a navigateSearch function that", function () {
                beforeEach(function () {
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

            describe("has a showCardStatusChangeDetails function that", function () {
                var response = {
                    message: "Response message"
                };
                beforeEach(function () {
                    spyOn(mockFacade, "publish").and.callFake(function () { });

                    cardController.showCardStatusChangeDetails(response);
                });

                it("is defined", function () {
                    expect(cardController.showCardStatusChangeDetails).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardController.showCardStatusChangeDetails).toEqual(jasmine.any(Function));
                });

                it("should call publish on the facade", function () {
                    var appAlertOptions;

                    expect(mockFacade.publish).toHaveBeenCalled();

                    expect(mockFacade.publish.calls.mostRecent().args.length).toEqual(3);
                    expect(mockFacade.publish.calls.mostRecent().args[0]).toEqual("app");
                    expect(mockFacade.publish.calls.mostRecent().args[1]).toEqual("alert");

                    appAlertOptions = mockFacade.publish.calls.mostRecent().args[2];
                    expect(appAlertOptions.title).toEqual(globals.cardDetails.constants.STATUS_CHANGE_SUCCESS_TITLE);
                    expect(appAlertOptions.message).toEqual(response.message);
                    expect(appAlertOptions.primaryBtnLabel).toEqual(globals.DIALOG.DEFAULT_BTN_TEXT);
                    expect(appAlertOptions.popupafterclose).toEqual(jasmine.any(Function));
                });

                describe("sends as the popupafterclose argument a callback that", function () {
                    var options;

                    beforeEach(function () {
                        options = mockFacade.publish.calls.mostRecent().args[2];

                        spyOn(cardController, "updateCollection").and.callFake(function () { });

                        options.popupafterclose.call(cardController);
                    });

                    it("should call updateCollection", function () {
                        expect(cardController.updateCollection).toHaveBeenCalledWith();
                    });
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
                        spyOn(utils, "fetchCollection").and.callFake(function () {
                            var deferred = utils.Deferred();

                            deferred.resolve();
                            return deferred.promise();
                        });

                        spyOn(mockCardListView, "showLoadingIndicator").and.callFake(function () {});
                        spyOn(mockCardCollection, "reset").and.callFake(function () {});
                        spyOn(mockCardListView, "render").and.callFake(function () {});
                        spyOn(utils, "changePage").and.callFake(function () {});
                        spyOn(mockCardListView, "hideLoadingIndicator").and.callFake(function () {});

                        cardController.updateCollection();
                    });

                    it("should call the showLoadingIndicator function on the Card List View", function () {
                        expect(mockCardListView.showLoadingIndicator).toHaveBeenCalledWith();
                    });

                    it("should call the reset function on the Card Collection", function () {
                        expect(mockCardCollection.reset).toHaveBeenCalledWith([], { "silent": true });
                    });

                    it("should call fetchCollection on utils", function () {
                        expect(utils.fetchCollection).toHaveBeenCalledWith(mockCardCollection, cardModel.toJSON());
                    });

                    it("should call the render function on SiteListView", function () {
                        expect(mockCardListView.render).toHaveBeenCalledWith();
                    });

                    it("should call the changePage function on utils", function () {
                        expect(utils.changePage).toHaveBeenCalledWith(mockCardListView.$el, null, null, true);
                    });

                    it("should call the hideLoadingIndicator function on the Card List View", function () {
                        expect(mockCardListView.hideLoadingIndicator).toHaveBeenCalledWith();
                    });
                });

                describe("when the call to fetchCollection finishes with a failure", function () {
                    beforeEach(function () {
                        spyOn(utils, "fetchCollection").and.callFake(function () {
                            var deferred = utils.Deferred();

                            deferred.reject();
                            return deferred.promise();
                        });

                        spyOn(mockCardListView, "showLoadingIndicator").and.callFake(function () {});
                        spyOn(mockCardCollection, "reset").and.callFake(function () {});
                        spyOn(mockCardListView, "render").and.callFake(function () {});
                        spyOn(utils, "changePage").and.callFake(function () {});
                        spyOn(mockCardListView, "hideLoadingIndicator").and.callFake(function () {});

                        cardController.updateCollection();
                    });

                    it("should call the showLoadingIndicator function on the Card List View", function () {
                        expect(mockCardListView.showLoadingIndicator).toHaveBeenCalledWith();
                    });

                    it("should call the reset function on the Card Collection", function () {
                        expect(mockCardCollection.reset).toHaveBeenCalledWith([], { "silent": true });
                    });

                    it("should call fetchCollection", function () {
                        expect(utils.fetchCollection).toHaveBeenCalledWith(mockCardCollection, cardModel.toJSON());
                    });

                    it("should call the render function on SiteListView", function () {
                        expect(mockCardListView.render).toHaveBeenCalledWith();
                    });

                    it("should call the changePage function on utils", function () {
                        expect(utils.changePage).toHaveBeenCalledWith(mockCardListView.$el, null, null, true);
                    });

                    it("should call the hideLoadingIndicator function on the Card List View", function () {
                        expect(mockCardListView.hideLoadingIndicator).toHaveBeenCalledWith();
                    });
                });
            });
        });
    });
