define(["backbone", "Squire", "utils", "controllers/BaseController"],
    function (Backbone, Squire, utils, BaseController) {

        "use strict";

        var squire = new Squire(),
            mockFacade = {
                publish: function () { }
            },
            mockUtils = utils,
            mockUserModel = {
                authenticated: true,
                firstName: "Beavis",
                email: "cornholio@bnbinc.com",
                hasMultipleAccounts: false,
                selectedCompany: {
                    name: "Beavis and Butthead Inc",
                    accountId: "3673683",
                    wexAccountNumber: "5764309"
                }
            },
            userModel = new Backbone.Model(),
            UserModel = {
                getInstance: function () { return userModel; }
            },
            companyModel = new Backbone.Model(),
            hierarchiesCollection = new Backbone.Collection(),
            mockHierarchyListView = {
                $el: "",
                constructor: function () { },
                initialize: function () { },
                on: function () { },
                render: function () { },
                showLoadingIndicator: function () { },
                hideLoadingIndicator: function () { },
                setModel: function () { },
                setCollection: function () { }
            },
            hierarchyController;

        squire.mock("facade", mockFacade);
        squire.mock("utils", mockUtils);
        squire.mock("controllers/BaseController", BaseController);
        squire.mock("models/CompanyModel", Squire.Helpers.returns(companyModel));
        squire.mock("models/UserModel", UserModel);
        squire.mock("views/HierarchyListView", Squire.Helpers.returns(mockHierarchyListView));

        describe("A Hierarchy Controller", function () {
            beforeEach(function (done) {
                squire.require(["controllers/HierarchyController"], function (HierarchyController) {
                    userModel.set(mockUserModel);
                    userModel.set("hierarchies", hierarchiesCollection);

                    hierarchyController = HierarchyController;

                    done();
                });
            });

            it("is defined", function () {
                expect(hierarchyController).toBeDefined();
            });

            it("looks like a BaseController", function () {
                expect(hierarchyController instanceof BaseController).toBeTruthy();
            });

            describe("has constructor that", function () {
                it("is defined", function () {
                    expect(hierarchyController.construct).toBeDefined();
                });

                it("is a function", function () {
                    expect(hierarchyController.construct).toEqual(jasmine.any(Function));
                });
            });

            describe("has an init function that", function () {
                beforeEach(function () {
                    hierarchyController.init();
                });

                it("is defined", function () {
                    expect(hierarchyController.init).toBeDefined();
                });

                it("is a function", function () {
                    expect(hierarchyController.init).toEqual(jasmine.any(Function));
                });

                it("should set the userModel variable to a UserModel object", function () {
                    expect(hierarchyController.userModel).toEqual(userModel);
                });

                describe("when initializing the HierarchyListView", function () {
                    beforeEach(function () {
                        spyOn(mockHierarchyListView, "constructor").and.callThrough();
                    });

                    it("should set the hierarchyListView variable to a new HierarchyListView object", function () {
                        expect(hierarchyController.hierarchyListView).toEqual(mockHierarchyListView);
                    });

                    xit("should send in the correct parameters to the constructor", function () {
                        expect(mockHierarchyListView.constructor).toHaveBeenCalledWith({
                            collection: hierarchiesCollection,
                            userModel : userModel
                        });

                        // TODO: this is not working, need to figure out how to test
                    });
                });

                it("should register a function as the handler for the HierarchyListView hierarchySelected event",
                    function () {
                        spyOn(mockHierarchyListView, "on").and.callFake(function () { });

                        hierarchyController.init();

                        expect(mockHierarchyListView.on).toHaveBeenCalledWith("hierarchySelected",
                            hierarchyController.hierarchySelected, hierarchyController);
                    });
            });

            describe("has a navigate function that", function () {
                beforeEach(function () {
                    mockHierarchyListView.model = null;
                    spyOn(mockHierarchyListView, "setCollection").and.callThrough();
                    spyOn(mockHierarchyListView, "setModel").and.callThrough();
                    spyOn(mockHierarchyListView, "render").and.callThrough();
                    spyOn(mockUtils, "changePage").and.callThrough();

                    hierarchyController.navigate();
                });

                it("is defined", function () {
                    expect(hierarchyController.navigate).toBeDefined();
                });

                it("is a function", function () {
                    expect(hierarchyController.navigate).toEqual(jasmine.any(Function));
                });

                it("should call setModel on the Hierarchy List View Page", function () {
                    expect(mockHierarchyListView.setModel).toHaveBeenCalledWith(null);
                });

                it("should call setCollection on the Hierarchy List View Page", function () {
                    expect(mockHierarchyListView.setCollection).toHaveBeenCalledWith(hierarchiesCollection);
                });

                it("should call render on the Hierarchy List View Page", function () {
                    expect(mockHierarchyListView.render).toHaveBeenCalledWith();
                });

                it("should change the page to the Hierarchy List View Page", function () {
                    expect(mockUtils.changePage).toHaveBeenCalledWith(mockHierarchyListView.$el, null, null, true);
                });
            });

            describe("has a hierarchySelected function that", function () {
                var mockAccountId = "1v145v1345";

                it("is defined", function () {
                    expect(hierarchyController.hierarchySelected).toBeDefined();
                });

                it("is a function", function () {
                    expect(hierarchyController.hierarchySelected).toEqual(jasmine.any(Function));
                });

                describe("when the call to fetchModel finishes successfully", function () {
                    beforeEach(function () {
                        spyOn(hierarchyController, "fetchModel").and.callFake(function () {
                            var deferred = utils.Deferred();

                            deferred.resolve();
                            return deferred.promise();
                        });

                        spyOn(mockHierarchyListView, "showLoadingIndicator").and.callThrough();
                        spyOn(companyModel, "set").and.callThrough();
                        spyOn(userModel, "set").and.callThrough();
                        spyOn(mockFacade, "publish").and.callThrough();
                        spyOn(mockHierarchyListView, "hideLoadingIndicator").and.callThrough();

                        hierarchyController.hierarchySelected(mockAccountId);
                    });

                    it("should call the showLoadingIndicator function on the Hierarchy List View", function () {
                        expect(mockHierarchyListView.showLoadingIndicator).toHaveBeenCalledWith();
                    });

                    it("should call the set function on the Company Model", function () {
                        expect(companyModel.set).toHaveBeenCalledWith("accountId", mockAccountId);
                    });

                    it("should call fetchModel", function () {
                        expect(hierarchyController.fetchModel).toHaveBeenCalledWith(companyModel);
                    });

                    it("should call the set function on the User Model", function () {
                        expect(userModel.set).toHaveBeenCalledWith("selectedCompany", companyModel);
                    });

                    it("should call the publish function on the facade", function () {
                        expect(mockFacade.publish).toHaveBeenCalledWith("home", "navigate");
                    });

                    it("should call the hideLoadingIndicator function on the Hierarchy List View", function () {
                        expect(mockHierarchyListView.hideLoadingIndicator).toHaveBeenCalledWith();
                    });
                });

                describe("when the call to fetchModel finishes with a failure", function () {
                    beforeEach(function () {
                        spyOn(hierarchyController, "fetchModel").and.callFake(function () {
                            var deferred = utils.Deferred();

                            deferred.reject();
                            return deferred.promise();
                        });

                        spyOn(mockHierarchyListView, "showLoadingIndicator").and.callThrough();
                        spyOn(companyModel, "set").and.callThrough();
                        spyOn(userModel, "set").and.callThrough();
                        spyOn(mockFacade, "publish").and.callThrough();
                        spyOn(mockHierarchyListView, "hideLoadingIndicator").and.callThrough();

                        hierarchyController.hierarchySelected(mockAccountId);
                    });

                    it("should call the showLoadingIndicator function on the Hierarchy List View", function () {
                        expect(mockHierarchyListView.showLoadingIndicator).toHaveBeenCalledWith();
                    });

                    it("should call the set function on the Company Model", function () {
                        expect(companyModel.set).toHaveBeenCalledWith("accountId", mockAccountId);
                    });

                    it("should call fetchModel", function () {
                        expect(hierarchyController.fetchModel).toHaveBeenCalledWith(companyModel);
                    });

                    it("should NOT call the set function on the User Model", function () {
                        expect(userModel.set).not.toHaveBeenCalled();
                    });

                    it("should NOT call the publish function on the facade", function () {
                        expect(mockFacade.publish).not.toHaveBeenCalled();
                    });

                    it("should call the hideLoadingIndicator function on the Hierarchy List View", function () {
                        expect(mockHierarchyListView.hideLoadingIndicator).toHaveBeenCalledWith();
                    });
                });
            });
        });
    });
