define(["Squire"],
    function (Squire) {

        "use strict";

        // Mock application info
        var squire = new Squire(),
            mockSubscribe = jasmine.createSpy("subscribe() spy"),
            mockFacade = {
                subscribeTo: jasmine.createSpy("subscribeTo() spy").andReturn(mockSubscribe)
            },
            mockLoginController = {
                init: function () { },
                navigate: function () { }
            },
            loginSubscriber;

        squire.mock("facade", mockFacade);
        squire.mock("controllers/LoginController", mockLoginController);

        describe("A Login Subscriber", function () {
            var jasmineAsync = new AsyncSpec(this);

            jasmineAsync.beforeEach(function (done) {
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

                expect(mockFacade.subscribeTo.mostRecentCall.args.length).toEqual(2);
                expect(mockFacade.subscribeTo.mostRecentCall.args[0]).toEqual("login");
                expect(mockFacade.subscribeTo.mostRecentCall.args[1]).toEqual(mockLoginController);
            });

            it("should call subscribe 1 time", function () {
                expect(mockSubscribe.calls.length).toEqual(1);
            });

            it("should subscribe to navigate", function () {
                expect(mockSubscribe).toHaveBeenCalledWith("navigate", "navigate");
            });

            describe("has an init function that", function () {
                beforeEach(function () {
                    spyOn(mockLoginController, "init").andCallThrough();
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

                    expect(mockLoginController.init.mostRecentCall.args.length).toEqual(0);
                });
            });
        });
    });
