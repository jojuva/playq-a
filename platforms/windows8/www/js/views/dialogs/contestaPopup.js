define(['jquery', 'underscore.extend', 'backbone.extend', 'text!templates/dialogs/contestaPopup.html', 'jqm'],
	function($, _, Backbone, contestaPopupTpl) {

	var ContestaPopup = Backbone.View.extend({

		tagName: "div",
		className: "popup",
		taskid: "",

		initialize: function (progress) {
			this.template = _.template(contestaPopupTpl);
			this.$el.attr("data-role", "popup");
			this.$el.attr("data-dismissible", "true");
			this.$el.attr("data-overlay-theme", "popup");
			this.$el.attr("data-history", "false");
			this.taskid = "";
			$(this.el).bind("repintar_contesta", this.render, this);
		},

		render:function (eventName) {
			$(this.el).html(this.template({operatorName: window.localStorage.getItem(LS_NOM_OPERATOR)})).i18n();
			$(this.el).trigger('create');
			return this;
		},

		events: {
			"click #ejecutada-popup-contesta-btn" : "ejecutadaAction",
			"click #no-ejecutada-popup-contesta-btn" : "noEjecutadaAction",
			"click #progress-popup-contesta-btn" : "progressAction"
		},

		openPopup: function (taskid, progress) {
			$.mobile.loading('hide');
			this.taskid = taskid;
			
			if(!_.isUndefined(progress)){
				$('#progress-btn', this.el).show();
			}else{
				$('#progress-btn', this.el).hide();
			}
			$(this.el).popup("open", { transition:"none", positionTo: "window" });
			
		},

		closePopup: function () {
			$(this.el).popup("close");
		},

		ejecutadaAction: function (event) {
			this.closePopup();
			$.mobile.loading('show', {text: $.t("loading.message"), textVisible: true, html: "", theme: "f"});
			app.navigate('contestaEjecutada/'+this.taskid+'/'+TASKSTATUS.EXECUTIVE, true);
		},

		noEjecutadaAction: function (event) {
			this.closePopup();
			$.mobile.loading('show', {text: $.t("loading.message"), textVisible: true, html: "", theme: "f"});
			app.navigate('contestaNoEjecutada/'+this.taskid, true);
		},

		progressAction: function (event) {
			this.closePopup();
			$.mobile.loading('show', {text: $.t("loading.message"), textVisible: true, html: "", theme: "f"});
			app.navigate('contestaEjecutada/'+this.taskid+'/'+TASKSTATUS.PROGRESS, true);
		}
	});

	return ContestaPopup;
});