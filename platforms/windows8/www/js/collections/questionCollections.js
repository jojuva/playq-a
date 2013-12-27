define(['underscore', 'parse', 'models/Question', 'sync/dao/QuestionDAO'], 
  function(_, Parse, Question, QuestionDAO){
	var QuestionCollection = Parse.Collection.extend({
		model: Question,
		dao: QuestionDAO,
		
		comparator: function(model) {
			return model.get('name');
		}
		
	});
	return QuestionCollection;
});