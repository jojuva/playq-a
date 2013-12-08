define(['jquery', 'underscore', 'backbone.extend', 'views/headerView', 'text!templates/jqmPage.html', 'text!templates/question.html', 'jqm'],
	function($, _, Backbone, Header, jqmPageTpl, questionTpl) {

	var Question = Backbone.View.extend({

		initialize:function () {
			console.log(this.model);
			console.log(this.collection);
			this.template = _.template(questionTpl);
			this.questionData = {
				questionA: 'pregunta',
				answera: 'A',
				answerb: 'B',
				answerc: 'C',
				answerd: 'D'
			};
			
		},
		
		render:function (eventName) {
			this.updateQuestionData();
			$(this.el).html(this.template(this.questionData)).i18n();
			return this;
		},

		updateQuestionData: function() {
			console.log("updateQuestionData");
			this.questionData.questionA = this.model.get('description');
			this.questionData.answera = this.model.get('answers').key;
			//this.questionData.answerb = this.model.get('answers').get('className');
			//this.questionData.answerc = this.model.get('answers')[2].get('description');
			//this.questionData.answerd = this.model.get('answers')[3].get('description');
		},

		events: {
			"click #answera_btn": "doAnswer",
			"click #answerb_btn": "doAnswer",
			"click #answerc_btn": "doAnswer",
			"click #answerd_btn": "doAnswer"
		},

		doAnswer: function() {
			app.navigate('askClue', true);
		},	
		
	});

	var QuestionPage = Backbone.View.extend({
		idPage: ID_PAGE.QUESTION,
		subviews: {},

		initialize:function () {
			console.log('QuestionPage-ini');
			this.template = _.template(jqmPageTpl);
		},

		render:function (eventName) {
			console.log('QuestionPage-render');
			$(this.el).html(this.template({headerFixed: true}));

			this.subviews.headerView = new Header({
				el: $('#page-header', this.el),
				title: 'question.title',
				idPage: this.idPage,
				showBackBtn: true,
				showUserInfo: false,
				showMenuListBtn: false
			}).render();

			this.subviews.menuView = new Question({
				el: $('#page-content', this.el),
				model: this.options[0],
				collection: this.options[1]
			}).render();

			return this;
		}
	});

	return QuestionPage;

});