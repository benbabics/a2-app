(function () {
    "use strict";

    beforeEach(inject(function (globals) {
        //make all feature flags enabled by default
        TestUtils.setFeatureFlagsEnabled(globals, true);
    }));
})();