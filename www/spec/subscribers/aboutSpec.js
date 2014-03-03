define(["Squire"],
    function (Squire) {

        "use strict";

        // Mock application info
        var squire = new Squire(),
            mockSubscribe = jasmine.createSpy("subscribe() spy"),
            mockFacade = {
                subscribeTo: jasmine.createSpy("subscribeTo() spy").andReturn(mockSubscribe)
            },
            mockAboutController = {
                init: function () { },
                navigate: function () { }
            },
            aboutSubscriber;

        squire.mock("facade", mockFacade);
        squire.mock("controllers/AboutController", mockAboutController);

        describe("An About Subscriber", function () {
            var jasmineAsync = new AsyncSpec(this);

            jasmineAsync.beforeEach(function (done) {
                squire.require(["subscribers/about"], function (jasmineAboutSubscriber) {
                    aboutSubscriber = jasmineAboutSubscriber;
                    done();
                });
            });

            it("is defined", function () {
                expect(aboutSubscriber).toBeDefined();
            });

            it("should call the subscribeTo function on the facade", function () {
                expect(mockFacade.subscribeTo).toHaveBeenCalled();

                expect(mockFacade.subscribeTo.mostRecentCall.args.length).toEqual(2);
                expect(mockFacade.subscribeTo.mostRecentCall.args[0]).toEqual("about");
                expect(mockFacade.subscribeTo.mostRecentCall.args[1]).toEqual(mockAboutController);
            });

            it("should call subscribe 0 times", function () {
                expect(mockSubscribe.calls.length).toEqual(0);
            });

            describe("has an init function that", function () {
                beforeEach(function () {
                    spyOn(mockAboutController, "init").andCallThrough();
                    aboutSubscriber.init();
                });

                it("is defined", function () {
                    expect(aboutSubscriber.init).toBeDefined();
                });

                it("is a function", function () {
                    expect(aboutSubscriber.init).toEqual(jasmine.any(Function));
                });

                it("should call the init function on the controller", function () {
                    expect(mockAboutController.init).toHaveBeenCalled();

                    expect(mockAboutController.init.mostRecentCall.args.length).toEqual(0);
                });
            });
        });
    });
