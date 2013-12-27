define(['jquery', 'underscore.extend', 'backbone.extend', 'text!templates/dialogs/confirmationPopup.html', 'jqm'],
    function($, _, Backbone, confirmPopupTpl) {

    var ConfirmationPopup = Backbone.View.extend({

        tagName: "div",
        successCallback: null,

        initialize: function () {
            this.template = _.template(confirmPopupTpl);
            this.$el.attr("data-role", "popup");
            this.$el.attr("class", "confirm-popup");
            this.$el.attr("data-overlay-theme", "popup");
            this.$el.attr("data-dismissible", "false");
            this.$el.attr("data-history", "false");
        },

        render:function (eventName) {
            $(this.el).html(this.template({})).i18n();
            return this;
        },

        events: {
            "click #cancel-popup-confirmation" : "cancelAction",
            "click #accept-popup-confirmation" : "acceptAction"
        },

        openPopup: function (title, text, action) {
            this.successCallback = action;
            $('.ui-header h1', this.el).text($.t(title));
            $('.popup-text', this.el).text($.t(text));
            $(this.el).popup("open", { transition:"none", positionTo: "window" });
        },

        closePopup: function () {
            $(this.el).popup("close");
        },

        cancelAction: function (event) {
            this.closePopup();
        },

        acceptAction: function (event) {
            this.closePopup();
            if (!_.isNull(this.successCallback)) {
                $.mobile.loading('show', {text: $.t("loading.message"), textVisible: true, html: "", theme: "f"});
                this.successCallback();
                this.successCallback = null;
            }
        }

    });
 return ConfirmationPopup;
});