define(['jquery', 'underscore.extend', 'backbone.extend', 'backbone.stickit.extend','utils', 'moment','views/headerView','text!templates/jqmPage.html', 'text!templates/fotos/fotoItem.html', 'jqm'],
	function($, _, Backbone, stickit, utils, moment, Header, jqmPageTpl, fotoTpl) {

	var FotoItemView = Backbone.View.extend({
			initialize:function () {
				this.template = _.template(fotoTpl);
			},
			render:function (eventName) {
				$(this.el).html(this.template({photo: this.model.toJSON() })).i18n();
				return this;
			}
		});
	return FotoItemView;
});