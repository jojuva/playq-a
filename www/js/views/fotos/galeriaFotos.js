define(['jquery', 'underscore.extend', 'backbone.extend', 'backbone.stickit.extend','utils', 'moment','views/headerView', 'views/fotos/fotoView', 'views/dialogs/confirmationPopup','text!templates/jqmPage.html', 'text!templates/fotos/fotoList.html', 'models/internal/foto', 'collections/internal/fotoCollections', 'jqm', 'swipe'],
	function($, _, Backbone, stickit, utils, moment, Header, FotoItemView, ConfirmationPopup, jqmPageTpl, fotoListTpl, Foto, FotoCollection) {

	var FotoListView = Backbone.View.extend({
		idTask: null,
		origin: null,
		fotos: null,
		swipe: null,
		fotosPath: null,

		initialize:function () {
			this.template = _.template(fotoListTpl);
			this.idTask = this.options.idTask;
			this.origin = this.options.origin;
			this.fotos = new FotoCollection();
			this.fotos.bind('add remove reset', this.render, this);
			if(isIOS()){
				this.fotosPath = '';
			} else {
				this.fotosPath = window.localStorage.getItem(LS_FPATH);
			}
		},

		render:function () {
			$(this.el).html(this.template({})).i18n();
			this.fillGallery();
			return this;
		},

		resizeContentImg: function () {
			var imgHeight = window.innerHeight-($('.ui-header').height() + $('.bullets').height() + $('.fecha').height() + 20);
			$('.img', this.el).height(imgHeight);
		},

		fillGallery: function(){
			var self = this;
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) { self.onFileSystemSuccess(fileSystem); }, this._onFail);
		},

		onFileSystemSuccess: function (fileSystem) {
			var tmpPath = this.fotosPath + this.idTask;

			var arPath = tmpPath.split("/"),
				self = this;

			var fnGetOrCreateDir = function(p, de) {
				var entry = p.shift();
				if (entry) {
					de.getDirectory(entry, {create : true, exclusive: false}, function(dirEntry) {
						fnGetOrCreateDir(p, dirEntry);
					}, self._onFail);
				}
				else {
					self.getDirSuccess(de);
				}
			};

			fnGetOrCreateDir(arPath, fileSystem.root);
		},

		getDirSuccess: function(dirEntry) {
			// Get a directory reader
			var directoryReader = dirEntry.createReader(),
				self = this;
			// Get a list of all the entries in the directory
			directoryReader.readEntries(function(entries) { self.readerSuccess(entries); }, this._onFail);
		},

		capturePhoto: function() {
			var self = this;
			// Take picture using device camera and retrieve image as base64-encoded string
			navigator.camera.getPicture(function(imageData) { self._onPhotoDataSuccess(imageData); }, this._onFail, { quality: 50, correctOrientation: true, targetWidth: 1024, targetHeight: 1024 });
		},

		_onPhotoDataSuccess: function(imageData) {
			var self = this;
			window.resolveLocalFileSystemURI(imageData, function(entry) { self._resolveOnSuccess(entry); }, this._onFail);
		},

		//Callback function when the file system uri has been resolved
		_resolveOnSuccess: function(entry){
			var self = this,
				numberPhoto = 1,
				date = moment().format("YYMMDDHHmmss"),
				myFolderApp = self.fotosPath + self.idTask;

			if (this.fotos.size() > 0) {
				var modelMax = this.fotos.max(function(m) { return m.get('number'); });
				numberPhoto = modelMax.get('number') + 1;
			}

			newFileName = 'FOTO'+window.localStorage.getItem(LS_CODETM)+'_'+numberPhoto+'_'+self.idTask+'_'+date+ ".jpg",

			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) {
			//The folder is created if doesn't exist
				fileSys.root.getDirectory( myFolderApp,
					{create:true, exclusive: false},
					function(directory) {
						entry.moveTo(directory, newFileName, function(dirEntry) { self._successMove(dirEntry, numberPhoto, date); }, self._onFail);
					},
					self._onFail);
				},
				self._onFail
			);
		},

		_successMove: function (dirEntry, number, date) {
			var self = this;
			prefixPath = (isIOS()) ? 'file://' : '';
			this.fotos.add(new Foto({
				number: number,
				origin: self.origin,
				path: prefixPath + dirEntry.fullPath,
				name: dirEntry.name,
				data: moment(date, "YYMMDDHHmmss").format("DD/MM/YYYY HH:mm:ss")
			}));
		},

		_onFail: function(message) {
			//alert('Failed because: ' + JSON.stringify(message));
			execError(ERROR.FILE_ERROR, JSON.stringify(message));
		},

		readerSuccess: function(entries){
			var entriesLength = entries.length,
				self = this,
				prefixPath = (isIOS()) ? 'file://' : '';

				for (i=0; i < entriesLength; i++) {
				var fotoName = entries[i].name;
				fotoName = fotoName.replace(window.localStorage.getItem(LS_CODETM), '');
				fotoSplit = fotoName.split('_');
				fotoNumber = parseInt(fotoSplit[1], 10);
				if (_.isUndefined(this.fotos.get(fotoNumber))) {
					this.fotos.add(new Foto({
						number: parseInt(fotoSplit[1], 10),
						origin: self.origin,
						path: prefixPath + entries[i].fullPath,
						name: entries[i].name,
						data: moment(fotoSplit[3].replace('.jpg', ''), "YYMMDDHHmmss").format("DD/MM/YYYY HH:mm:ss")
					}), {silent: true});
				}
			}

			if (this.fotos.size() === 0) {
				$('#mySwipe', this.el).hide();
				$('#no-fotos', this.el).show();
				return;
			}
			$('#mySwipe', this.el).show();
			$('#no-fotos', this.el).hide();

			this.fotos.each(function(foto) {
				var fotoItemView = new FotoItemView({ model: foto });
				$('.swipe-wrap', this.el).append((fotoItemView.render().el));
				$('#position', this.el).append('<li id=' + foto.id + ' class="bullet"></li>');
				fotoItemView.$el.find('.img').css({
					'background-image': 'url('+foto.get('path')+')'
				});
			}, this);
			$('#position li:first-child', self.el).addClass('on');

			require(['swipe'], function(){
				$('.swipe-wrap', self.el).trigger('create');
				self.swipe = new Swipe(document.getElementById('mySwipe'), {
					speed: 400,
					continuous: false,
					disableScroll: false,
					stopPropagation: false,
					callback: function(index, elem) {
						$('#position li').removeClass('on');
						$($('#position li')[index]).addClass('on');
					}
				});
				self.resizeContentImg();
			});
		},

		deleteFoto: function () {
			var pos = this.swipe.getPos(),
				self = this;
			var idFoto = $($('.swipe-wrap div.foto', this.el)[pos]).attr('id');
			if (!_.isUndefined(fotomodel = this.fotos.get(idFoto))) {
				window.resolveLocalFileSystemURI(fotomodel.get('path'), function(fileEntry) {
					fileEntry.remove(function() {
						self.fotos.remove(fotomodel);
					}, self._onFail);
				}, self._onFail);
			}
		},

		deleteFotoAll: function (){
			var tmpPath = this.fotosPath + this.idTask,
				self = this;

			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) {
			//The folder is created if doesn't exist
				fileSys.root.getDirectory( tmpPath,
					{create:false, exclusive: false},
					function(directory) {
						directory.removeRecursively( function(){ self._successBorrats(); }, self._onFail);
					},
					self._onFail);
				},
				self._onFail
			);
		},
		_successBorrats: function (){
			this.fotos.reset();
		}
	});

	var GaleriaFotosPage = Backbone.View.extend({
		idPage: ID_PAGE.GALERIAFOTOS,
		subviews: {},

		initialize:function () {
			this.template = _.template(jqmPageTpl);
			this.subviews.confirmationPopup = new ConfirmationPopup();
		},

		render:function (eventName) {
			$(this.el).html(this.template({headerFixed: true}));
			this.renderPopups();
			this.subviews.headerView = new Header({
				el: $('#page-header', this.el),
				title: 'config.title',
				idPage: this.idPage,
				menuBtns: this.initMenuHeaderBtns(),
				headerExtraBtns: this.initHeaderExtraBtns()
			}).render();

			this.subviews.fotoListView = new FotoListView({
				el: $('#page-content', this.el),
				idTask: this.options.idTask,
				origin: this.options.originid
			}).render();

			this.applyStyles();

			return this;
		},
		renderPopups: function () {
			this.$el.append(this.subviews.confirmationPopup.render().el);
		},
		initMenuHeaderBtns: function () {
			var self = this;
			return [
				{id: 'btn_borrar', icon: 'trash', text: 'menuList.borrarFoto', action: function(event) { self.deleteFoto(); } },
				{id: 'btn_borrarAll', icon: 'trash', text: 'menuList.borrarFotoTodas', action: function(event) { self.deleteFotoAll(); } }
			];
		},

		initHeaderExtraBtns: function () {
			var self = this;
			return [
				{id: 'btn_new', icon: 'camera', text: 'menuList.newFoto', action: function (event) { self.newFoto(); } }
			];
		},

		newFoto: function () {
			this.subviews.fotoListView.capturePhoto();
		},
		deleteFoto: function() {
			var self= this;
			this.subviews.confirmationPopup.openPopup('dialog.delete', 'dialog.deleteFoto', function() {
               $.mobile.loading('hide', {text: $.t("loading.message"), textVisible: true, html: "", theme: "f"});
               self.subviews.fotoListView.deleteFoto();
            });
		},
		deleteFotoAll: function() {
			var self= this;
			this.subviews.confirmationPopup.openPopup('dialog.delete', 'dialog.deleteFotoAll', function() {
              $.mobile.loading('hide', {text: $.t("loading.message"), textVisible: true, html: "", theme: "f"});
              self.subviews.fotoListView.deleteFotoAll();
            });
		},
		events:{
			"orientationchange" : "orientationChange"
		},

		orientationChange: function () {
			this.subviews.fotoListView.resizeContentImg();
		},

		applyStyles:function () {
			$(this.el).addClass('background-images');
			$(this.el).find('.ui-content').addClass('background-images');
		}

	});

	return GaleriaFotosPage;

});