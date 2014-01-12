define(['underscore', 'parse', 'models/question', 'sync/dao/questionDAO'], 
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