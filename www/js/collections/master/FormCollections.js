define(['underscore', 'backbone', 'models/master/form', 'sync/dao/master/FormDAO'], function(_, Backbone, Form, FormDAO){
	var FormCollection = Backbone.Collection.extend({
		model: Form,
		dao: FormDAO
	});
	return FormCollection;
});