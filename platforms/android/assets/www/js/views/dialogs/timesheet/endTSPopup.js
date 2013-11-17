define(['jquery', 'underscore.extend', 'backbone.extend', 'text!templates/dialogs/endTSPopup.html', 'jqm'],
    function($, _, Backbone, endTSPopupTpl) {

    var EndTSPopup = Backbone.View.extend({

        tagName: "div",
        successCallback: null,

        initialize: function () {
            this.template = _.template(endTSPopupTpl);
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
            "click #finalizar_ko" : "cancelAction",
            "click #finalizar_ok" : "acceptAction"
        },

        openPopup: function (title, missatge, action) {
            this.successCallback = action;
            $('.ui-header h1', this.el).text($.t(title));
            $('#popup-text', this.el).text(missatge);
            $(this.el).popup("open", { transition:"none", positionTo: "window" });
        },

        closePopup: function () {
            $(this.el).popup("close");
        },

        cancelAction: function (event) {
            this.closePopup();
            this.successCallback(TIMESHEETSTATUS.ABIERTO);
            this.successCallback = null;
        },

        acceptAction: function (event) {
            this.closePopup();
            if (!_.isNull(this.successCallback)) {
                $.mobile.loading('show', {text: $.t("loading.message"), textVisible: true, html: "", theme: "f"});
                this.successCallback(TIMESHEETSTATUS.FINALIZADO);
                this.successCallback = null;
            }
        }

    });
    return EndTSPopup;
});