define(["Squire"],
    function (Squire) {

        "use strict";

        // Mock application info
        var squire = new Squire(),
            mockSubscribe = jasmine.createSpy("subscribe() spy"),
            mockFacade = {
                subscribeTo: jasmine.createSpy("subscribeTo() spy").and.returnValue(mockSubscribe)
            },
            mockLoginController = {
                init: function () { },
                navigate: function () { }
            },
            loginSubscriber;

        squire.mock("facade", mockFacade);
        squire.mock("controllers/LoginController", mockLoginController);

        describe("A Login Subscriber", function () {
            beforeEach(function (done) {
                squire.require(["subscribers/login"], function (jasmineLoginSubscriber) {
                    loginSubscriber = jasmineLoginSubscriber;
                    done();
                });
            });

            it("is defined", function () {
                expect(loginSubscriber).toBeDefined();
            });

            it("should call the subscribeTo function on the facade", function () {
                expect(mockFacade.subscribeTo).toHaveBeenCalled();

                expect(mockFacade.subscribeTo.calls.mostRecent().args.length).toEqual(2);
                expect(mockFacade.subscribeTo.calls.mostRecent().args[0]).toEqual("login");
                expect(mockFacade.subscribeTo.calls.mostRecent().args[1]).toEqual(mockLoginController);
            });

            it("should call subscribe 2 times", function () {
                expect(mockSubscribe.calls.count()).toEqual(2);
            });

            it("should subscribe to navigate", function () {
                expect(mockSubscribe).toHaveBeenCalledWith("navigate", "navigate");
            });

            it("should subscribe to userLogout", function () {
                expect(mockSubscribe).toHaveBeenCalledWith("userLogout", "logout");
            });

            describe("has an init function that", function () {
                beforeEach(function () {
                    spyOn(mockLoginController, "init").and.callThrough();
                    loginSubscriber.init();
                });

                it("is defined", function () {
                    expect(loginSubscriber.init).toBeDefined();
                });

                it("is a function", function () {
                    expect(loginSubscriber.init).toEqual(jasmine.any(Function));
                });

                it("should call the init function on the controller", function () {
                    expect(mockLoginController.init).toHaveBeenCalled();

                    expect(mockLoginController.init.calls.mostRecent().args.length).toEqual(0);
                });
            });
        });
    });
