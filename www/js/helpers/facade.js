define(["utils", "helpers/mediator"],
    function (utils, mediator) {

        "use strict";


        function validateParameterIsDefined(functionName, parameterValue, parameterNumber, parameterName) {
            if (parameterValue === undefined) {
                window.console && window.console.error(functionName + " is expecting " + parameterNumber + " argument '" + parameterName + "' to be defined.");
                return false;
            }
            return true;
        }

        function subscribe(channel, subscription, controller, action, condition) {
            // only subscribe if the required params are valid
            if (validateParameterIsDefined("facade.subscribe", channel, "1st", "channel")
                && validateParameterIsDefined("facade.subscribe", subscription, "2nd", "subscription")
                && validateParameterIsDefined("facade.subscribe", controller, "3rd", "controller")
                && validateParameterIsDefined("facade.subscribe", action, "4th", "action")) {

                mediator.subscribe(channel, subscription, controller, action, condition);
            }
        }

        function subscribeTo(channel, controller) {
            // only return the function if the require params are valid
            if (validateParameterIsDefined("facade.subscribeTo", channel, "1st", "channel")
                && validateParameterIsDefined("facade.subscribeTo", controller, "2nd", "controller")) {

                return function (subscription, action, condition) {
                    if (action && utils.isFn(controller[action])) {
                        subscribe(channel, subscription, controller, action, condition);
                    }
                };
            }
        }

        function publish() {
            var args, channel, subscriber;
            channel    = arguments[0];
            subscriber = arguments[1];
            args       = 3 <= arguments.length ? utils.__slice.call(arguments, 2) : [];

            mediator.publish.apply(mediator, [channel, subscriber].concat(utils.__slice.call(args)));
        }


        return {
            publish    : publish,
            subscribe  : subscribe,
            subscribeTo: subscribeTo
        };
    });