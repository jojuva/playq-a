define(['underscore', 'parse', 'sync/dao/answerDAO'], 
  function(_, Parse, AnswerDAO){
	var Answer = Parse.Object.extend({
		className: 'Answer',
		dao: AnswerDAO,
		idAttribute: 'objectId',

		defaults: {
			objectId: null,
			name: null,
			description: null,
			correct: null,
			createdAt: null,
			updatedAt: null,
			ACL: null
		},

		initialize: function() {
		},

		validation: {
			objectId: { required: true, msg: 'error.obligatorios' },
			name: { required: true, msg: 'error.obligatorios' },
			description: { required: true, msg: 'error.obligatorios' }
		}

	});
	return Answer;
});