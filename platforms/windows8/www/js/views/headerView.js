define(['jquery', 'underscore', 'backbone.extend', 'app-config', 'views/dialogs/confirmationPopup', 'text!templates/header.html', 'text!templates/dialogs/headerMenuList.html', 'jqm'],
    function($, _, Backbone, AppConf, ConfirmationPopup, headerTpl, headerMenuListTpl) {

var HeaderMenuListPopup = Backbone.View.extend({

    menuBtns: null,
    confirmationPopup: null,
    className: "header-menu-list",
    id: "header-menu-list",

    initialize: function () {
        this.template = _.template(headerMenuListTpl);
        this.$el.attr("data-role", "popup");
        this.$el.attr("data-dismissible", "true");
        this.$el.attr("data-overlay-theme", "popup");
        this.$el.attr("data-theme", "f");
        this.menuBtns = this.options.menuBtns;
        this.confirmationPopup = this.options.confirmationPopup;
        $(this.el).on("popupafteropen", function (event, ui) {
            var position = $(event.currentTarget).parent('.ui-popup-container').position();
            $(event.currentTarget).parent('.ui-popup-container').offset({top: position.top + 20, left: position.left + 10 });
        });
    },

    render:function (eventName) {
        $(this.el).html(this.template({ menuBtns: this.menuBtns })).i18n();
        return this;
    },

    events:{
        "click a.button-optionList" : "btnListAction"
    },

    closePopup: function () {
        $(this.el).popup("close");
    },

    openPopup: function () {
        $(this.el).popup("close");
        $(this.el).popup("open", { transition:"none", positionTo: "#menuBtn" });
    },

    btnListAction: function (event) {
        this.closePopup();

        if (_.isUndefined(idBtn = event.currentTarget.id))
            return;

        var btn = _.findWhere(this.menuBtns, {id: idBtn}),
            self = this;

        if ($('#list-' + btn.id, this.el).hasClass("disabled"))
            return;

        if (btn.confirmation === true) {
            var msg = (!_.isUndefined(btn.confirmMsg)) ? btn.confirmMsg : 'dialog.backMsg';
            this.confirmationPopup.openPopup('dialog.backTitle', msg, function() {
                self._doAction(btn);
            });
        } else {
            self._doAction(btn);
        }
    },

    _doAction: function(btn) {
        if (!_.isUndefined(btn.url)) {
            $.mobile.loading('show', {text: $.t("loading.message"), textVisible: true, html: "", theme: "f"});
            app.navigate(btn.url, true);
        } else if (!_.isUndefined(btn.action)) {
            btn.action(event);
        }
    },

    disableMenuOpt: function(btns){
        _.each(btns, function (btn) {
            $('#list-'+btn, this.el).addClass('disabled');
        }, this);
    },
    enableMenuOpt: function(btns){
        _.each(btns, function (btn) {
            $('#list-'+btn, this.el).removeClass('disabled');
        }, this);
    }
});


var Header = Backbone.View.extend({

    title: null,
    subviews: {},
    showBackBtn: true,
    confirmBackBtn: false,
    showMenuListBtn: true,
    showUserInfo: true,
    headerExtraBtns: null,

	initialize:function () {
        this.template = _.template(headerTpl);
        this.title = this.options.title;
        this.idPage = this.options.idPage;
        this.showBackBtn = (!_.isUndefined(this.options.showBackBtn)) ? this.options.showBackBtn : true;
        this.confirmBackBtn = (!_.isUndefined(this.options.confirmBackBtn)) ? this.options.confirmBackBtn : false;
        this.showMenuListBtn = (!_.isUndefined(this.options.showMenuListBtn)) ? this.options.showMenuListBtn : true;
        this.showUserInfo = (!_.isUndefined(this.options.showUserInfo)) ? this.options.showUserInfo : true;
        this.headerExtraBtns = this.options.headerExtraBtns;

        this.subviews.confirmationPopup = new ConfirmationPopup();
        this.subviews.menuListPopup = new HeaderMenuListPopup({
			menuBtns: this.options.menuBtns,
            confirmationPopup: this.subviews.confirmationPopup
		});
    },

	render:function (eventName) {
        var aliasTM = "", operatorName = "";
        if (this.showUserInfo === true) {
            if (window.localStorage.getItem(LS_IS_ADMIN) === "1") {
                aliasTM = $.t('login.admin');
            } else {
                aliasTM = window.localStorage.getItem(LS_ALIASTM);
                operatorName = window.localStorage.getItem(LS_NOM_OPERATOR);
            }
        }

        $(this.el).html(this.template({
            title: this.title,
            showBackBtn: this.showBackBtn,
            showMenuListBtn: this.showMenuListBtn,
            aliasTM: (!_.isUndefined(aliasTM)) ? aliasTM : " ",
            operatorName: (!_.isUndefined(operatorName)) ? operatorName : " ",
            syncroAlert: (!_.isUndefined(val = window.localStorage.getItem(LS_SYNC_PENDENT))) ? val : "false",
            msgAlert: (!_.isUndefined(val = window.localStorage.getItem(LS_MSG_SYNC_PENDENT))) ? val : $.t('alerts.syncroPendent'),
            headerExtraBtns: this.headerExtraBtns
        })).i18n();
        this.renderSubviews();
        return this;
    },
    renderSubviews: function () {
       this.$el.append(this.subviews.menuListPopup.render().el);
       this.$el.append(this.subviews.confirmationPopup.render().el);
    },
    events:{
        "orientationchange" : "orientationchange",
        "click #menuBtn" : "menuAction",
        "vclick #menuBtn" : "menuAction",
        "click #backBtn" : "backBtnAction",
        "vclick #backBtn" : "backBtnAction",
        "click .btn-extra" : "extraBtnAction",
        "vclick .btn-extra" : "extraBtnAction"
    },

    orientationchange: function () {
        this.subviews.menuListPopup.closePopup();
    },

    menuAction: function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.subviews.menuListPopup.openPopup();
    },

    backBtnAction: function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (this.confirmBackBtn === true) {
            this.subviews.confirmationPopup.openPopup('dialog.backTitle', 'dialog.backMsg', function() {
                app.back();
            });
        } else {
            app.back();
        }
    },

    extraBtnAction: function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (_.isUndefined(idBtn = event.currentTarget.id))
            return;

        var btn = _.findWhere(this.headerExtraBtns, {id: idBtn});

        if ($('#' + btn.id, this.el).hasClass("disabled"))
            return;

        if (!_.isUndefined(btn.url)) {
            $.mobile.loading('show', {text: $.t("loading.message"), textVisible: true, html: "", theme: "f"});
            app.navigate(btn.url, true);
        } else if (!_.isUndefined(btn.action)) {
                btn.action(event);
        }
    },

    showMsgSincro: function (message) {
        var $changesMsg = $('#changesMsg', this.el);

        message = (!_.isUndefined(message)) ? message : $.t('alerts.syncroPendent');
        $changesMsg.find('#changes-text').text(message);

        if ($changesMsg.is(':visible'))
            return;

        $changesMsg.show();
        var headerHeight = $('.ui-header').height();
        $('.ui-page').css('padding-top', headerHeight).height($('.ui-page').height() - headerHeight);
    },

    hideMsgSincro: function () {
        if ($('#changesMsg', this.el).is(':not(:visible)'))
            return;
        $('#changesMsg', this.el).hide();
        var headerHeight = $('.ui-header').height();
        $('.ui-page').css('padding-top', headerHeight).height($('.ui-page').height() + headerHeight);
    },

    disableBtn: function(btns, menuOptBtns, create){
        if (!_.isUndefined(btns)) {
            _.each(btns, function (btn) {
                $('#'+btn, this.el).addClass('disabled');
            }, this);
        }
        if (!_.isUndefined(menuOptBtns)) {
            this.subviews.menuListPopup.disableMenuOpt(menuOptBtns);
        }
        if (create !== false) {
            $(this.el).trigger('create');
        }
    },

    enbleBtn: function(btns, menuOptBtns, create){
        if (!_.isUndefined(btns)) {
            _.each(btns, function (btn) {
                $('#'+btn, this.el).removeClass('disabled');
            }, this);
        }
        if (!_.isUndefined(menuOptBtns)) {
            this.subviews.menuListPopup.enableMenuOpt(menuOptBtns);
        }
        if (create !== false) {
            $(this.el).trigger('create');
        }
    }

});
return Header;

});