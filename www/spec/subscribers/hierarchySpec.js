define(["Squire"],
    function (Squire) {

        "use strict";

        var squire = new Squire(),
            mockSubscribe = jasmine.createSpy("subscribe() spy"),
            mockFacade = {
                subscribeTo: jasmine.createSpy("subscribeTo() spy").and.returnValue(mockSubscribe)
            },
            mockHierarchyController = {
                init: jasmine.createSpy("init() spy")
            },
            hierarchySubscriber;

        squire.mock("facade", mockFacade);
        squire.mock("controllers/HierarchyController", mockHierarchyController);

        describe("A Hierarchy Subscriber", function () {
            beforeEach(function (done) {
                squire.require(["subscribers/hierarchy"], function (jasmineHierarchySubscriber) {
                    hierarchySubscriber = jasmineHierarchySubscriber;
                    done();
                });
            });

            it("is defined", function () {
                expect(hierarchySubscriber).toBeDefined();
            });

            it("should call the subscribeTo function on the facade", function () {
                expect(mockFacade.subscribeTo).toHaveBeenCalledWith("hierarchy", mockHierarchyController);
            });

            it("should call subscribe 1 time", function () {
                expect(mockSubscribe.calls.count()).toEqual(1);
            });

            it("should subscribe to navigate", function () {
                expect(mockSubscribe).toHaveBeenCalledWith("navigate", "navigate");
            });

            describe("has an init function that", function () {
                beforeEach(function () {
                    hierarchySubscriber.init();
                });

                it("is defined", function () {
                    expect(hierarchySubscriber.init).toBeDefined();
                });

                it("is a function", function () {
                    expect(hierarchySubscriber.init).toEqual(jasmine.any(Function));
                });

                it("should call the init function on the controller", function () {
                    expect(mockHierarchyController.init).toHaveBeenCalledWith();
                });
            });
        });
    });
