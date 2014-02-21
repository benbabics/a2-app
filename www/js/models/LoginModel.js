define(["backbone", "utils"],
    function (Backbone, utils) {

        "use strict";


        var LoginModel;
        LoginModel = (function (_super) {

            /***********************************************************************
             * Private Methods
             ***********************************************************************/



            /***********************************************************************
             * Constructor
             ***********************************************************************/
            utils.extend(LoginModel, _super);

            function LoginModel() {
                LoginModel.__super__.constructor.apply(this, arguments);
            }

            LoginModel.prototype.defaults = {
            };

            LoginModel.prototype.initialize = function (attrs, options) {
            };


            /***********************************************************************
             * Public Methods
             ***********************************************************************/


            return LoginModel;

        })(Backbone.Model);


        return LoginModel;
    });
