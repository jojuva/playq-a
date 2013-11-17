define(['jquery', 'underscore', 'backbone.extend', 'views/headerView', 'text!templates/jqmPage.html', 'text!templates/question.html', 'jqm'],
	function($, _, Backbone, Header, jqmPageTpl, questionTpl) {

	var Question = Backbone.View.extend({

		initialize:function () {
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
		}
	});

	var QuestionPage = Backbone.View.extend({
		idPage: ID_PAGE.QUESTION,
		subviews: {},

		initialize:function () {
			//var data = {};
			this.template = _.template(jqmPageTpl);
			//this.template = '';
		},

		render:function (eventName) {
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
				collection: this.options.taskCollections
			}).render();

			return this;
		},
		
		events: {
			"click #answera_btn": "doAnswer",
			"click #answerb_btn": "doAnswer",
			"click #answerc_btn": "doAnswer",
			"click #answerd_btn": "doAnswer"
		},

		doAnswer: function() {
			app.navigate('askClue', true);
		}
		
	});

	return QuestionPage;

});