define(['require', "jquery", "underscore.extend", "backbone.extend", "i18n", "views/login", "jqm", "utils"],
	function(require, $, _, Backbone, i18n, LoginPage) {

var AppRouter = Backbone.Router.extend({

    routes:{
		"":"login",
		"login":"login",
		"login/:sessionExp" : "login",
		"signup" : "signup",
		"menu" : "menu",
		"question/:cat" : "question",
		"wait" : "wait",
		"statistics" : "statistics",
		"top10" : "top10",
		"askClue" : "askClue",
		"answerClue" : "answerClue",
		"clueResult" : "clueResult",
		"guess" : "guess",
		"end" : "end",
		"exitApp" : "exitApp",
		"idioma/:lng" : "changeLang"
    },

	currentPage: null,
	dataForView: {},

    initialize:function () {
		window.location.hash = '';
        this.firstPage = true;
    },
    changeLang: function(lang){
		var self = this;
		lang = (!_.isUndefined(lang)) ? lang : DEFAULT_LANG;

		i18n.setLng(lang, function(t) {
			window.localStorage.setItem(LS_LANG, lang);
			self.changePage(new LoginPage());
		});
    },
    /* pagina login */
	login:function (sessionExp) {
		// netejar variables a LS del Usuari
		//new LoginUtils().logout();
		this.changePage(new LoginPage({
			sessionExp: (sessionExp === 'true')
		}));
	},
    /* pagina signup */
	signup: function () {
		var self = this;
		require(["views/signupPage"], function(SignUpPage){
			self.changePage( new SignUpPage());
		});
	},
    /* pagina menu */
	menu: function () {
		var self = this;
		require(["views/menuPage"], function(MenuPage){
			self.changePage( new MenuPage());
		});
	},
    /* pagina question */
	question: function (cat) {
		var self = this;
		require(["views/questionPage"], function(QuestionPage){
			self.before(ID_PAGE.QUESTION, {
				success: function () {
					console.log('changePage-QuestionPage');
					self.changePage( new QuestionPage(self.dataForView));
				},
				error: function () {
					console.log('error-questionPage');
					execError(ERROR.ERROR_LOAD_PAGE_DATA, 'router: detalleTarea; objectId: '+cat);
				}
			},{
				objectId: cat
			});
		});
	},
    /* pagina wait */
	wait: function () {
		var self = this;
		require(["views/waitPage"], function(WaitPage){
			self.changePage( new WaitPage());
		});
	},
    /* pagina statistics */
	statistics: function () {
		var self = this;
		require(["views/statisticsPage"], function(StatisticsPage){
			self.changePage( new StatisticsPage());
		});
	},
    /* pagina top10 */
	top10: function () {
		var self = this;
		require(["views/top10Page"], function(Top10Page){
			self.changePage( new Top10Page());
		});
	},
    /* pagina askClue */
	askClue: function () {
		var self = this;
		require(["views/askCluePage"], function(AskCluePage){
			self.changePage( new AskCluePage());
		});
	},
    /* pagina answerClue */
	answerClue: function () {
		var self = this;
		require(["views/answerCluePage"], function(AnswerCluePage){
			self.changePage( new AnswerCluePage());
		});
	},
    /* pagina clueResult */
	clueResult: function () {
		var self = this;
		require(["views/clueResultPage"], function(ClueResultPage){
			self.changePage( new ClueResultPage());
		});
	},
    /* pagina guess */
	guess: function () {
		var self = this;
		require(["views/guessPage"], function(GuessPage){
			self.changePage( new GuessPage());
		});
	},
    /* pagina end */
	end: function () {
		var self = this;
		require(["views/endPage"], function(EndPage){
			self.changePage( new EndPage());
		});
	},

    exitApp: function () {
		navigator.app.exitApp();
	},

    changePage:function (page, isSplitView) {
		if (this.currentPage)
		this.currentPage.close();
		this.currentPage = page;

		page.$el.attr({'data-role': 'page', 'data-theme': 'f'});
        page.render();
        $('body').append(page.$el);
        var transition = $.mobile.defaultPageTransition;
        // We don't want to slide the first page
        if (this.firstPage) {
            transition = 'none';
            this.firstPage = false;
        }
        $.mobile.changePage($(page.el), {changeHash:false, transition: transition});
    },

    back: function () {
		$.mobile.loading('show', {text: $.t("loading.message"), textVisible: true, html: "", theme: "f"});
		window.history.back();
    },

    before: function (idPage, callbacks, initData) {
		var dataForView = this.dataForView,
			dataKeys = [],
			self = this,

			fetchCollections = function(n) {
				if (dataKeys.length === n) {
					callbacks.success();
					return;
				}

				var attr = dataKeys[n];
				
				collection_path = 'collections/';

				if (_.isUndefined(dataForView[attr])) {
					dataForView[attr] = new (require(collection_path + attr))();
				}

				if (dataForView[attr].size() === 0) {
					dataForView[attr].fetch({
						error: function () { callbacks.error(); },
						success: function() { fetchCollections(n+1); }
					});
				} else {
					fetchCollections(n+1);
				}
			};

		_(this.dataForView).removeAll();

		switch (idPage) {
			case ID_PAGE.QUESTION:
				require(["models/question","collections/answerCollections"],
				function(Question, AnswerCollection){
					console.log(initData.objectId);
					dataForView[0] = new Question();
					dataForView[0].getRandomByCategory(initData.objectId,callbacks);
					console.log('q:'+dataForView[0]);					
					console.log('before-questionPage-end');
				});
				break;

			default:
				break;
		}
    }
	
});
	return AppRouter;

});