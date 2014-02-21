define(["Squire", "helpers/mediator"],
    function (Squire, mediator) {

        "use strict";

        var facadeClass,
            squire = new Squire();

        squire.mock("helpers/mediator", mediator);

        describe("The facade class", function () {

            var jasmineAsync = new AsyncSpec(this);

            jasmineAsync.beforeEach(function (done) {
                squire.require(["facade"], function (facade) {
                    facadeClass = facade;
                    done();
                });
            });

            it("is defined", function () {
                expect(facadeClass).toBeDefined();
            });

            describe("has a subscribe function that", function () {
                beforeEach(function () {
                    spyOn(window.console, "error");
                    spyOn(mediator, "subscribe").andCallFake(function () { });
                });

                it("is defined", function () {
                    expect(facadeClass.subscribe).toBeDefined();
                });

                it("is a function", function () {
                    expect(facadeClass.subscribe).toEqual(jasmine.any(Function));
                });

                it("should throw an error when channel is undefined", function () {
                    var channel = undefined,
                        subscription = "mockSubscription",
                        controller = "mockController",
                        action = "mockAction",
                        condition = null;

                    facadeClass.subscribe(channel, subscription, controller, action, condition);

                    expect(window.console.error).toHaveBeenCalledWith("facade.subscribe is expecting 1st argument 'channel' to be defined.");
                    expect(mediator.subscribe).not.toHaveBeenCalled();
                });

                it("should throw an error when subscription is undefined", function () {
                    var channel = "mockChannel",
                        subscription = undefined,
                        controller = "mockController",
                        action = "mockAction",
                        condition = null;

                    facadeClass.subscribe(channel, subscription, controller, action, condition);

                    expect(window.console.error).toHaveBeenCalledWith("facade.subscribe is expecting 2nd argument 'subscription' to be defined.");
                    expect(mediator.subscribe).not.toHaveBeenCalled();
                });

                it("should throw an error when controller is undefined", function () {
                    var channel = "mockChannel",
                        subscription = "mockSubscription",
                        controller = undefined,
                        action = "mockAction",
                        condition = null;

                    facadeClass.subscribe(channel, subscription, controller, action, condition);

                    expect(window.console.error).toHaveBeenCalledWith(
                        "facade.subscribe is expecting 3rd argument 'controller' to be defined."
                    );
                    expect(mediator.subscribe).not.toHaveBeenCalled();
                });

                it("should throw an error when action is undefined", function () {
                    var channel = "mockChannel",
                        subscription = "mockSubscription",
                        controller = "mockController",
                        action = undefined,
                        condition = null;

                    facadeClass.subscribe(channel, subscription, controller, action, condition);

                    expect(window.console.error).toHaveBeenCalledWith(
                        "facade.subscribe is expecting 4th argument 'action' to be defined."
                    );
                    expect(mediator.subscribe).not.toHaveBeenCalled();
                });

                it("should call mediator.subscribe() when all required params are valid", function () {
                    var channel = "mockChannel",
                        subscription = "mockSubscription",
                        controller = "mockController",
                        action = "mockAction",
                        condition = null;

                    facadeClass.subscribe(channel, subscription, controller, action, condition);

                    expect(mediator.subscribe).toHaveBeenCalled();
                    expect(mediator.subscribe.mostRecentCall.args.length).toEqual(5);
                    expect(mediator.subscribe.mostRecentCall.args[0]).toEqual(channel);
                    expect(mediator.subscribe.mostRecentCall.args[1]).toEqual(subscription);
                    expect(mediator.subscribe.mostRecentCall.args[2]).toEqual(controller);
                    expect(mediator.subscribe.mostRecentCall.args[3]).toEqual(action);
                    expect(mediator.subscribe.mostRecentCall.args[4]).toEqual(condition);
                });
            });

            describe("has a subscribeTo function that", function () {
                beforeEach(function () {
                    spyOn(window.console, "error");
                    spyOn(mediator, "subscribe").andCallFake(function () { });
                });

                it("is defined", function () {
                    expect(facadeClass.subscribeTo).toBeDefined();
                });

                it("is a function", function () {
                    expect(facadeClass.subscribeTo).toEqual(jasmine.any(Function));
                });

                it("should throw an error when channel is undefined", function () {
                    var channel = undefined,
                        controller = "mockController",
                        result;

                    result = facadeClass.subscribeTo(channel, controller);

                    expect(window.console.error).toHaveBeenCalledWith(
                        "facade.subscribeTo is expecting 1st argument 'channel' to be defined."
                    );
                    expect(result).not.toEqual(jasmine.any(Function));
                });

                it("should throw an error when controller is undefined", function () {
                    var channel = "mockChannel",
                        controller = undefined,
                        result;

                    result = facadeClass.subscribeTo(channel, controller);

                    expect(window.console.error).toHaveBeenCalledWith(
                        "facade.subscribeTo is expecting 2nd argument 'controller' to be defined."
                    );
                    expect(result).not.toEqual(jasmine.any(Function));
                });

                describe("when channel and controller are defined", function () {

                    var channel = "mockChannel",
                        controller = {
                            "mockAction": function () { return true; }
                        };

                    describe("when action is defined and action is a function of controller", function () {

                        var action = "mockAction",
                            subscription = "mockSubscription",
                            condition = null,
                            resultFunction;

                        it("should return a function", function () {
                            resultFunction = facadeClass.subscribeTo(channel, controller);

                            expect(resultFunction).toEqual(jasmine.any(Function));
                        });

                        it("should call subscribe() when the returned function is executed", function () {
                            spyOn(facadeClass, "subscribe").andCallFake(function () { });

                            resultFunction = facadeClass.subscribeTo(channel, controller);
                            resultFunction.call(facadeClass, subscription, action, condition);

                            expect(facadeClass.subscribe).toHaveBeenCalled();
                            expect(facadeClass.subscribe.mostRecentCall.args.length).toEqual(5);
                            expect(facadeClass.subscribe.mostRecentCall.args[0]).toEqual(channel);
                            expect(facadeClass.subscribe.mostRecentCall.args[1]).toEqual(subscription);
                            expect(facadeClass.subscribe.mostRecentCall.args[2]).toEqual(controller);
                            expect(facadeClass.subscribe.mostRecentCall.args[3]).toEqual(action);
                            expect(facadeClass.subscribe.mostRecentCall.args[4]).toEqual(condition);
                        });
                    });

                    describe("when action is not defined", function () {

                        var action = undefined,
                            subscription = "mockSubscription",
                            condition = null,
                            resultFunction;

                        it("should return a function", function () {
                            resultFunction = facadeClass.subscribeTo(channel, controller);

                            expect(resultFunction).toEqual(jasmine.any(Function));
                        });

                        it("should not call subscribe() when the returned function is executed", function () {
                            spyOn(facadeClass, "subscribe").andCallFake(function () { });

                            resultFunction = facadeClass.subscribeTo(channel, controller);
                            resultFunction.call(facadeClass, subscription, action, condition);

                            expect(facadeClass.subscribe).not.toHaveBeenCalled();
                        });
                    });

                    describe("when action is defined but not a function of controller", function () {

                        var action = "not_an_action_of_controller",
                            subscription = "mockSubscription",
                            condition = null,
                            resultFunction;

                        it("should return a function", function () {
                            resultFunction = facadeClass.subscribeTo(channel, controller);

                            expect(resultFunction).toEqual(jasmine.any(Function));
                        });

                        it("should not call subscribe() when the returned function is executed", function () {
                            spyOn(facadeClass, "subscribe").andCallFake(function () { });

                            resultFunction = facadeClass.subscribeTo(channel, controller);
                            resultFunction.call(facadeClass, subscription, action, condition);

                            expect(facadeClass.subscribe).not.toHaveBeenCalled();
                        });
                    });

                });
            });

            describe("has a publish function that", function () {

                beforeEach(function () {
                    spyOn(mediator, "publish").andCallFake(function () { });
                });

                it("is defined", function () {
                    expect(facadeClass.publish).toBeDefined();
                });

                it("is a function", function () {
                    expect(facadeClass.publish).toEqual(jasmine.any(Function));
                });

                it("should call mediator.publish() with additional arguments when there are additional arguments",
                    function () {
                        var channel = "mockChannel",
                            subscriber = "mockSubscriber",
                            argument1 = "argument1",
                            argument2 = "argument2";

                        facadeClass.publish(channel, subscriber, argument1, argument2);

                        expect(mediator.publish).toHaveBeenCalled();
                        expect(mediator.publish.mostRecentCall.args.length).toEqual(4);
                        expect(mediator.publish.mostRecentCall.args[0]).toEqual(channel);
                        expect(mediator.publish.mostRecentCall.args[1]).toEqual(subscriber);
                        expect(mediator.publish.mostRecentCall.args[2]).toEqual(argument1);
                        expect(mediator.publish.mostRecentCall.args[3]).toEqual(argument2);
                    });

                it("should call mediator.publish() without additional arguments when there are no additional arguments",
                    function () {
                        var channel = "mockChannel",
                            subscriber = "mockSubscriber";

                        facadeClass.publish(channel, subscriber);

                        expect(mediator.publish).toHaveBeenCalled();
                        expect(mediator.publish.mostRecentCall.args.length).toEqual(2);
                        expect(mediator.publish.mostRecentCall.args[0]).toEqual(channel);
                        expect(mediator.publish.mostRecentCall.args[1]).toEqual(subscriber);
                    });
            });

        });

        return "facade";
    });