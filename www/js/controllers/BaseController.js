define(["jclass", "utils"],
    function (JClass, utils) {

        "use strict";


        var BaseController,
            classOptions = {
                ctorName: "construct" // constructor name
            };

        BaseController = JClass.extend({
            construct: function () {
            },

            /**
             * Function to fetch a collection wrapped up as a promise
             *
             * @param collection to fetch
             * @param data the information to pass to collection.fetch()
             * @returns a promise
             */
            fetchCollection: function (collection, data) {
                var deferred = utils.Deferred();

                collection
                    .once("sync",
                        function () {
                            deferred.resolve();
                        },
                        this)
                    .once("error",
                        function () {
                            deferred.reject();
                        },
                        this)
                    .fetch(data); // fetch new data with supplied params

                return deferred.promise();
            },

            /**
             * Function to fetch a model wrapped up as a promise
             *
             * @param model to fetch
             * @returns a promise
             */
            fetchModel: function (model) {
                var deferred = utils.Deferred();

                model
                    .once("sync",
                        function () {
                            deferred.resolve();
                        },
                        this)
                    .once("error",
                        function () {
                            deferred.reject();
                        },
                        this)
                    .fetch();

                return deferred.promise();
            }
        }, classOptions);


        return BaseController;
    });