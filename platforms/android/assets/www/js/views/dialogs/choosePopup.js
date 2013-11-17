define(['jquery', 'underscore.extend', 'backbone.extend', 'text!templates/dialogs/choosePopup.html', 'jqm'],
    function($, _, Backbone, choosePopupTpl) {

    var ConfirmationPopup = Backbone.View.extend({

        tagName: "div",
        firstCallback: null,
        secondCallback: null,

        initialize: function () {
            this.template = _.template(choosePopupTpl);
            this.$el.attr("data-role", "popup");
            this.$el.attr("class", "choose-popup");
            this.$el.attr("data-overlay-theme", "popup");
            this.$el.attr("data-dismissible", "false");
            this.$el.attr("data-history", "false");
        },

        render:function (eventName) {
            $(this.el).html(this.template({})).i18n();
            return this;
        },

        events: {
            "click #first-popup-btn" : "firstAction",
            "click #second-popup-btn" : "secondAction"
        },

        openPopup: function (title, text, option1, option2, action1, action2) {
            this.firstCallback = action1;
            this.secondCallback = action2;
            $('.ui-header h1', this.el).text($.t(title));
            $('.popup-text', this.el).text($.t(text));
            $('#first-popup-btn .ui-btn-text', this.el).text($.t(option1));
            $('#second-popup-btn .ui-btn-text', this.el).text($.t(option2));
            $(this.el).popup("open", { transition:"none", positionTo: "window" });
        },

        closePopup: function () {
            $(this.el).popup("close");
        },

        secondAction: function (event) {
            this.closePopup();
            if (!_.isNull(this.secondCallback)) {
                $.mobile.loading('show', {text: $.t("loading.message"), textVisible: true, html: "", theme: "f"});
                this.secondCallback();
                this.secondCallback = null;
            }
        },

        firstAction: function (event) {
            this.closePopup();
            if (!_.isNull(this.firstCallback)) {
                $.mobile.loading('show', {text: $.t("loading.message"), textVisible: true, html: "", theme: "f"});
                this.firstCallback();
                this.firstCallback = null;
            }
        }

    });
 return ConfirmationPopup;
});