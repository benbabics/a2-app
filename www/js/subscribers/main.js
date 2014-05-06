define(["subscribers/about", "subscribers/app", "subscribers/card", "subscribers/contactUs",
        "subscribers/driver", "subscribers/home", "subscribers/invoice", "subscribers/login",
        "subscribers/updatePrompt"],
    function (aboutSubscriber, appSubscriber, cardSubscriber, contactUsSubscriber,
              driverSubscriber, homeSubscriber, invoiceSubscriber, loginSubscriber, updatePromptSubscriber) {

        "use strict";

        // app
        appSubscriber.init();

        // views
        aboutSubscriber.init();
        cardSubscriber.init();
        contactUsSubscriber.init();
        driverSubscriber.init();
        homeSubscriber.init();
        invoiceSubscriber.init();
        loginSubscriber.init();
        updatePromptSubscriber.init();
    });
