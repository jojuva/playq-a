define(['underscore', 'parse', 'sync/dao/questionDAO'], 
  function(_, Parse, QuestionDAO){
	var Question = Parse.Object.extend({
		className: 'Question',
		dao: QuestionDAO,
		idAttribute: 'objectId',

		defaults: {
			objectId: null,
			name: null,
			description: null,
			score: null,
			categories: null,
			answers: null,
			createdAt: null
		},

		initialize: function() {
		},

		validation: {
			objectId: { required: true, msg: 'error.obligatorios' },
			name: { required: true, msg: 'error.obligatorios' },
			description: { required: true, msg: 'error.obligatorios' }
		},
		
		getCategories: function(){
			if(!_.isNull(this.get('categories'))){
				return null; //TODO findCategories;
			}else{
				return null;
			}
		},
		
		getRandomByCategory: function(catId, callbacks) {
			var self = this;

			new this.dao(window.db).findByCategory(catId, {
				success: function (Question, error) {
					if (!_.isUndefined(error)) {
							callbacks.error(error);
						return;
					}
					self.add(Question);
					if (callbacks.success) callbacks.success();
				},
				error: callbacks.error
			});
		}

	});
	return Question;
});