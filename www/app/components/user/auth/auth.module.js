(function () {
    "use strict";

    angular.module("app.components.user.auth", [])
 
      .config(function($cordovaInAppBrowserProvider) {
        var defaults = {
          location:   'no',
          clearcache: 'yes',
          toolbar:    'yes'
        };

        $cordovaInAppBrowserProvider.setDefaultOptions(defaults)
      });
})();
