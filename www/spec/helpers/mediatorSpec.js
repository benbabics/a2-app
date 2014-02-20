define(["Squire", "utils"],
    function (Squire, utils) {

        "use strict";

        var mediatorClass,
            squire = new Squire();

        describe("The mediator class", function () {

            var jasmineAsync = new AsyncSpec(this);

            jasmineAsync.beforeEach(function (done) {
                squire.require(["helpers/mediator"], function (mediator) {
                    mediatorClass = mediator;
                    done();
                });
            });

            it("is defined", function () {
                expect(mediatorClass).toBeDefined();
            });

            describe("has a subscribe function that", function () {
                it("is defined", function () {
                    expect(mediatorClass.subscribe).toBeDefined();
                });

                it("is a function", function () {
                    expect(mediatorClass.subscribe).toEqual(jasmine.any(Function));
                });

                describe("when the passed in controller action is not a function", function () {
                    var channel = "controller_action_not_a_function",
                        subscription = "mockSubscription",
                        controller = "mockController",
                        action = "mockAction",
                        condition = null;

                    it("should throw an error", function () {
                        spyOn(window.console, "error");
                        mediatorClass.subscribe(channel, subscription, controller, action, condition);

                        expect(window.console.error).toHaveBeenCalledWith("Error: The argument for 'controller[" + action + "]' is undefined for call to facade.subscribe(" + channel + ", " + subscription + ").");
                    });
                });

                describe("when the passed in controller action is a function", function () {

                    describe("when the passed in condition is not a function", function () {
                        var channel = "condition_not_a_function",
                            subscription = "mockSubscription",
                            controller = {
                                "mockAction": function () {
                                    return true;
                                }
                            },
                            action = "mockAction",
                            condition = "mockCondition";

                        it("should default the condition to a function that returns true", function () {
                            var channelSubscriptions,
                                recentSubscription;

                            mediatorClass.subscribe(channel, subscription, controller, action, condition);
                            channelSubscriptions = mediatorClass.getChannels()[channel][subscription];

                            recentSubscription = utils._.find(channelSubscriptions, function (nextSubscription) {
                                    return nextSubscription.action === action && nextSubscription.controller === controller;
                                }
                            );

                            expect(recentSubscription).not.toBeNull();
                            expect(recentSubscription.condition).toEqual(jasmine.any(Function));
                            expect(recentSubscription.condition()).toBeTruthy();
                        });
                    });

                    describe("when the passed in condition is a function", function () {
                        var channel = "condition_is_a_function",
                            subscription = "mockSubscription",
                            controller = {
                                "mockAction": function () {
                                    return true;
                                }
                            },
                            action = "mockAction",
                            condition = function () { return null; };

                        it("should add the condition, controller and action to the channel subscriptions", function () {
                            var channelSubscriptions,
                                recentSubscription;

                            mediatorClass.subscribe(channel, subscription, controller, action, condition);
                            channelSubscriptions = mediatorClass.getChannels()[channel][subscription];

                            recentSubscription = utils._.find(channelSubscriptions, function (nextSubscription) {
                                    return nextSubscription.action === action && nextSubscription.controller === controller;
                                }
                            );

                            expect(recentSubscription).not.toBeNull();
                            expect(recentSubscription.condition).toEqual(condition);
                        });
                    });
                });

            });

            describe("has a publish function that", function () {
                it("is defined", function () {
                    expect(mediatorClass.publish).toBeDefined();
                });

                it("is a function", function () {
                    expect(mediatorClass.publish).toEqual(jasmine.any(Function));
                });

                it("should return false when channel is not in channels", function () {
                    var channel = "channel_not_in_channels",
                        subscription = "mockSubscription",
                        publishResult;

                    publishResult = mediatorClass.publish(channel, subscription);

                    expect(publishResult).toBeFalsy();
                });

                it("should return false when the subscription for the channel is not in channels", function () {
                    var channel = "subscription_not_in_channels",
                        subscription = "mockSubscription",
                        controller = {
                            "mockAction": function () {
                                return true;
                            }
                        },
                        action = "mockAction",
                        publishResult;

                    // add a null subscription with the channel so
                    // the channel will exist in channels without any subscriptions
                    mediatorClass.subscribe(channel, null, controller, action);

                    publishResult = mediatorClass.publish(channel, subscription);

                    expect(publishResult).toBeFalsy();
                });

                describe("when the channel and subscription exist in channels", function () {

                    describe("when additional arguments are passed in", function () {

                        describe("when the condition for the subscription evaluates to true", function () {
                            it("it should call the controller action with the arguments", function () {
                                var channel = "arguments_passed_and_condition_true",
                                    subscription = "mockSubscription",
                                    controller = {
                                        "mockAction": function () {
                                            return true;
                                        }
                                    },
                                    action = "mockAction",
                                    condition = function () { return true;},
                                    argument1 = "argument1",
                                    argument2 = "argument2";

                                spyOn(controller, "mockAction");

                                mediatorClass.subscribe(channel, subscription, controller, action, condition);

                                mediatorClass.publish(channel, subscription, argument1, argument2);

                                expect(controller.mockAction).toHaveBeenCalled();
                                expect(controller.mockAction.mostRecentCall.args.length).toEqual(2);
                                expect(controller.mockAction.mostRecentCall.args[0]).toEqual(argument1);
                                expect(controller.mockAction.mostRecentCall.args[1]).toEqual(argument2);
                            });
                        });

                        describe("when the condition for the subscription evaluates to false", function () {
                            it("it should NOT call the controller action with the arguments", function () {
                                var channel = "arguments_passed_and_condition_false",
                                    subscription = "mockSubscription",
                                    controller = {
                                        "mockAction": function () {
                                            return true;
                                        }
                                    },
                                    action = "mockAction",
                                    condition = function () { return false;},
                                    argument1 = "argument1",
                                    argument2 = "argument2";

                                spyOn(controller, "mockAction");

                                mediatorClass.subscribe(channel, subscription, controller, action, condition);

                                mediatorClass.publish(channel, subscription, argument1, argument2);

                                expect(controller.mockAction).not.toHaveBeenCalled();
                            });
                        });

                    });

                    describe("when no additional arguments are passed in", function () {

                        describe("when the condition for the subscription evaluates to true", function () {
                            it("it should call the controller action without arguments", function () {
                                var channel = "no_arguments_and_condition_true",
                                    subscription = "mockSubscription",
                                    controller = {
                                        "mockAction": function () {
                                            return true;
                                        }
                                    },
                                    action = "mockAction",
                                    condition = function () { return true;};

                                spyOn(controller, "mockAction");

                                mediatorClass.subscribe(channel, subscription, controller, action, condition);

                                mediatorClass.publish(channel, subscription);

                                expect(controller.mockAction).toHaveBeenCalled();
                                expect(controller.mockAction.mostRecentCall.args.length).toEqual(0);
                            });
                        });

                        describe("when the condition for the subscription evaluates to false", function () {
                            it("it should NOT call the controller action with any arguments", function () {
                                var channel = "no_arguments_and_condition_false",
                                    subscription = "mockSubscription",
                                    controller = {
                                        "mockAction": function () {
                                            return true;
                                        }
                                    },
                                    action = "mockAction",
                                    condition = function () { return false;};

                                spyOn(controller, "mockAction");

                                mediatorClass.subscribe(channel, subscription, controller, action, condition);

                                mediatorClass.publish(channel, subscription);

                                expect(controller.mockAction).not.toHaveBeenCalled();
                            });
                        });
                    });
                });
            });

            describe("has a getChannels function that", function () {
                it("is defined", function () {
                    expect(mediatorClass.getChannels).toBeDefined();
                });

                it("is a function", function () {
                    expect(mediatorClass.getChannels).toEqual(jasmine.any(Function));
                });

                // TODO: think of a way to test that getChannels is actually returning
                // the channels private member variable
            });
        });

        return "mediator";
    });