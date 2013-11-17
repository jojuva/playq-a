define(['underscore', 'backbone', 'sync/dao/FormDAO'], function(_, Backbone, FormDAO){
	var Form = Backbone.Model.extend({

		dao: FormDAO,
		idAttribute: 'listformid',

		defaults: {
			listformid : null,
			formid : null,
			formcode : null,
			formdescription: null,
			taskid : null,
			edited: null
		}
	});
	return Form;
});