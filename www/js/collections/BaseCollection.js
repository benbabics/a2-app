define([ "backbone" ],
    function (Backbone) {

        "use strict";

        var BaseCollection = Backbone.Collection.extend({
            toJSON: function () {
                var json = null,
                    index = 0;

                if (this.length > 0) {
                    json = [];
                    this.each(function (model) {
                        json[index] = model.toJSON();
                        index++;
                    }, this);
                }

                return json;
            }
        });

        return BaseCollection;
    });
