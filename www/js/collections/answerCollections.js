define(['underscore', 'parse', 'models/Answer', 'sync/dao/answerDAO'], 
  function(_, Parse, Answer, AnswerDAO){
	var AnswerCollection = Parse.Collection.extend({
		model: Answer,
		dao: AnswerDAO,
		
		comparator: function(model) {
			return model.get('name');
		},
		
		findByQuestion: function(question, callbacks) {
			var self = this;
			console.log('findByQuestionCol');
			new this.dao(window.db).findByQuestion(question, {
				success: function (objects, error) {
					if (!_.isUndefined(error)) {
							callbacks.error(error);
						return;
					}
					console.log("answers:"+objects);
					self.add(objects);
					if (callbacks.success) callbacks.success();
				},
				error: callbacks.error
			});
		}		
		
	});
	
	
	return AnswerCollection;
});