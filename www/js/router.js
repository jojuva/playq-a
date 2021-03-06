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
		"question/:cat/:num" : "question",
		"wait" : "wait",
		"statistics" : "statistics",
		"top10" : "top10",
		"askClue" : "askClue",
		"answerClue" : "answerClue",
		"clueResult" : "clueResult",
		"guess" : "guess",
		"end/:result" : "end",
		"exitApp" : "exitApp",
		"idioma/:lng" : "changeLang"
    },

	currentPage: null,
	dataForView: {},

    initialize:function () {
    	console.log('INI-ROUTER');
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
		var currentUser = Parse.User.current();
		var stayLogged = window.localStorage.getItem(LS_STAY_LOGGED);
		if (currentUser && stayLogged=='true') {
		    app.navigate('menu',true);
		}else{
			this.changePage(new LoginPage());
		}		
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
			self.before(ID_PAGE.MENU, {
				success: function () {
					console.log('changePage-menuPage');
					self.changePage( new MenuPage(self.dataForView));
				},
				error: function (error) {
					execError(error, 'router: menu');
				}
			});	
		});
	},
    /* pagina question */
	question: function (cat, num) {
		var self = this;
		require(["views/questionPage"], function(QuestionPage){
			self.before(ID_PAGE.QUESTION, {
				success: function () {
					console.log('changePage-QuestionPage');
					self.changePage( new QuestionPage(self.dataForView));
				},
				error: function (error) {
					execError(error, 'router: question; objectId: '+cat);
				}
			},{
				objectId: cat,
				numQuestions: num
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
			self.before(ID_PAGE.STATISTICS, {
				success: function () {
					console.log('changePage-StatisticsPage');
					//console.log('d4:'+self.dataForView.toSource());
					self.changePage( new StatisticsPage(self.dataForView));
				},
				error: function (error) {
					execError(error, 'router: statistics');
				}
			});		
		});
	},
    /* pagina top10 */
	top10: function () {
		var self = this;
		require(["views/top10Page"], function(Top10Page){
			self.before(ID_PAGE.TOP10, {
				success: function () {
					console.log('changePage-Top10Page');
					self.changePage( new Top10Page(self.dataForView));
				},
				error: function (error) {
					execError(error, 'router: top10');
				}
			});	
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
	end: function (result) {
		var self = this;
		require(["views/endPage"], function(EndPage){
			self.changePage( new EndPage({result: result}));
		});
	},

    exitApp: function () {
    	Parse.User.logOut();
		navigator.app.exitApp();
	},

    changePage:function (page) {
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
			case ID_PAGE.LOGIN:
				console.log('before-login');
				break;
			case ID_PAGE.MENU:
				console.log('before-menu');
				require(["collections/categoryCollections"],
						function(CategoryCollection){
							dataForView.categoryCollections = new CategoryCollection();
							dataForView.categoryCollections.fetch(callbacks);
						});
				break;
			case ID_PAGE.QUESTION:
				console.log('before-question');
				require(["models/question","collections/answerCollections"],
				function(Question, AnswerCollection){
					console.log(initData.objectId);
					dataForView.numQuestions = initData.numQuestions;
					dataForView.question = new Question();
					dataForView.question.getRandomByCategory(initData.objectId,{
						success: function () { 
							console.log("q2:"+dataForView.question.id);
							dataForView.answerCollections = new AnswerCollection();
							dataForView.answerCollections.findByQuestion(dataForView.question,callbacks);
						},
						error: function (error) { 
							if(error=='no more questions for this category'){
								console.log('no more questions for this category');
								app.navigate('end/'+CODE_ERROR.OK, true);
							}else{
								callbacks.error();
							}
						}
					});

				});
				break;
			case ID_PAGE.STATISTICS:
				console.log('before-statistics');
				require(["models/statistic"],
				function(Statistic){
					dataForView.statistic = new Statistic();
					dataForView.statistic.getMyStatistic(callbacks);
				});
				break;			
			case ID_PAGE.TOP10:
				console.log('before-top10');
				require(["collections/rankingCollections"],
				function(RankingCollection){
					dataForView.rankingCollections = new RankingCollection();
					dataForView.rankingCollections.getTop10(callbacks);
				});
				break;
			default:
				break;
		}
    }
	
});
	return AppRouter;

});