define(["utils", "Squire", "globals"],
    function (utils, Squire, globals) {

        "use strict";

        var squire = new Squire(),
            mockFacade = {
                publish: function (channel, event) { }
            },
            mockUtils = utils,
            mockLoginModel = {},
            mockUserModel = {
                reset: function () { },
                get: function () { },
                set: function () { }
            },
            UserModel = {
                getInstance: function () { }
            },
            mockLoginView = {
                $el: "",
                constructor: function () { },
                initialize: function () { },
                render: function () { },
                on: function () { },
                showLoadingIndicator: function () { },
                hideLoadingIndicator: function () { }
            },
            loginController;

        squire.mock("facade", mockFacade);
        squire.mock("utils", mockUtils);
        squire.mock("views/LoginView", Squire.Helpers.returns(mockLoginView));
        squire.mock("models/LoginModel", Squire.Helpers.returns(mockLoginModel));
        squire.mock("models/UserModel", UserModel);

        describe("A Login Controller", function () {
            var jasmineAsync = new AsyncSpec(this);

            jasmineAsync.beforeEach(function (done) {
                squire.require(["controllers/LoginController"], function (LoginController) {
                    spyOn(UserModel, "getInstance").andCallFake(function () { return mockUserModel; });

                    loginController = LoginController;
                    loginController.init();

                    done();
                });
            });

            it("is defined", function () {
                expect(loginController).toBeDefined();
            });

            describe("has constructor that", function () {
                it("is defined", function () {
                    expect(loginController.construct).toBeDefined();
                });

                it("is a function", function () {
                    expect(loginController.construct).toEqual(jasmine.any(Function));
                });
            });

            describe("has an init function that", function () {
                it("is defined", function () {
                    expect(loginController.init).toBeDefined();
                });

                it("is a function", function () {
                    expect(loginController.init).toEqual(jasmine.any(Function));
                });

                it("should set the userModel variable to an instance of the UserModel object", function () {
                    loginController.init();

                    expect(loginController.userModel).toEqual(mockUserModel);
                });

                describe("when initializing the LoginView", function () {
                    beforeEach(function () {
                        spyOn(mockLoginView, "constructor").andCallThrough();

                        loginController.init();
                    });

                    it("should set the loginView variable to a new LoginView object", function () {
                        expect(loginController.loginView).toEqual(mockLoginView);
                    });

                    xit("should send in the correct parameters to the constructor", function () {
                        expect(mockLoginView.constructor).toHaveBeenCalled();
                        expect(mockLoginView.constructor).toHaveBeenCalledWith({
                            model: mockLoginModel,
                            el   : document.body
                        });

                        // TODO: this is not working, need to figure out how to test
                    });
                });

                it("should call utils._.bindAll", function () {
                    spyOn(mockUtils._, "bindAll").andCallFake(function () { });

                    loginController.init();

                    expect(mockUtils._.bindAll).toHaveBeenCalled();

                    expect(mockUtils._.bindAll.mostRecentCall.args.length).toEqual(3);
                    expect(mockUtils._.bindAll.mostRecentCall.args[0]).toEqual(loginController);
                    expect(mockUtils._.bindAll.mostRecentCall.args[1]).toEqual("navigate");
                    expect(mockUtils._.bindAll.mostRecentCall.args[2]).toEqual("setAuthentication");
                });

                it("should register a function as the handler for the view loginSuccess event", function () {
                    spyOn(mockLoginView, "on").andCallFake(function () { });

                    loginController.init();

                    expect(mockLoginView.on).toHaveBeenCalled();
                    expect(mockLoginView.on.calls[0].args.length).toEqual(3);
                    expect(mockLoginView.on.calls[0].args[0]).toEqual("loginSuccess");
                    expect(mockLoginView.on.calls[0].args[1]).toEqual(loginController.handleLoginSuccess);
                    expect(mockLoginView.on.calls[0].args[2]).toEqual(loginController);
                });

                it("should register a function as the handler for the view loginFailure event", function () {
                    spyOn(mockLoginView, "on").andCallFake(function () { });

                    loginController.init();

                    expect(mockLoginView.on).toHaveBeenCalled();
                    expect(mockLoginView.on.calls[1].args.length).toEqual(3);
                    expect(mockLoginView.on.calls[1].args[0]).toEqual("loginFailure");
                    expect(mockLoginView.on.calls[1].args[1]).toEqual(loginController.clearAuthentication);
                    expect(mockLoginView.on.calls[1].args[2]).toEqual(loginController);
                });
            });

            describe("has a navigate function that", function () {
                beforeEach(function () {
                    spyOn(mockUtils, "changePage").andCallThrough();

                    loginController.navigate();
                });

                it("is defined", function () {
                    expect(loginController.navigate).toBeDefined();
                });

                it("is a function", function () {
                    expect(loginController.navigate).toEqual(jasmine.any(Function));
                });

                it("should change the page to the Login View Page", function () {
                    expect(mockUtils.changePage).toHaveBeenCalled();

                    expect(mockUtils.changePage.mostRecentCall.args.length).toEqual(4);
                    expect(mockUtils.changePage.mostRecentCall.args[0]).toEqual(mockLoginView.$el);
                    expect(mockUtils.changePage.mostRecentCall.args[1]).toBeNull();
                    expect(mockUtils.changePage.mostRecentCall.args[2]).toBeNull();
                    expect(mockUtils.changePage.mostRecentCall.args[3]).toBeTruthy();
                });
            });

            describe("has a setAuthentication function that", function () {
                it("is defined", function () {
                    expect(loginController.setAuthentication).toBeDefined();
                });

                it("is a function", function () {
                    expect(loginController.setAuthentication).toEqual(jasmine.any(Function));
                });

                it("should set UserModel with Authenticated Response data", function () {
                    var mockResponse = {
                            firstName: "Joe",
                            email: "joe.schmoe@someplace.com",
                            selectedCompany: {
                                name: "The Company",
                                wexAccountNumber: "123456789"
                            }
                        },
                        objectToSetUserModel;

                    spyOn(mockUserModel, "set").andCallFake(function () { });

                    loginController.setAuthentication(mockResponse);

                    expect(mockUserModel.set).toHaveBeenCalled();
                    expect(mockUserModel.set.mostRecentCall.args.length).toEqual(1);

                    objectToSetUserModel = mockUserModel.set.mostRecentCall.args[0];

                    expect(objectToSetUserModel.authenticated).toBeTruthy();
                    expect(objectToSetUserModel.firstName).toEqual(mockResponse.firstName);
                    expect(objectToSetUserModel.email).toEqual(mockResponse.email);
                    expect(objectToSetUserModel.selectedCompany.name).toEqual(mockResponse.selectedCompany.name);
                    expect(objectToSetUserModel.selectedCompany.wexAccountNumber).toEqual(mockResponse.selectedCompany.wexAccountNumber);
                });
            });

            describe("has a clearAuthentication function that", function () {
                it("is defined", function () {
                    expect(loginController.clearAuthentication).toBeDefined();
                });

                it("is a function", function () {
                    expect(loginController.clearAuthentication).toEqual(jasmine.any(Function));
                });

                it("should reset the User Model", function () {
                    spyOn(mockUserModel, "reset").andCallFake(function () { });

                    loginController.clearAuthentication();

                    expect(mockUserModel.reset).toHaveBeenCalledWith();
                });
            });

            describe("had a handleLoginSuccess function that", function () {
                var response = {};

                beforeEach(function () {
                    spyOn(loginController, "setAuthentication").andCallFake(function () { });
                    spyOn(mockFacade, "publish").andCallFake(function () { });

                    loginController.handleLoginSuccess(response);
                });

                it("is defined", function () {
                    expect(loginController.handleLoginSuccess).toBeDefined();
                });

                it("is a function", function () {
                    expect(loginController.handleLoginSuccess).toEqual(jasmine.any(Function));
                });

                it("should call setAuthentication() with the response data", function () {
                    expect(loginController.setAuthentication).toHaveBeenCalledWith(response);
                });

                it("should publish to navigate to home", function () {
                    expect(mockFacade.publish).toHaveBeenCalled();
                    expect(mockFacade.publish.mostRecentCall.args.length).toEqual(2);
                    expect(mockFacade.publish.mostRecentCall.args[0]).toEqual("home");
                    expect(mockFacade.publish.mostRecentCall.args[1]).toEqual("navigate");
                });
            });

            describe("has a logout function that", function () {
                it("is defined", function () {
                    expect(loginController.logout).toBeDefined();
                });

                it("is a function", function () {
                    expect(loginController.logout).toEqual(jasmine.any(Function));
                });

                it("should show the loading indicator", function () {
                    spyOn(mockUtils, "post").andCallFake(function () { });  // stubbing so it doesn't actually post
                    spyOn(mockLoginView, "showLoadingIndicator").andCallFake(function () {});
                    loginController.logout();

                    expect(mockLoginView.showLoadingIndicator).toHaveBeenCalledWith();
                });

                it("should send the logout URL to post()", function () {
                    spyOn(mockUtils, "post").andCallFake(function () { });
                    loginController.logout();

                    expect(mockUtils.post).toHaveBeenCalledWith(globals.WEBSERVICE.LOGOUT.URL);
                });

                describe("when the call to post() finishes successfully", function () {
                    beforeEach(function () {
                        spyOn(mockUtils, "post").andCallFake(function () {
                            var deferred = utils.Deferred();

                            deferred.resolve();
                            return deferred.promise();
                        });
                        spyOn(loginController, "clearAuthentication").andCallFake(function () { });
                        spyOn(loginController, "navigate").andCallFake(function () { });
                        spyOn(mockLoginView, "hideLoadingIndicator").andCallFake(function () { });

                        loginController.logout();
                    });

                    it("should call clearAuthentication", function () {
                        expect(loginController.clearAuthentication).toHaveBeenCalledWith();
                    });

                    it("should call navigate", function () {
                        expect(loginController.navigate).toHaveBeenCalledWith();
                    });

                    it("should hide the Loading Indicator", function () {
                        expect(mockLoginView.hideLoadingIndicator).toHaveBeenCalledWith();
                    });
                });

                describe("when the call to post() finishes with a failure", function () {
                    beforeEach(function () {
                        spyOn(mockUtils, "post").andCallFake(function () {
                            var deferred = utils.Deferred();

                            deferred.reject();
                            return deferred.promise();
                        });
                        spyOn(loginController, "clearAuthentication").andCallFake(function () { });
                        spyOn(loginController, "navigate").andCallFake(function () { });
                        spyOn(mockLoginView, "hideLoadingIndicator").andCallFake(function () { });

                        loginController.logout();
                    });

                    it("should call clearAuthentication", function () {
                        expect(loginController.clearAuthentication).toHaveBeenCalledWith();
                    });

                    it("should call navigate", function () {
                        expect(loginController.navigate).toHaveBeenCalledWith();
                    });

                    it("should hide the Loading Indicator", function () {
                        expect(mockLoginView.hideLoadingIndicator).toHaveBeenCalledWith();
                    });
                });

            });
        });
    });