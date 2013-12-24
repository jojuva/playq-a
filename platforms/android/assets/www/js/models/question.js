define(['underscore', 'parse', 'sync/dao/questionDAO', 'collections/answerCollections'], 
  function(_, Parse, QuestionDAO, AnswerCollection){
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
			createdAt: null,
			updatedAt: null
		},

		initialize: function() {
		},

		validation: {
			objectId: { required: true, msg: 'error.obligatorios' },
			name: { required: true, msg: 'error.obligatorios' },
			description: { required: true, msg: 'error.obligatorios' }
		},
		
		getRandomByCategory: function(catId, callbacks) {
			var self = this;

			new this.dao(window.db).findByCategory(catId, {
				success: function (objects, error) {
					if (!_.isUndefined(error)) {
							callbacks.error(error);
						return;
					}
					var pos = _.random(objects.length-1);
					var object = objects[pos];
					console.log("question:"+object.id);
					/*var query=object.relation("answers").query();
					callbacks.answers = query.find({
					  success: function(answers) {
						alert("Successfully retrieved " + answers.length + " answers.");
						// Do something with the returned Parse.answer values
						object.answers = answers;
						object.respuestas = answers;
						for (var i = 0; i < answers.length; i++) { 
						  var answer = answers[i];
						  alert(answer.id + ' - ' + answer.get('description'));
						}
						return answers;
					  },
					  error: function(error) {
						alert("Error: " + error.code + " " + error.message);
					  }
					});
					console.log("answers:"+callbacks.answers);*/
					self.add(object);
					self.set({
						objectId: object.id,
						createdAt: object.createdAt,
						updatedAt: object.updatedAt
					});
					//console.log('o:'+object.toSource());
					if (callbacks.success) callbacks.success();
				},
				error: callbacks.error
			});
		}

	});
	return Question;
});