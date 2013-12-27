define(['jquery', 'underscore.extend', 'backbone.extend', 'text!templates/dialogs/alertPopup.html', 'jqm'],
	function($, _, Backbone, alertPopupTpl) {

	var AlertPopup = Backbone.View.extend({

		tagName: "div",
		className: "alert-popup",
        successCallback: null,

		initialize: function () {
			this.template = _.template(alertPopupTpl);
			this.$el.attr("data-role", "popup");
			this.$el.attr("class", "confirm-popup");
			this.$el.attr("data-overlay-theme", "popup");
			this.$el.attr("data-dismissible", "false");
			this.$el.attr("data-history", "false");
		},

		render:function (eventName) {
			$(this.el).html(this.template()).i18n();
			return this;
		},

		events: {
			"click #accept-popup-alert-btn" : "acceptAction"
		},

		openPopup: function (title, text, redirect) {
			this.successCallback = redirect;
			$.mobile.loading('hide');
			$('.ui-header h1', this.el).text($.t(title));
			if (_.isString(text)) {
				$('#messageText', this.el).text($.t(text));
			} else if(_.isObject(text)) {
				$('#messageText', this.el).text($.t(text.text, {param: text.param}));
			}

			$(this.el).popup("open", { transition:"none", positionTo: "window" });
		},

		closePopup: function () {
			$(this.el).popup("close");
			if (!_.isNull(this.successCallback) && !_.isUndefined(this.successCallback)) {
                $.mobile.loading('show', {text: $.t("loading.message"), textVisible: true, html: "", theme: "f"});
                this.successCallback();
                this.successCallback = null;
            }
		},

		acceptAction: function (event) {
			this.closePopup();
		}
    });
    return AlertPopup;
});