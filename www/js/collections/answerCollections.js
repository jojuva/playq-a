define(['underscore', 'parse', 'models/Answer', 'sync/dao/answerDAO'], 
  function(_, Parse, Answer, AnswerDAO){
	var AnswerCollection = Parse.Collection.extend({
		model: Answer,
		dao: AnswerDAO,
		
		comparator: function(model) {
			return model.get('name');
		}
		
	});
	return AnswerCollection;
});