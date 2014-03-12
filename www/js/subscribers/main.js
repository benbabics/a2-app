define(["subscribers/about", "subscribers/app", "subscribers/contactUs", "subscribers/driver", "subscribers/home",
        "subscribers/login", "subscribers/updatePrompt"],
    function (aboutSubscriber, appSubscriber, contactUsSubscriber, driverSubscriber, homeSubscriber,
              loginSubscriber, updatePromptSubscriber) {

        "use strict";

        // app
        appSubscriber.init();

        // views
        aboutSubscriber.init();
        contactUsSubscriber.init();
        driverSubscriber.init();
        homeSubscriber.init();
        loginSubscriber.init();
        updatePromptSubscriber.init();
    });
