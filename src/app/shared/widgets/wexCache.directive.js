(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Directive above the scroll

    /* @ngInject */
    function wexCache(_, $compile, $injector, $rootScope, $state, WexCache) {
        var loadingIndicatorTemplate = "<ion-spinner icon='lines' class='wex-cache-icon-loading'></ion-spinner>",
            bufferMap = new Map();

        var directive = {
            restrict: "A",
            require : "?ngModel",
            compile : compile
        };

        return directive;
        ////////////////////
        //Public functions:

        function compile(elem, attrs) {
            //create the content element buffer
            var contentBuffer = document.createElement("div");
            bufferMap.set(elem[0], contentBuffer);

            //put the element's content in a buffer until the cached value is loaded
            transferContent(elem[0], contentBuffer);

            return {pre: link};
        }

        function link(scope, elem, attrs, ngModel) {
            var hasModel = !_.isNil(ngModel),
                loadingIndicator = createLoadingIndicator(),
                readCachedValue = function () {
                    var cacheKey = attrs.wexCache || attrs.ngModel,
                        isGlobalCacheProperty = !_.startsWith(cacheKey, "vm.");

                    return WexCache.readPropertyValue(cacheKey, {viewName: isGlobalCacheProperty ? null : getCurrentViewName()});
                },
                renderContent = function () {
                    var rawElem = elem[0],
                        contentBuffer;

                    if (bufferMap.has(rawElem)) {
                        contentBuffer = bufferMap.get(rawElem);

                        transferContent(contentBuffer, rawElem, scope);
                        bufferMap.delete(rawElem);
                    }
                },
                updateModel = function (value) {
                    var propertyType = attrs.ngModelType,
                        typedValue = value,
                        modelCreator = function (Model) {
                            typedValue = new Model();
                            typedValue.set(value);
                        };

                    if (!_.isNil(propertyType)) {
                        modelCreator.$inject = [propertyType];

                        //instantiate the model to the given type
                        $injector.invoke(modelCreator);
                    }

                    //write the value to the model
                    ngModel.$modelValue = typedValue;
                    ngModel.$$writeModelToScope();
                };

            scope.$watch(readCachedValue, function (value) {
                if (_.isNil(value)) {
                    //value is not cached, so trigger the loading indicator
                    if (loadingIndicator) {
                        elem.append(loadingIndicator);
                    }
                }
                else {
                    if (hasModel) {
                        //cached value changed so update the model
                        updateModel(value);
                    }

                    if (loadingIndicator) {
                        loadingIndicator.remove();
                        loadingIndicator = null;
                    }

                    //restore the content from the buffer
                    renderContent();
                }
            });
        }
        ////////////////////
        //Private functions:
        function createLoadingIndicator() {
            return $compile(loadingIndicatorTemplate)($rootScope);
        }

        function getCurrentViewName() {
            return _.get($state, "current.name");
        }

        function transferContent(fromElement, toElement, scope) {
            while (fromElement.childNodes.length > 0) {
                var child = toElement.appendChild(fromElement.childNodes[0]);

                if (!_.isNil(scope)) {
                    $compile(child)(scope);
                }
            }
        }
    }

    angular
        .module("app.shared.widgets")
        .directive("wexCache", wexCache);
})();
