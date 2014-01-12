define(['jquery', 'utils'],
function($){
	$(document).on("mobileinit", function () {
		checkUrlParams();
		setDefaultJQMOptions();
	});

	function checkUrlParams() {
		if (!_.isUndefined(opp = $.urlParam('opp'))) {
			window.localStorage.setItem(LS_OPPONENT, opp);
		} else if (_.isEmpty(window.localStorage.getItem(LS_OPPONENT))) {
			window.localStorage.setItem(LS_OPPONENT, "false");
		}
	}

	function setDefaultJQMOptions () {
		// backbone - jqm configuration
		$.mobile.ajaxEnabled = false;
		$.mobile.hashListeningEnabled = false;
		$.mobile.pushStateEnabled = false;
		$.mobile.linkBindingEnabled = false;
		$.mobile.buttonMarkup.hoverDelay = 0;

		$.mobile.defaultPageTransition = "none";

		//theme
		$.mobile.page.prototype.options.headerTheme = "f";
		$.mobile.page.prototype.options.contentTheme = "f";
		$.mobile.page.prototype.options.footerTheme = "f";

		// Remove page from DOM when it's being replaced
		$(document).on('pagehide', 'div[data-role="page"]', function (event, ui) {
			$(event.currentTarget).remove();
		});

		$(document).on('pageshow', 'div[data-role="page"]', function (event, ui) {
			$(event.currentTarget).trigger('updateView');
		});
	}
});


function setInitPluginLanguage () {
	$.mobile.loader.prototype.options.text = $.t("loading.message");
	$.mobile.loader.prototype.options.textVisible = true;
	$.mobile.loader.prototype.options.theme = "f";
	$.mobile.loader.prototype.options.html = "";
}

function handleBackButton (event) {
	event.preventDefault();
	event.stopPropagation();

	if (_.isUndefined(app) || (!_.isUndefined(app) && !_.isUndefined(app.currentPage))) {
		if (!_.isUndefined(idP = app.currentPage.idPage) && idP === ID_PAGE.LOGIN) {
			navigator.app.exitApp();
		} else {
			if (app.currentPage.$el.find('.ui-header #backBtn').length > 0) {
				app.back();
			}
		}
	}
	return;
}

function handleMenuButton (event) {
	event.preventDefault();
	event.stopPropagation();

	if (!_.isUndefined(headerView = app.currentPage.subviews.headerView)) {
		headerView.menuAction(event);
	}
	return;
}

function orientationHandler(event) {
	if(!_.isUndefined(window.orientation) && !_.isUndefined(window['app'])){
		// timeout because there are a resize delay
		setTimeout(function () {
			$(app.currentPage.el).trigger('orientationchange', window.orientation);
			$(".ui-header").trigger('orientationchange', window.orientation);
		}, 300);
	}
}