define(["facade", "utils", "controllers/BaseController", "models/CompanyModel", "models/UserModel",
        "views/HierarchyListView"],
    function (facade, utils, BaseController, CompanyModel, UserModel, HierarchyListView) {

        "use strict";


        var HierarchyController,
            classOptions = {
                ctorName: "construct" // constructor name
            };

        HierarchyController = BaseController.extend({
            hierarchyListView: null,
            userModel: null,

            construct: function () {
            },

            init: function () {
                this.userModel = UserModel.getInstance();

                // create view
                this.hierarchyListView = new HierarchyListView({
                    collection: this.userModel.get("hierarchies"),
                    userModel : this.userModel
                });

                // listen for events
                this.hierarchyListView.on("hierarchySelected", this.hierarchySelected, this);
            },

            navigate: function () {
                this.hierarchyListView.setModel(null);
                this.hierarchyListView.setCollection(this.userModel.get("hierarchies"));
                this.hierarchyListView.render();
                utils.changePage(this.hierarchyListView.$el, null, null, true);
            },

            hierarchySelected: function (accountId) {
                var company = new CompanyModel(),
                    self = this;

                company.set("accountId", accountId);

                this.hierarchyListView.showLoadingIndicator();

                utils.when(this.fetchModel(company))
                    .always(function () {
                        self.hierarchyListView.hideLoadingIndicator();
                    })
                    .done(function () {
                        self.userModel.set("selectedCompany", company);

                        // once the user successfully selected a hierarchy navigate to the Home page
                        facade.publish("home", "navigate");
                    });
            }
        }, classOptions);


        return new HierarchyController();
    });