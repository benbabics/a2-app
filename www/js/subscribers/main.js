define(["subscribers/app", "subscribers/login"],
    function (appSubscriber, loginSubscriber) {

        "use strict";

        // app
        appSubscriber.init();

        // views
        loginSubscriber.init();
    });
