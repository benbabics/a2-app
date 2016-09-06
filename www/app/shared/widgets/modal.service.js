(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    /* jshint -W106 */ // Ignore variables with underscores that were not created by us

    /* @ngInject */
    function Modal(_, $cordovaKeyboard, $ionicModal, $q, $rootScope, Logger) {
        // Private members
        var modals = [];

        // Revealed Public members
        var service = {
            closeAll             : closeAll,
            createByType         : createByType,
            createFromTemplate   : createFromTemplate,
            createFromTemplateUrl: createFromTemplateUrl,
            getAll               : getAll,
            setAll               : setAll
        };

        activate();

        return service;
        //////////////////////
        //Public functions:

        /**
         * Closes all open modals registered with this service.
         */
        function closeAll() {
            _.forEach(modals, function (modal) {
                modal.hide();
            });
        }

        function createByType(type, options) {
            if (_.has(type, "template")) {
                return $q.when(createFromTemplate(type.template, _.extend({}, _.get(type, "options", {}), options)));
            }
            else if (_.has(type, "templateUrl")) {
                return createFromTemplateUrl(type.templateUrl, _.extend({}, _.get(type, "options", {}), options));
            }
            else {
                var error = "Failed to create modal from unknown type. ";

                Logger.error(error + type);
                return $q.reject(error);
            }
        }

        function createFromTemplate(template, options) {
            return addModal($ionicModal.fromTemplate(template, options));
        }

        function createFromTemplateUrl(templateUrl, options) {
            return $ionicModal.fromTemplateUrl(templateUrl, options)
                .then(addModal);
        }

        function getAll() {
            return modals;
        }

        function setAll(_modals) {
            modals = _modals;
        }
        //////////////////////
        //Private functions:

        function activate() {
            $rootScope.$on("app:logout", closeAll);
        }

        function addModal(modal) {
            _.bindAll(modal, ["hide", "isShown", "remove", "show"]);

            //override the modal's remove function
            modal.remove = createModalRemoveFn(modal);
            modal.show = createModalShowFn(modal);

            modals.push(modal);
            return modal;
        }

        function createModalRemoveFn(modal) {
            var remove = modal.remove;

            return function () {
                //remove the modal from the array and then remove from the DOM
                return remove().then(_.partial(_.remove, modals, modal));
            };
        }

        function createModalShowFn(modal) {
            var show = modal.show;

            return function () {
                //fix for issue where keyboard doesn't close when modal is shown
                return show().then($cordovaKeyboard.close);
            };
        }
    }

    angular
        .module("app.shared.widgets")
        .factory("Modal", Modal);
})();
