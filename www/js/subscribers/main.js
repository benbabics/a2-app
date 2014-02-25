define(["subscribers/about", "subscribers/app", "subscribers/login"],
    function (aboutSubscriber, appSubscriber, loginSubscriber) {

        "use strict";

        // app
        appSubscriber.init();

        // views
        aboutSubscriber.init();
        loginSubscriber.init();
    });
