define(["backbone", "utils", "Squire"],
    function (Backbone, utils, Squire) {

        "use strict";

        var squire = new Squire(),
            mockUtils = utils,
            mockDriverSearchModel = {
                "filterFirstName"   : null,
                "filterLastName"    : null,
                "filterDriverId"    : null,
                "filterStatus"      : null,
                "filterDepartmentId": null
            },
            driverSearchModel = new Backbone.Model(),
            mockDriverSearchView = {
                $el: "",
                constructor: function () { },
                initialize: function () { },
                render: function () { }
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
        squire.mock("utils", mockUtils);
        squire.mock("views/DriverSearchView", Squire.Helpers.returns(mockDriverSearchView));
        squire.mock("models/DriverSearchModel", Squire.Helpers.returns(driverSearchModel));
        squire.mock("models/UserModel", UserModel);

        describe("A Driver Controller", function () {
            beforeEach(function (done) {
                squire.require(["controllers/DriverController"], function (DriverController) {
                    driverSearchModel.set(mockDriverSearchModel);
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
        });
    });
